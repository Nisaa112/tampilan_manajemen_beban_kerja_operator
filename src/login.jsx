import React, { useState } from 'react';
import api from './api'; // Import konfigurasi axios kita sebelumnya

function Login() {
  const [serialNumber, setSerialNumber] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('REACT-BROWSER-01'); // Dummy device ID
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Sedang masuk...');

    try {
      // Tembak API Laravel
      const response = await api.post('/login', {
        serial_number: serialNumber,
        password: password,
        device_id: deviceId
      });

      // Jika sukses, dapatkan token dan data user
      const { token } = response.data.authorization;
      const { name, role } = response.data.user;

      // Simpan Token dan Role ke LocalStorage browser
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);

      setMessage(`Login Berhasil! Selamat datang ${name} (${role})`);

      // Arahkan halaman berdasarkan role
      if (role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/operator-dashboard';
      }

    } catch (error) {
      // Jika gagal, tampilkan pesan error dari Laravel
      if (error.response) {
        setMessage(error.response.data.message || 'Kredensial salah');
      } else {
        setMessage('Tidak dapat terhubung ke server');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>MESIN SYSTEM - LOGIN</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Serial Number (Username):</label>
          <input 
            type="text" 
            value={serialNumber} 
            onChange={(e) => setSerialNumber(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Masuk
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', color: 'red', textAlign: 'center' }}>{message}</p>}
    </div>
  );
}

export default Login;