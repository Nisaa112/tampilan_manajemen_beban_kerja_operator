import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function MasterOperator() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState([]);
  const [machines, setMachines] = useState([]);
  
  // State Form
  const [serialNumber, setSerialNumber] = useState('');
  const [password, setPassword] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jKelamin, setJKelamin] = useState('laki-laki');
  const [machineId, setMachineId] = useState('');
  const [role, setRole] = useState('pegawai'); // 👥 Default diubah ke 'pegawai' agar sinkron dengan seeder
  const [message, setMessage] = useState('');

  // 👁️ STATE UNTUK TOGGLE LIHAT PASSWORD
  const [showPassword, setShowPassword] = useState(false);

  const fetchData = async () => {
    try {
      const resMachines = await api.get('/machines');
      if (resMachines.data && resMachines.data.data) {
        setMachines(resMachines.data.data);
        if (resMachines.data.data.length > 0) {
          setMachineId(resMachines.data.data[0].id);
        }
      } else if (Array.isArray(resMachines.data)) {
        setMachines(resMachines.data);
        if (resMachines.data.length > 0) {
          setMachineId(resMachines.data[0].id);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data master mesin di operator page:", err);
    }

    try {
      const resOperators = await api.get('/operators');
      if (resOperators.data && resOperators.data.data) {
        setOperators(resOperators.data.data);
      } else if (Array.isArray(resOperators.data)) {
        setOperators(resOperators.data);
      }
    } catch (err) {
      console.error("Gagal memuat data list operator:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/operators', {
        serial_number: serialNumber,
        password: password,
        operator_name: operatorName,
        phone_number: phoneNumber,
        j_kelamin: jKelamin,
        machine_id: machineId,
        role: role // 👥 KIRIM DATA ROLE KE API
      });
      setMessage('Operator & Akun Login berhasil dibuat!');
      // Reset form
      setSerialNumber('');
      setPassword('');
      setOperatorName('');
      setPhoneNumber('');
      setRole('pegawai'); // Reset ke default
      setShowPassword(false);
      fetchData(); // Refresh list
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
          setMessage('Gagal Validasi: ' + validationErrors);
        } else if (err.response.data.error) {
          setMessage('Server Error (500): ' + err.response.data.error);
        } else {
          setMessage('Gagal: ' + (err.response.data.message || 'Terjadi kesalahan server'));
        }
      } else {
        setMessage('Gagal mendaftarkan operator baru.');
      }
    }
  };

  return (
    // 📱 KONTEN UTAMA RESPONSIVE DENGAN BOX-SIZING & PADDING PERSENTASE
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '15px', boxSizing: 'border-box', color: '#fff' }}>
      
      <button onClick={() => navigate('/admin-dashboard')} style={{ marginBottom: '15px', padding: '8px 12px', cursor: 'pointer' }}>🔙 Kembali</button>
      <h2 style={{ fontSize: '20px', margin: '10px 0' }}>👥 MASTER DATA OPERATOR</h2>

      {/* Form Input Operator */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', color: '#333', marginBottom: '30px', boxSizing: 'border-box' }}>
        <h3 style={{ color: '#333', marginTop: 0, fontSize: '16px' }}>Pendaftaran Operator Baru</h3>
        
        {/* 📱 FORM GRID RESPONSIVE (MENGGUNAKAN AUTO-FIT MINMAX) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ color: '#333' }}>Username / Serial Number:</label>
            <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} placeholder="Contoh: OP-003" />
          </div>
          
          <div>
            <label style={{ color: '#333' }}>Password Akun:</label>
            <div style={{ position: 'relative', marginTop: '5px' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '8px', paddingRight: '40px', boxSizing: 'border-box' }} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: 0
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ color: '#333' }}>Nama Lengkap Operator:</label>
            <input type="text" value={operatorName} onChange={(e) => setOperatorName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: '#333' }}>No. Handphone:</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} placeholder="0812..." />
          </div>
          <div>
            <label style={{ color: '#333' }}>Jenis Kelamin:</label>
            <select value={jKelamin} onChange={(e) => setJKelamin(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#333' }}>Kunci Mesin Bawaan:</label>
            <select value={machineId} onChange={(e) => setMachineId(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
              {Array.isArray(machines) && machines.map((m) => (
                <option key={m.id} value={m.id}>{m.machine_name} ({m.plant})</option>
              ))}
            </select>
          </div>

          {/* 👥 INPUT DROPDOWN ROLE RESPONSIVE */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ color: '#333', fontWeight: 'bold' }}>Role Pengguna / Hak Akses:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
              <option value="pegawai">Pegawai (Operator Mesin)</option>
              <option value="admin">Admin (Pengelola Sistem)</option>
            </select>
          </div>
        </div>
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' }}>Simpan Operator</button>
        {message && <p style={{ marginTop: '10px', color: 'blue', fontWeight: 'bold' }}>{message}</p>}
      </form>

      {/* Tabel Operator */}
      <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Daftar Operator Terdaftar</h3>
      
      {/* 📱 PEMBUNGKUS SCROLL TABEL AGAR RESPONSIVE DI HP */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', backgroundColor: '#fff', color: '#333' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
              <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Serial Number</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Nama Operator</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>No. HP</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6', width: '100px' }}>Role</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Mesin Default</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(operators) && operators.length > 0 ? (
              operators.map((op) => (
                <tr key={op.id}>
                  <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{op.user?.serial_number}</td>
                  <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{op.operator_name}</td>
                  <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{op.phone_number}</td>
                  <td style={{ padding: '8px', border: '1px solid #dee2e6', textTransform: 'capitalize', fontWeight: 'bold', color: op.user?.role === 'admin' ? '#dc3545' : '#28a745' }}>
                    {op.user?.role}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{op.machine?.machine_name || 'Tidak ada'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#999' }}>
                  Tidak ada data operator / Gagal memuat data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MasterOperator;