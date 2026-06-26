import React, { useState, useEffect } from 'react'; // 1. Tambahkan useState & useEffect
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './login';
import AdminDashboard from './AdminDashboard';
import OperatorDashboard from './OperatorDashboard';
import MasterMesin from './MasterMesin';
import MasterOperator from './MasterOperator';
import KirimTugas from './KirimTugas';
import MonitoringTugas from './MonitoringTugas';
import Sidebar from './Sidebar'; // 2. Ubah dari Navbar menjadi Sidebar

// Guard Proteksi Keamanan
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// 3. WADAH LAYOUT BARU YANG RESPONSIVE
const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', // Atur susunan kolom jika di HP
      minHeight: '100vh', 
      backgroundColor: '#f4efe6' // Krem dasar konsisten
    }}>
      <Sidebar />
      
      {/* Area Konten Dinamis di sebelah Kanan */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? '0' : '260px', // Beri jarak 260px dari kiri khusus di Desktop agar tidak tertimpa sidebar
        boxSizing: 'border-box',
        width: '100%',
        minHeight: '100vh',
        paddingBottom: '50px' // Ruang ekstra bawah
      }}>
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Halaman Operator (Tanpa Sidebar Admin) */}
        <Route path="/operator-dashboard" element={
          <ProtectedRoute allowedRole="operator">
            <OperatorDashboard />
          </ProtectedRoute>
        } />

        {/* Kelompok Halaman Admin (Otomatis memakai Layout Sidebar & Terproteksi) */}
        <Route element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/master-mesin" element={<MasterMesin />} />
          <Route path="/master-operator" element={<MasterOperator />} />
          <Route path="/kirim-tugas" element={<KirimTugas />} />
          <Route path="/monitoring-tugas" element={<MonitoringTugas />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  ); 
}

export default App;