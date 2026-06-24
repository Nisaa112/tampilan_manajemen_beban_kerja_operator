import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import OperatorDashboard from './OperatorDashboard';
import MasterMesin from './MasterMesin';
import MasterOperator from './MasterOperator';
import KirimTugas from './KirimTugas';
import MonitoringTugas from './MonitoringTugas';

// Guard Proteksi
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 🔎 CETAK DATA DI CONSOLE UNTUK MELACAK ERROR
  console.log("--- DEBUG SYSTEM SECURITY GUARD ---");
  console.log("Token ditemukan:", token ? "YA (Ada)" : "TIDAK (Kosong)");
  console.log("Role di Browser:", role);
  console.log("Role yang Dibutuhkan Halaman Ini:", allowedRole);

  if (!token) {
    console.log("❌ REJECTED: Tidak ada token, didepak ke Login!");
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    console.log("❌ REJECTED: Role tidak cocok! Didepak ke Login!");
    return <Navigate to="/" replace />;
  }

  console.log("✅ ACCEPTED: Data valid, halaman ditampilkan.");
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Dashboard Pages */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/operator-dashboard" element={
          <ProtectedRoute allowedRole="operator"><OperatorDashboard /></ProtectedRoute>
        } />

        {/* Admin Menu Sub-Pages */}
        <Route path="/master-mesin" element={
          <ProtectedRoute allowedRole="admin"><MasterMesin /></ProtectedRoute>
        } />
        <Route path="/master-operator" element={
          <ProtectedRoute allowedRole="admin"><MasterOperator /></ProtectedRoute>
        } />
        <Route path="/kirim-tugas" element={
          <ProtectedRoute allowedRole="admin"><KirimTugas /></ProtectedRoute>
        } />
        <Route path="/monitoring-tugas" element={
          <ProtectedRoute allowedRole="admin"><MonitoringTugas /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;