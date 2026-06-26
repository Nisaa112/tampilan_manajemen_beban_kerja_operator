import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// 🎨 IMPORT IKON MINIMALIS DARI FEATHER ICONS (FI)
import { FiLayout, FiCpu, FiUsers, FiClipboard, FiMonitor, FiLogOut } from 'react-icons/fi';

function Sidebar() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 📡 Tarik nama dan role user yang sedang login dari LocalStorage secara dinamis
  const userName = localStorage.getItem('name') || 'User';
  const userRole = localStorage.getItem('role') || 'admin';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🎨 DAFTAR MENU DENGAN IKON VECTOR MINIMALIS MODERN
  const navLinks = [
    { name: 'Dashboard', href: '/admin-dashboard', icon: <FiLayout size={18} /> },
    { name: 'Mesin', href: '/master-mesin', icon: <FiCpu size={18} /> },
    { name: 'Operator', href: '/master-operator', icon: <FiUsers size={18} /> },
    { name: 'Tugas', href: '/kirim-tugas', icon: <FiClipboard size={18} /> },
    { name: 'Monitor', href: '/monitoring-tugas', icon: <FiMonitor size={18} /> }
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // ===================================================
  // 📱 TAMPILAN RESPONSIVE HP (HORIZONTAL TOP NAVBAR)
  // ===================================================
  if (isMobile) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0dbd3',
        padding: '12px 15px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-1px' }}>
            CAT<span style={{ color: '#7f011f' }}>+</span>
          </span>
          <button 
            onClick={handleLogout} 
            style={{
              background: 'none', border: 'none', color: '#dc3545', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            <FiLogOut size={14} /> Sign Out
          </button>
        </div>
        
        {/* Scrollable menu horizontal di HP */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '5px' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link key={link.name} to={link.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: isActive ? '#ffffff' : '#2b2b2b',
                backgroundColor: isActive ? '#7f011f' : '#faf8f5',
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0px 3px 8px rgba(127, 1, 31, 0.15)' : 'none'
              }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // ===================================================
  // 💻 TAMPILAN DESKTOP (LEFT SIDEBAR DENGAN KARTU PROFIL)
  // ===================================================
  return (
    <div style={{
      width: '260px',
      backgroundColor: '#ffffff',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid #e0dbd3',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '30px 20px',
      boxSizing: 'border-box',
      zIndex: 1000
    }}>
      <div>
        {/* Bagian Logo CAT+ */}
        <div style={{ marginBottom: '25px', paddingLeft: '10px' }}>
          <span style={{ fontSize: '26px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-1.5px' }}>
            CAT<span style={{ color: '#7f011f' }}>+</span>
          </span>
          <span style={{ display: 'block', fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
            Dashboard Admin
          </span>
        </div>

        {/* 👤 SEKSI PROFILE USER TERINTEGRASI (BARU) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          backgroundColor: '#faf8f5', // Senada dengan background input gembok login
          borderRadius: '16px',
          border: '1px solid #e0dbd3',
          marginBottom: '30px'
        }}>
          {/* Avatar Lingkaran dengan Inisial Nama Pertama */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#7f011f', // Merah Maroon CAT+
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            textTransform: 'uppercase'
          }}>
            {userName ? userName.charAt(0) : 'A'}
          </div>

          {/* Teks Informasi Pengguna */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '140px' // Mencegah teks meluber melewati batas sidebar
            }} title={userName}>
              {userName}
            </span>
            <span style={{
              fontSize: '11px',
              color: '#8c8c8c',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              marginTop: '2px'
            }}>
              {userRole}
            </span>
          </div>
        </div>

        {/* Jajaran Link Menu */}
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.name}>
                <Link to={link.href} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  color: isActive ? '#ffffff' : '#2b2b2b',
                  backgroundColor: isActive ? '#7f011f' : 'transparent',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0px 4px 10px rgba(127, 1, 31, 0.15)' : 'none'
                }}>
                  {/* Bagian render ikon vector */}
                  <span style={{ display: 'flex', alignItems: 'center' }}>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tombol Sign Out bawah */}
      <div>
        <button onClick={handleLogout} style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#faf8f5',
          color: '#7f011f',
          border: '1px solid #7f011f',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;