import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('name') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <div>
          <h2>ADMIN SYSTEM DASHBOARD</h2>
          <p>Login sebagai: <strong>{adminName}</strong></p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
        
        {/* Card 1: Master Mesin */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>🛠️ Master Mesin</h3>
          <p style={{ color: '#666' }}>Kelola data mesin bubut, CNC, stamping, beserta lokasi plant pabrik.</p>
          <button 
            onClick={() => navigate('/master-mesin')}
            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
            Buka Master Mesin
          </button>
        </div>

        {/* Card 2: Master Operator */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>👥 Master Operator</h3>
          <p style={{ color: '#666' }}>Kelola data pegawai, pembuatan akun login operator, dan mesin bawaan.</p>
          <button 
            onClick={() => navigate('/master-operator')}
            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
            Buka Master Operator
          </button>
        </div>

        {/* Card 3: Loading Pekerjaan */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3>📝 Kirim Tugas</h3>
          <p style={{ color: '#666' }}>Tentukan jadwal pengerjaan part harian dan kirimkan langsung ke operator.</p>
          <button 
            onClick={() => navigate('/kirim-tugas')}
            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
            Buat Tugas Baru
          </button>
        </div>

        {/* Card 4: LIVE MONITORING (BARU) */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderLeft: '5px solid #28a745' }}>
          <h3>📡 Live Monitoring Tugas</h3>
          <p style={{ color: '#666' }}>Pantau status pengerjaan part operator di pabrik secara Real-Time.</p>
          <button 
            onClick={() => navigate('/monitoring-tugas')}
            style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
            Pantau Live Proses
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;