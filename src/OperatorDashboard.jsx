import React, { useEffect, useState } from 'react';
import api from './api';

function OperatorDashboard() {
  const [tugas, setTugas] = useState([]);
  const [operatorName, setOperatorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTugasHariIni = async () => {
    try {
      const response = await api.get('/operator/dashboard');
      setOperatorName(response.data.data.operator_name);
      setTugas(response.data.data.tugas);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat tugas harian.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTugasHariIni();
  }, []);

  // ⚙️ FUNGSI BARU: Mengirim status pengerjaan sesuai dengan Laravel
  const handleUpdateStatus = async (jobDetailId, statusBaru) => {
    try {
      await api.put(`/operator/job-detail/${jobDetailId}/status`, {
        status: statusBaru // Mengirim 'PROCESSING' atau 'DONE'
      });
      alert(`Status berhasil diubah menjadi ${statusBaru}`);
      fetchTugasHariIni();
    } catch (err) {
      alert('Gagal memperbarui status.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>Memuat Tugas...</h3>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <div>
          <h2>OPERATOR DASHBOARD</h2>
          <p>Nama Operator: <strong>{operatorName}</strong></p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {tugas.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#6c757d' }}>
          <h3>Tidak ada tugas harian untuk Anda hari ini.</h3>
        </div>
      ) : (
        tugas.map((job) => (
          <div key={job.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginTop: '20px', backgroundColor: '#f8f9fa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Mesin: <strong>{job.machine.machine_name}</strong></span>
              <span>Plant: <strong>{job.machine.plant}</strong></span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Nama Part</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Qty</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Customer</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {job.job_details.map((detail) => (
                  <tr key={detail.id}>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{detail.part_name}</td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{detail.qty}</td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{detail.customer}</td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>
                      {/* 🎨 WARNA BADGE YANG DISESUAIKAN DENGAN STATUS LARAVEL */}
                      <span style={{
                        color: detail.status === 'QUEUED' ? '#ffc107' : detail.status === 'PROCESSING' ? '#007bff' : detail.status === 'HOLD' ? '#6c757d' : '#28a745',
                        backgroundColor: detail.status === 'QUEUED' ? '#fff3cd' : detail.status === 'PROCESSING' ? '#cce5ff' : detail.status === 'HOLD' ? '#e2e3e5' : '#d4edda',
                        padding: '4px 8px', borderRadius: '4px'
                      }}>
                        {detail.status}
                      </span>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      {/* ⚙️ TOMBOL AKSI MENGIKUTI STATUS LARAVEL */}
                      {detail.status === 'QUEUED' && (
                        <button 
                          onClick={() => handleUpdateStatus(detail.id, 'PROCESSING')}
                          style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                          Mulai Kerja
                        </button>
                      )}
                      {detail.status === 'PROCESSING' && (
                        <button 
                          onClick={() => handleUpdateStatus(detail.id, 'DONE')}
                          style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                          Selesai
                        </button>
                      )}
                      {detail.status === 'HOLD' && (
                        <span style={{ color: '#6c757d', fontWeight: 'bold' }}>⏸️ Hold</span>
                      )}
                      {detail.status === 'DONE' && (
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>✔ Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default OperatorDashboard;