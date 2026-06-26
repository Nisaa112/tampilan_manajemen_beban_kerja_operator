import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
// 🎨 IMPORT IKON VECTOR MINIMALIS DARI FEATHER ICONS
import { FiCpu, FiUsers, FiClipboard, FiMonitor, FiSmile, FiTrendingUp } from 'react-icons/fi';

function AdminDashboard() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('name') || 'Admin';

  // State untuk menyimpan angka statistik dinamis dari database
  const [stats, setStats] = useState({
    machinesCount: 0,
    operatorsCount: 0,
    jobsCount: 0
  });
  const [loading, setLoading] = useState(true);

  // 📡 Ambil data statistik dari database Laravel secara bersamaan (Real-time)
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [resMachines, resOperators, resJobs] = await Promise.all([
          api.get('/machines'),
          api.get('/operators'),
          api.get('/loading-jobs')
        ]);

        setStats({
          machinesCount: resMachines.data.data?.length || 0,
          operatorsCount: resOperators.data.data?.length || 0,
          jobsCount: resJobs.data.data?.length || 0
        });
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat data statistik dashboard:", err);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    // 📱 KONTEN UTAMA DENGAN WARNA DASAR TEKS GELAP (#2b2b2b)
    <div style={{
      padding: '30px 20px',
      fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif',
      color: '#2b2b2b',
      boxSizing: 'border-box'
    }}>
      
      {/* 1. SEKSI WELCOME BANNER ADMIN */}
      <div style={{ marginBottom: '35px' }}>
        <h2 style={{ 
          fontSize: '26px', 
          fontWeight: '900', 
          color: '#1a1a1a', 
          margin: '0 0 6px 0', 
          letterSpacing: '-1px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Selamat Datang Kembali, {adminName} <FiSmile style={{ color: '#7f011f' }} />
        </h2>
        <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px', fontWeight: '500' }}>
          Berikut adalah ringkasan operasional pabrik dan beban kerja operator hari ini.
        </p>
      </div>

      {/* ===================================================
          📊 2. BARIS KARTU STATISTIK DINAMIS (KPI CARDS)
          =================================================== */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '35px' 
      }}>
        
        {/* KPI 1: Total Mesin */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0dbd3', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#faf8f5', border: '1px solid #e0dbd3', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#7f011f' }}>
            <FiCpu size={20} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Total Mesin</span>
            <strong style={{ fontSize: '20px', color: '#1a1a1a' }}>{loading ? '...' : `${stats.machinesCount} Unit`}</strong>
          </div>
        </div>

        {/* KPI 2: Total Operator */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0dbd3', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#faf8f5', border: '1px solid #e0dbd3', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#7f011f' }}>
            <FiUsers size={20} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Total Operator</span>
            <strong style={{ fontSize: '20px', color: '#1a1a1a' }}>{loading ? '...' : `${stats.operatorsCount} Orang`}</strong>
          </div>
        </div>

        {/* KPI 3: Tugas Terkirim */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e0dbd3', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#faf8f5', border: '1px solid #e0dbd3', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#7f011f' }}>
            <FiClipboard size={20} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Tugas Terkirim</span>
            <strong style={{ fontSize: '20px', color: '#1a1a1a' }}>{loading ? '...' : `${stats.jobsCount} Penugasan`}</strong>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;