import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
// 🎨 IMPORT IKON VECTOR MINIMALIS DARI FEATHER ICONS
import { FiMonitor, FiArrowLeft, FiPlus, FiSearch } from 'react-icons/fi';

function MonitoringTugas() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State Monitoring & Timer
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(10);

  // 🔍 STATE BARU UNTUK PENCARIAN BERDASARKAN NAMA PART (Selesai di-update)
  const [searchPart, setSearchPart] = useState('');

  // STATE BARU UNTUK PAGINATION (Dibatasi 3 kartu tugas per halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); 

  // MEMINTA IZIN BROWSER UNTUK MEMUNCULKAN NOTIFIKASI
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    fetchAllJobs();
  }, []);

  // FUNGSI UNTUK MEMICU SUARA DAN POP-UP NOTIFIKASI DESKTOP
  const triggerSystemNotification = (operatorName, partName, oldStatus, newStatus) => {
    if (Notification.permission === 'granted') {
      new Notification(`📡 UPDATE STATUS MESIN!`, {
        body: `Operator [${operatorName}] mengubah part [${partName}] dari [${oldStatus}] menjadi [${newStatus}]`,
        icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png'
      });

      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      audio.play().catch(() => {});
    }
  };

  // LOGIKA MEMBANDINGKAN DATA LAMA VS DATA BARU (Untuk Trigger Notifikasi)
  const checkStatusChanges = (newJobs, oldJobs) => {
    if (oldJobs.length === 0) return;

    const oldStatusMap = {};
    oldJobs.forEach(job => {
      job.job_details?.forEach(detail => {
        oldStatusMap[detail.id] = {
          status: detail.status,
          operator: job.operator?.operator_name,
          part: detail.part_name
        };
      });
    });

    newJobs.forEach(job => {
      job.job_details?.forEach(detail => {
        const oldData = oldStatusMap[detail.id];
        if (oldData && oldData.status !== detail.status) {
          triggerSystemNotification(oldData.operator, oldData.part, oldData.status, detail.status);
        }
      });
    });
  };

  const fetchAllJobs = async () => {
    try {
      const response = await api.get('/loading-jobs');
      const newJobs = response.data.data;

      setJobs((prevJobs) => {
        checkStatusChanges(newJobs, prevJobs);
        return newJobs;
      });

      setLoading(false);
    } catch (err) {
      setError('Gagal mengambil data monitoring.');
      setLoading(false);
    }
  };

  // TIMER HITUNG MUNDUR (1 DETIK)
  useEffect(() => {
    let timer = null;

    if (autoRefresh) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setCountdown(10);
    }

    return () => clearInterval(timer);
  }, [autoRefresh]);

  // EKSEKUSI REFRESH JIKA TIMER MENYENTUH 0
  useEffect(() => {
    if (countdown === 0) {
      fetchAllJobs();
      setCountdown(10);
    }
  }, [countdown]);

  // 🔍 LOGIKA FILTER DATA CERDAS BERDASARKAN NAMA PART (Menggunakan .some())
  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job =>
    job.job_details?.some(detail =>
      detail.part_name?.toLowerCase().includes(searchPart.toLowerCase())
    )
  ) : [];

  // LOGIKA PAGINATION (Slicing data yang sudah difilter)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#7f011f' }}>Memuat Monitoring...</h3>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    // 📱 KONTEN UTAMA RESPONSIVE DENGAN PADDING & WARNA TEKS GELAP (#2b2b2b)
    <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif', padding: '30px 20px', boxSizing: 'border-box', color: '#2b2b2b' }}>
      
      {/* HEADER NAVIGASI RESPONSIVE (DENGAN FLEX WRAP & GAP) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', borderBottom: '2px solid #e0dbd3', paddingBottom: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/admin-dashboard')} 
            style={{ 
              backgroundColor: '#ffffff', color: '#7f011f', border: '1px solid #7f011f', borderRadius: '10px', 
              padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' 
            }}
          >
            <FiArrowLeft size={14} /> Dashboard
          </button>
          <button 
            onClick={() => navigate('/kirim-tugas')} 
            style={{ 
              backgroundColor: '#7f011f', color: '#ffffff', border: 'none', borderRadius: '10px', 
              padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0px 4px 10px rgba(127, 1, 31, 0.15)'
            }}
          >
            <FiPlus size={16} /> Kirim Tugas Baru
          </button>
        </div>
        
        {/* JUDUL MONITORING DENGAN IKON MONITOR VECTOR */}
        <h2 style={{ 
          margin: 0, fontSize: '22px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.5px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <FiMonitor size={24} style={{ color: '#7f011f' }} /> LIVE MONITORING
        </h2>
      </div>

      {/* CHECKBOX AUTO REFRESH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', backgroundColor: '#ffffff', border: '1px solid #e0dbd3', padding: '12px 15px', borderRadius: '14px', marginBottom: '20px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)' }}>
        <span style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: 'bold' }}>Sistem Pemantauan Proses Tugas Operator secara Real-Time.</span>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: autoRefresh ? '#28a745' : '#6c757d', fontSize: '13px' }}>
          <input 
            type="checkbox" 
            checked={autoRefresh} 
            onChange={(e) => setAutoRefresh(e.target.checked)} 
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          {autoRefresh ? `🔄 Auto (${countdown}s)` : '⏸️ Off'}
        </label>
      </div>

      {/* 🔍 BARIS PENCARIAN BERDASARKAN NAMA PART */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '25px' }}>
        <input
          type="text"
          placeholder="Cari berdasarkan nama part..."
          value={searchPart}
          onChange={(e) => {
            setSearchPart(e.target.value);
            setCurrentPage(1); // Otomatis reset ke halaman 1 saat mengetik
          }}
          style={{
            width: '100%',
            padding: '12px 16px 12px 40px',
            border: '1px solid #e0dbd3',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            color: '#333',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.01)'
          }}
        />
        <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#8c8c8c', fontSize: '16px' }} />
      </div>

      {/* RENDER LIST KARTU TUGAS */}
      {filteredJobs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '50px', fontWeight: '500' }}>Tugas harian tidak ditemukan / Belum ada data.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' }}>
          {currentJobs.map((job) => (
            <div key={job.id} style={{ 
              border: '1px solid #e0dbd3', 
              borderRadius: '20px', 
              padding: '20px', 
              backgroundColor: '#fff', 
              boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.03)', 
              color: '#333', 
              boxSizing: 'border-box', 
              overflow: 'hidden' 
            }}>
              
              {/* HEADER DATA KARTU */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f0ede6', paddingBottom: '12px', marginBottom: '15px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', fontWeight: 'bold' }}>Operator Ditugaskan:</span>
                  <strong style={{ fontSize: '16px', color: '#7f011f' }}>{job.operator?.operator_name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', fontWeight: 'bold' }}>Mesin & Lokasi:</span>
                  <strong style={{ fontSize: '14px' }}>{job.machine?.machine_name} ({job.machine?.plant})</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', fontWeight: 'bold' }}>Tanggal Kerja:</span>
                  <strong style={{ fontSize: '14px' }}>{job.date}</strong>
                </div>
              </div>

              {/* PEMBUNGKUS SCROLL TABEL */}
              <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #e0dbd3', borderRadius: '12px' }}>
                <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#faf8f5', textAlign: 'left', borderBottom: '1px solid #e0dbd3' }}>
                      <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Nama Part</th>
                      <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px', width: '70px', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Nama Customer</th>
                      <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px', width: '140px', textAlign: 'center' }}>Live Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.job_details?.map((detail) => (
                      <tr key={detail.id} style={{ borderBottom: '1px solid #f0ede6' }}>
                        {/* Memberikan warna teks tebal pada nama part yang cocok dengan pencarian */}
                        <td style={{ 
                          padding: '14px', 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: searchPart && detail.part_name?.toLowerCase().includes(searchPart.toLowerCase()) ? '#7f011f' : '#2b2b2b'
                        }}>
                          {detail.part_name}
                        </td>
                        <td style={{ padding: '14px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>{detail.qty}</td>
                        <td style={{ padding: '14px', fontSize: '14px', color: '#666' }}>{detail.customer}</td>
                        <td style={{ padding: '14px', fontSize: '14px', textAlign: 'center' }}>
                          <span style={{
                            fontWeight: 'bold',
                            fontSize: '12px',
                            display: 'inline-block',
                            width: '110px',
                            textAlign: 'center',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            color: detail.status === 'QUEUED' ? '#856404' : detail.status === 'PROCESSING' ? '#004085' : detail.status === 'HOLD' ? '#383d41' : '#155724',
                            backgroundColor: detail.status === 'QUEUED' ? '#fff3cd' : detail.status === 'PROCESSING' ? '#cce5ff' : detail.status === 'HOLD' ? '#e2e3e5' : '#d4edda',
                            border: `1px solid ${detail.status === 'QUEUED' ? '#ffeeba' : detail.status === 'PROCESSING' ? '#b8daff' : detail.status === 'HOLD' ? '#d6d8db' : '#c3e6cb'}`
                          }}>
                            {detail.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MENU NAVIGASI PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: '500' }}>
            Menampilkan <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, filteredJobs.length)}</strong> dari <strong>{filteredJobs.length}</strong> penugasan
          </span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{ padding: '8px 12px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#ffffff', color: currentPage === 1 ? '#cccccc' : '#7f011f', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                style={{ width: '36px', height: '36px', border: currentPage === pageNumber ? 'none' : '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: currentPage === pageNumber ? '#7f011f' : '#ffffff', color: currentPage === pageNumber ? '#ffffff' : '#2b2b2b', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: currentPage === pageNumber ? '0px 3px 8px rgba(127, 1, 31, 0.15)' : 'none', transition: 'all 0.2s' }}
              >
                {pageNumber}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{ padding: '8px 12px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#ffffff', color: currentPage === totalPages ? '#cccccc' : '#7f011f', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonitoringTugas;