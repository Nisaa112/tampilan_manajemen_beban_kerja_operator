import React, { useState } from 'react';
import api from './api';

function Login() {
  const [serialNumber, setSerialNumber] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('REACT-BROWSER-01');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Sedang masuk...');

    try {
      const response = await api.post('/login', {
        serial_number: serialNumber,
        password: password,
        device_id: deviceId
      });

      const { token } = response.data.authorization;
      const { name, role } = response.data.user;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);

      setMessage(`Login Berhasil!`);

      if (role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/operator-dashboard';
      }

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Kredensial salah');
      } else {
        setMessage('Tidak dapat terhubung ke server');
      }
    }
  };

  return (
    // 1. LAYOUT INDUK: Menghasilkan latar belakang krem penuh di layar
    <div style={{
      backgroundColor: '#f4efe6',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      
      {/* HEADER DEKORATIF (Meniru LOGO Spark di kiri atas) */}
      {/* <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
        <span style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-1px' }}>
          CAT<span style={{ color: '#f5b971' }}>+</span>
        </span>
        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>sales@spark.in</span>
      </div> */}

      {/* 2. KARTU LOGIN (Putih, Melengkung Lembut, dengan Shadow) */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '40px 30px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.03)',
        textAlign: 'center',
        boxSizing: 'border-box',
        margin: 'auto 0'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2b2b2b', margin: '0 0 8px 0' }}>
          User Login
        </h1>
        <p style={{ fontSize: '13px', color: '#8c8c8c', margin: '0 0 24px 0', lineHeight: '1.5' }}>
          Hey, Enter your details to get log in to your account
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 3. FIELD INPUT SERIAL NUMBER (Dengan posisi relatif untuk Ikon) */}
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Enter Serial Number"
              value={serialNumber} 
              onChange={(e) => setSerialNumber(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px', // Padding kanan disisakan 40px untuk ruang ikon
                fontSize: '14px',
                border: '1px solid #e0dbd3',
                borderRadius: '10px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#faf8f5',
                color: '#333'
              }}
            />
            {/* Ikon User berbentuk Lingkaran Minimalis (SVG) */}
            <svg style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', fill: 'none', stroke: '#8c8c8c', strokeWidth: '2' }} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>

          {/* FIELD INPUT PASSWORD */}
          <div style={{ position: 'relative' }}>
            <input 
              type="password" 
              placeholder="Passcode"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px',
                fontSize: '14px',
                border: '1px solid #e0dbd3',
                borderRadius: '10px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#faf8f5',
                color: '#333'
              }}
            />
            {/* Ikon Kunci Gembok Minimalis (SVG) */}
            <svg style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', fill: 'none', stroke: '#8c8c8c', strokeWidth: '2' }} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          {/* Teks Bantuan Minimalis */}
          <span style={{ fontSize: '11px', color: '#1a1a1a', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', margin: '-4px 0 10px 0' }}>
            Having trouble in log in?
          </span>

          {/* 4. TOMBOL LOG IN JINGGA PASTEL */}
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#7f011f',
            color: '#ffffff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s',
            boxShadow: '0px 4px 10px rgba(245, 185, 113, 0.2)'
          }}>
            Log in
          </button>
        </form>

        {message && <p style={{ marginTop: '15px', color: '#ff4d4f', fontSize: '13px', fontWeight: '500' }}>{message}</p>}
      </div>

      {/* FOOTER DEKORATIF BAWAH */}
      <div style={{ width: '100%', textAlign: 'center', fontSize: '11px', color: '#8c8c8c', padding: '15px 0' }}>
        Copyright @CAT 2026 | Privacy Policy
      </div>

    </div>
  );
}

export default Login;