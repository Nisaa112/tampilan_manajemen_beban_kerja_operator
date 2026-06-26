import React, { useEffect, useState } from 'react';
import api from './api';
// 🎨 IMPORT IKON VECTOR MINIMALIS DARI FEATHER ICONS
import { FiUser, FiLogOut, FiSliders } from 'react-icons/fi';

function OperatorDashboard() {
  const [tugas, setTugas] = useState([]);
  const [operatorName, setOperatorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔍 STATE BARU UNTUK MANAJEMEN FILTER TUGAS (Default: 'today')
  const [filter, setFilter] = useState('today');

  // Ambil data tugas dari API Laravel sesuai dengan filter terpilih
  const fetchTugasHariIni = async (selectedFilter) => {
    try {
      setLoading(true);
      const response = await api.get(`/operator/dashboard?filter=${selectedFilter}`);
      setOperatorName(response.data.data.operator_name);
      setTugas(response.data.data.tugas);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat tugas harian.');
      setLoading(false);
    }
  };

  // Pemicu otomatis memuat data setiap kali filter diubah oleh operator
  useEffect(() => {
    fetchTugasHariIni(filter);
  }, [filter]);

  // Fungsi untuk mengubah status pengerjaan part (QUEUED -> PROCESSING -> DONE)
  const handleUpdateStatus = async (jobDetailId, statusBaru) => {
    try {
      await api.put(`/operator/job-detail/${jobDetailId}/status`, {
        status: statusBaru
      });
      alert(`Status berhasil diubah menjadi ${statusBaru}`);
      fetchTugasHariIni(filter); // Refresh data sesuai filter aktif setelah update sukses
    } catch (err) {
      alert('Gagal memperbarui status.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#7f011f' }}>Memuat Tugas...</h3>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif', 
      padding: '30px 20px', 
      boxSizing: 'border-box', 
      color: '#2b2b2b' 
    }}>
      
      {/* HEADER RESPONSIVE */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '15px', 
        borderBottom: '2px solid #e0dbd3', 
        paddingBottom: '15px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '900', 
            color: '#1a1a1a', 
            margin: '0 0 5px 0', 
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FiUser size={24} style={{ color: '#7f011f' }} /> OPERATOR DASHBOARD
          </h2>
          <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px', fontWeight: '500' }}>
            Nama Operator: <strong style={{ color: '#7f011f' }}>{operatorName}</strong>
          </p>
        </div>
        
        <button 
          onClick={handleLogout} 
          style={{ 
            backgroundColor: '#ffffff', 
            color: '#7f011f', 
            border: '1px solid #7f011f', 
            borderRadius: '10px', 
            padding: '8px 16px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            fontSize: '13px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            transition: 'all 0.2s',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.02)'
          }}
        >
          <FiLogOut size={14} /> Sign Out
        </button>
      </div>

      {/* 🔍 CARD FILTER BARU (STYLE INDAH SENADA DENGAN ADMIN PANEL) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '10px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #e0dbd3', 
        padding: '12px 15px', 
        borderRadius: '14px', 
        marginBottom: '20px', 
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)',
        boxSizing: 'border-box'
      }}>
        <span style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FiSliders style={{ color: '#7f011f' }} /> Pilih Rentang Penugasan:
        </span>
        
        {/* Dropdown Pilihan Filter */}
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          style={{ 
            padding: '8px 12px', 
            border: '1px solid #e0dbd3', 
            borderRadius: '8px', 
            backgroundColor: '#faf8f5', 
            color: '#2b2b2b', 
            fontWeight: 'bold', 
            fontSize: '13px', 
            cursor: 'pointer', 
            outline: 'none' 
          }}
        >
          <option value="today">Tugas Hari Ini</option>
          <option value="week">7 Hari Terakhir</option>
          <option value="all">Semua Riwayat Tugas</option>
        </select>
      </div>

      {/* RENDER LIST TUGAS BERDASARKAN FILTER */}
      {tugas.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '40px 20px', 
          backgroundColor: '#ffffff', 
          border: '1px solid #e0dbd3', 
          borderRadius: '20px',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ color: '#8c8c8c', margin: 0, fontWeight: 'bold' }}>
            Tidak ada tugas untuk rentang waktu terpilih.
          </h3>
        </div>
      ) : (
        tugas.map((job) => (
          <div key={job.id} style={{ 
            border: '1px solid #e0dbd3', 
            borderRadius: '20px', 
            padding: '20px', 
            backgroundColor: '#fff', 
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.03)', 
            color: '#333', 
            boxSizing: 'border-box', 
            overflow: 'hidden',
            marginTop: '20px'
          }}>
            
            {/* Header Informasi Mesin */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #f0ede6', paddingBottom: '12px', marginBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', fontWeight: 'bold' }}>Mesin Kerja:</span>
                <strong style={{ fontSize: '16px', color: '#7f011f' }}>{job.machine.machine_name} ({job.machine.plant})</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', fontWeight: 'bold' }}>Tanggal Penugasan:</span>
                <strong style={{ fontSize: '14px' }}>{job.date}</strong> {/* Menampilkan tanggal tugas agar operator tau tugas hari apa */}
              </div>
            </div>

            {/* PEMBUNGKUS SCROLL TABEL */}
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #e0dbd3', borderRadius: '12px' }}>
              <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse', color: '#2b2b2b' }}>
                <thead>
                  <tr style={{ backgroundColor: '#faf8f5', textAlign: 'left', borderBottom: '1px solid #e0dbd3' }}>
                    <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Nama Part</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px', width: '70px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Customer</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px', width: '120px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px', textAlign: 'center', width: '130px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {job.job_details.map((detail) => (
                    <tr key={detail.id} style={{ borderBottom: '1px solid #f0ede6' }}>
                      <td style={{ padding: '14px', fontSize: '14px', fontWeight: '600' }}>{detail.part_name}</td>
                      <td style={{ padding: '14px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>{detail.qty}</td>
                      <td style={{ padding: '14px', fontSize: '14px', color: '#666' }}>{detail.customer}</td>
                      
                      {/* Live Status Badge */}
                      <td style={{ padding: '14px', fontSize: '14px', textAlign: 'center' }}>
                        <span style={{
                          fontWeight: 'bold',
                          fontSize: '11px',
                          display: 'inline-block',
                          width: '95px',
                          textAlign: 'center',
                          padding: '5px 8px',
                          borderRadius: '4px',
                          color: detail.status === 'QUEUED' ? '#856404' : detail.status === 'PROCESSING' ? '#004085' : detail.status === 'HOLD' ? '#383d41' : '#155724',
                          backgroundColor: detail.status === 'QUEUED' ? '#fff3cd' : detail.status === 'PROCESSING' ? '#cce5ff' : detail.status === 'HOLD' ? '#e2e3e5' : '#d4edda',
                          border: `1px solid ${detail.status === 'QUEUED' ? '#ffeeba' : detail.status === 'PROCESSING' ? '#b8daff' : detail.status === 'HOLD' ? '#d6d8db' : '#c3e6cb'}`
                        }}>
                          {detail.status}
                        </span>
                      </td>

                      {/* Tombol Tindakan Operator */}
                      <td style={{ padding: '14px', fontSize: '14px', textAlign: 'center' }}>
                        {detail.status === 'QUEUED' && (
                          <button 
                            onClick={() => handleUpdateStatus(detail.id, 'PROCESSING')}
                            style={{ 
                              backgroundColor: '#7f011f', 
                              color: '#ffffff', 
                              border: 'none', 
                              padding: '8px 14px', 
                              borderRadius: '8px', 
                              cursor: 'pointer', 
                              fontWeight: 'bold', 
                              fontSize: '12px',
                              boxShadow: '0px 4px 10px rgba(127, 1, 31, 0.15)' 
                            }}
                          >
                            Mulai Kerja
                          </button>
                        )}
                        {detail.status === 'PROCESSING' && (
                          <button 
                            onClick={() => handleUpdateStatus(detail.id, 'DONE')}
                            style={{ 
                              backgroundColor: '#28a745', 
                              color: '#ffffff', 
                              border: 'none', 
                              padding: '8px 14px', 
                              borderRadius: '8px', 
                              cursor: 'pointer', 
                              fontWeight: 'bold', 
                              fontSize: '12px',
                              boxShadow: '0px 4px 10px rgba(40, 167, 69, 0.15)' 
                            }}
                          >
                            Selesai
                          </button>
                        )}
                        {detail.status === 'HOLD' && (
                          <span style={{ color: '#6c757d', fontWeight: 'bold', fontSize: '13px' }}>⏸️ Hold</span>
                        )}
                        {detail.status === 'DONE' && (
                          <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '13px' }}>✔ Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default OperatorDashboard;