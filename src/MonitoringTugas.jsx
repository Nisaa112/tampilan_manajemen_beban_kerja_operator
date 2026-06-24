import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function MonitoringTugas() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State Monitoring & Timer
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(10);

  // 🔔 1. MEMINTA IZIN BROWSER UNTUK MEMUNCULKAN NOTIFIKASI SAAT HALAMAN DIBUKA
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    fetchAllJobs();
  }, []);

  // 🔔 2. FUNGSI UNTUK MEMICU SUARA DAN POP-UP NOTIFIKASI DESKTOP
  const triggerSystemNotification = (operatorName, partName, oldStatus, newStatus) => {
    if (Notification.permission === 'granted') {
      // A. Jalankan Pop-up Desktop
      new Notification(`📡 UPDATE STATUS MESIN!`, {
        body: `Operator [${operatorName}] mengubah part [${partName}] dari [${oldStatus}] menjadi [${newStatus}]`,
        icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png' // Icon mesin
      });

      // B. Putar Suara Bell Nyaring (Menggunakan URL sound effect gratis)
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
      audio.play().catch(() => {
        console.log("Suara terblokir aturan browser. Admin harus klik layar sekali agar suara aktif.");
      });
    }
  };

  // 🔔 3. LOGIKA MEMBANDINGKAN DATA LAMA VS DATA BARU
  const checkStatusChanges = (newJobs, oldJobs) => {
    if (oldJobs.length === 0) return; // Jangan bunyikan notifikasi pada saat pertama kali load halaman

    // Buat kamus status lama berdasarkan ID job_details
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

    // Bandingkan dengan data baru yang baru saja di-refresh
    newJobs.forEach(job => {
      job.job_details?.forEach(detail => {
        const oldData = oldStatusMap[detail.id];
        // JIKA STATUS BERUBAH!
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

      // Gunakan functional state update agar kita bisa membandingkan data lama (prevJobs) dengan data baru (newJobs)
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

  // ⏱️ TIMER HITUNG MUNDUR (1 DETIK)
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

  // 📡 EKSEKUSI REFRESH JIKA TIMER MENYENTUH 0
  useEffect(() => {
    if (countdown === 0) {
      fetchAllJobs();
      setCountdown(10);
    }
  }, [countdown]);

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>Memuat Monitoring...</h3>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    // 📱 KONTEN UTAMA RESPONSIVE DENGAN BOX-SIZING & PADDING PERSENTASE
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '15px', boxSizing: 'border-box' }}>
      
      {/* 📱 HEADER NAVIGASI RESPONSIVE (DENGAN FLEX WRAP & GAP) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin-dashboard')} style={{ padding: '8px 12px', cursor: 'pointer' }}>🔙 Dashboard</button>
          <button onClick={() => navigate('/kirim-tugas')} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>📝 Kirim Tugas Baru</button>
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', textAlign: 'right' }}>📡 LIVE MONITORING</h2>
      </div>

      {/* 📱 CHECKBOX AUTO REFRESH RESPONSIVE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', backgroundColor: '#f1f3f5', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px' }}>
        <span style={{ fontSize: '14px' }}>Menampilkan seluruh riwayat tugas harian operator.</span>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: autoRefresh ? '#28a745' : '#6c757d', fontSize: '14px' }}>
          <input 
            type="checkbox" 
            checked={autoRefresh} 
            onChange={(e) => setAutoRefresh(e.target.checked)} 
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          {autoRefresh ? `🔄 Auto (${countdown}s)` : '⏸️ Off'}
        </label>
      </div>

      {/* RENDER LIST TUGAS */}
      {jobs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>Belum ada tugas yang dikirim ke operator manapun.</p>
      ) : (
        // 🔒 Kunci grid menggunakan template columns yang aman agar grid-item tidak melebar paksa
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' }}>
          {jobs.map((job) => (
            // 🔒 KUNCI CARD PENAMPUNG DENGAN 'overflow: hidden' AGAR TIDAK MELEBAR IKUTI TABEL
            <div key={job.id} style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', color: '#333', boxSizing: 'border-box', overflow: 'hidden' }}>
              
              {/* 📱 HEADER CARD PEKERJAAN RESPONSIVE (FLEX WRAP) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block' }}>Operator Ditugaskan:</span>
                  <strong style={{ fontSize: '16px', color: '#007bff' }}>{job.operator?.operator_name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block' }}>Mesin & Lokasi:</span>
                  <strong style={{ fontSize: '14px' }}>{job.machine?.machine_name} ({job.machine?.plant})</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#666', display: 'block' }}>Tanggal Kerja:</span>
                  <strong style={{ fontSize: '14px' }}>{job.date}</strong>
                </div>
              </div>

              {/* 📱 PEMBUNGKUS SCROLL TABEL (KINI DIKUNCI MATI DENGAN LEBAR MAKSIMAL 100%) */}
              <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #dee2e6', borderRadius: '4px' }}>
                <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                      <th style={{ padding: '10px 8px', borderBottom: '1px solid #dee2e6' }}>Nama Part</th>
                      <th style={{ padding: '10px 8px', borderBottom: '1px solid #dee2e6', width: '70px', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '10px 8px', borderBottom: '1px solid #dee2e6' }}>Nama Customer</th>
                      <th style={{ padding: '10px 8px', borderBottom: '1px solid #dee2e6', width: '140px', textAlign: 'center' }}>Live Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.job_details?.map((detail) => (
                      <tr key={detail.id}>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{detail.part_name}</td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{detail.qty}</td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{detail.customer}</td>
                        <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                          <span style={{
                            fontWeight: 'bold',
                            fontSize: '12px',
                            display: 'inline-block',
                            width: '110px',
                            textAlign: 'center',
                            padding: '4px 8px',
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
    </div>
  );
}

export default MonitoringTugas;