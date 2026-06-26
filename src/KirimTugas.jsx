import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
// 🎨 IMPORT IKON VECTOR MINIMALIS DARI FEATHER ICONS
import { FiClipboard, FiPlus, FiTrash2, FiArrowLeft, FiMonitor, FiSearch, FiChevronDown } from 'react-icons/fi';

function KirimTugas() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState([]);
  
  // State Form Header
  const [selectedOperator, setSelectedOperator] = useState('');
  const [assignedMachine, setAssignedMachine] = useState({ id: '', name: 'Silakan pilih operator', plant: '-' });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 🔍 STATE KHUSUS UNTUK DROPDOWN OPERATOR DAPAT DI-SEARCH
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State Form Detail (Dynamic Rows)
  const [parts, setParts] = useState([
    { part_name: '', qty: 1, customer: '' }
  ]);

  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/operators')
      .then(res => setOperators(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // Filter operator berdasarkan teks pencarian
  const filteredOperators = Array.isArray(operators) ? operators.filter(op =>
    op.operator_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Logika LOGIKA AUTO-FILL (Saat Admin memilih nama Operator)
  const handleOperatorChange = async (operatorId) => {
    setSelectedOperator(operatorId);
    if (!operatorId) {
      setAssignedMachine({ id: '', name: 'Silakan pilih operator', plant: '-' });
      return;
    }

    try {
      const response = await api.get(`/loading-jobs/operator-machine/${operatorId}`);
      const machineData = response.data.data;
      setAssignedMachine({
        id: machineData.machine_id,
        name: machineData.machine_name || 'Tidak ada mesin bawaan',
        plant: machineData.plant || '-'
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Tambah baris input tugas baru
  const handleAddRow = () => {
    setParts([...parts, { part_name: '', qty: 1, customer: '' }]);
  };

  // Hapus baris input tugas
  const handleRemoveRow = (index) => {
    const updatedParts = [...parts];
    updatedParts.splice(index, 1);
    setParts(updatedParts);
  };

  // Mengubah data per kolom dalam baris dinamis
  const handleInputChange = (index, field, value) => {
    const updatedParts = [...parts];
    updatedParts[index][field] = value;
    setParts(updatedParts);
  };

  // Menyimpan semua data (Header + Detail)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOperator || !assignedMachine.id) {
      alert('Pilih operator yang memiliki mesin bawaan terlebih dahulu.');
      return;
    }

    try {
      await api.post('/loading-jobs', {
        operator_id: selectedOperator,
        machines_id: assignedMachine.id,
        date: date,
        parts: parts
      });

      setMessage('Tugas harian berhasil dikirim ke Operator!');
      setParts([{ part_name: '', qty: 1, customer: '' }]);
      setSelectedOperator('');
      setAssignedMachine({ id: '', name: 'Silakan pilih operator', plant: '-' });
    } catch (err) {
      setMessage('Gagal mengirim tugas.');
    }
  };

  return (
    // 📱 KONTEN UTAMA RESPONSIVE DENGAN WARNA TEKS GELAP (#2b2b2b)
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif', padding: '30px 20px', boxSizing: 'border-box', color: '#2b2b2b' }}>
      
      {/* Navigasi Cepat Responsif */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={() => navigate('/admin-dashboard')} 
          style={{ 
            backgroundColor: '#ffffff', color: '#7f011f', border: '1px solid #7f011f', borderRadius: '10px', 
            padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' 
          }}
        >
          <FiArrowLeft size={14} /> Dashboard
        </button>
        <button 
          onClick={() => navigate('/monitoring-tugas')} 
          style={{ 
            backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '10px', 
            padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0px 4px 10px rgba(40, 167, 69, 0.2)'
          }}
        >
          <FiMonitor size={14} /> Live Monitoring
        </button>
      </div>

      {/* JUDUL HALAMAN DENGAN IKON CLIPBOARD */}
      <h2 style={{ 
        fontSize: '24px', fontWeight: '900', color: '#1a1a1a', margin: '15px 0 25px 0', letterSpacing: '-0.5px',
        display: 'flex', alignItems: 'center', gap: '10px' 
      }}>
        <FiClipboard size={26} style={{ color: '#7f011f' }} /> KIRIM TUGAS HARIAN OPERATOR
      </h2>

      {/* KARTU FORM (Putih, Melengkung Lembut, dengan Shadow & Border) */}
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#ffffff', border: '1px solid #e0dbd3', borderRadius: '20px', 
        padding: '30px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.03)', boxSizing: 'border-box' 
      }}>
        
        {/* HEADER FORM RESPONSIVE (MENGGUNAKAN GRID AUTO-FIT) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #e0dbd3', paddingBottom: '20px' }}>
          
          {/* 🔍 PEMILIH OPERATOR SEARCHABLE (CUSTOM DROPDOWN) */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#8c8c8c' }}>1. Pilih Operator:</label>
            
            {/* Box Trigger untuk membuka dropdown */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: '100%', padding: '12px 16px', marginTop: '6px', border: '1px solid #e0dbd3', borderRadius: '10px',
                backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600'
              }}
            >
              <span>
                {selectedOperator
                  ? operators.find(op => String(op.id) === String(selectedOperator))?.operator_name
                  : '-- Pilih Operator --'}
              </span>
              <FiChevronDown style={{ color: '#8c8c8c' }} />
            </div>

            {/* Backdrop transparan untuk menutup dropdown jika klik di luar */}
            {isDropdownOpen && (
              <div 
                onClick={() => setIsDropdownOpen(false)}
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100, background: 'transparent' }}
              />
            )}

            {/* Jendela Menu Pencarian Dropdown */}
            {isDropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: '#ffffff',
                border: '1px solid #e0dbd3', borderRadius: '12px', marginTop: '6px', boxShadow: '0px 15px 35px rgba(0, 0, 0, 0.1)',
                zIndex: 101, padding: '10px', boxSizing: 'border-box'
              }}>
                {/* Input Pencarian */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Ketik nama operator..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px 10px 35px', border: '1px solid #e0dbd3',
                      borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '13px', backgroundColor: '#faf8f5'
                    }}
                  />
                  <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8c8c8c' }} />
                </div>
                {/* Scrollable list operator hasil pencarian */}
                <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {filteredOperators.length > 0 ? (
                    filteredOperators.map((op) => (
                      <div
                        key={op.id}
                        onClick={() => {
                          handleOperatorChange(op.id);
                          setIsDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        style={{
                          padding: '10px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '13px',
                          backgroundColor: String(selectedOperator) === String(op.id) ? '#7f011f' : 'transparent',
                          color: String(selectedOperator) === String(op.id) ? '#ffffff' : '#2b2b2b',
                          fontWeight: 'bold', transition: 'all 0.1s'
                        }}
                        onMouseEnter={(e) => {
                          if (String(selectedOperator) !== String(op.id)) {
                            e.currentTarget.style.backgroundColor = '#faf8f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (String(selectedOperator) !== String(op.id)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {op.operator_name}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '12px', fontSize: '13px', color: '#999', textAlign: 'center' }}>
                      Operator tidak ditemukan
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tanggal Pengerjaan */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#8c8c8c' }}>Tanggal Pengerjaan:</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
              style={{ 
                width: '100%', padding: '12px 16px', marginTop: '6px', border: '1px solid #e0dbd3', 
                borderRadius: '10px', backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none' 
              }} 
            />
          </div>

          {/* BOX INFORMASI AUTO-FILL MESIN (STYLE DISELARASKAN DENGAN KREM LEMBUT) */}
          <div style={{ gridColumn: '1 / -1', padding: '15px', backgroundColor: '#faf8f5', border: '1px solid #e0dbd3', borderRadius: '12px' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#8c8c8c', fontWeight: 'bold' }}>Hasil Logika Auto-Fill Mesin:</span>
            <strong style={{ fontSize: '15px', color: '#7f011f', display: 'block', marginTop: '4px' }}>
              📟 Mesin: {assignedMachine.name} | 📍 Lokasi: {assignedMachine.plant}
            </strong>
          </div>
        </div>

        {/* INPUT DETAIL TUGAS RESPONSIVE */}
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 15px 0' }}>
          Daftar Part Pekerjaan
        </h3>
        {parts.map((part, index) => (
          <div key={index} style={{ 
            display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '15px', 
            borderBottom: '1px dashed #e0dbd3', paddingBottom: '15px' 
          }}>
            <div style={{ flex: '2 1 200px' }}>
              <input 
                type="text" 
                placeholder="Nama Part (Contoh: COVER ENGINE)" 
                value={part.part_name} 
                onChange={(e) => handleInputChange(index, 'part_name', e.target.value)} 
                required 
                style={{ 
                  width: '100%', padding: '12px 16px', border: '1px solid #e0dbd3', borderRadius: '10px', 
                  backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none' 
                }} 
              />
            </div>
            <div style={{ flex: '1 1 80px' }}>
              <input 
                type="number" 
                placeholder="Qty" 
                min="1" 
                value={part.qty} 
                onChange={(e) => handleInputChange(index, 'qty', e.target.value)} 
                required 
                style={{ 
                  width: '100%', padding: '12px 16px', border: '1px solid #e0dbd3', borderRadius: '10px', 
                  backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none' 
                }} 
              />
            </div>
            <div style={{ flex: '2 1 200px' }}>
              <input 
                type="text" 
                placeholder="Nama Customer (Contoh: HONDA)" 
                value={part.customer} 
                onChange={(e) => handleInputChange(index, 'customer', e.target.value)} 
                required 
                style={{ 
                  width: '100%', padding: '12px 16px', border: '1px solid #e0dbd3', borderRadius: '10px', 
                  backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none' 
                }} 
              />
            </div>
            <div style={{ width: '100%', textAlign: 'right' }}>
              {parts.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveRow(index)} 
                  style={{ 
                    padding: '8px 14px', backgroundColor: '#ffffff', color: '#dc3545', border: '1px solid #dc3545', 
                    borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' 
                  }}
                >
                  <FiTrash2 size={14} /> Hapus Baris
                </button>
              )}
            </div>
          </div>
        ))}

        <button 
          type="button" 
          onClick={handleAddRow} 
          style={{ 
            padding: '8px 16px', backgroundColor: '#ffffff', color: '#7f011f', border: '1px solid #7f011f', 
            borderRadius: '10px', cursor: 'pointer', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' 
          }}
        >
          <FiPlus size={16} /> Tambah Baris Part
        </button>

        <div style={{ borderTop: '1px solid #e0dbd3', paddingTop: '15px', textAlign: 'right' }}>
          <button 
            type="submit" 
            style={{ 
              padding: '12px 24px', backgroundColor: '#7f011f', color: '#ffffff', border: 'none', 
              borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', width: '100%', maxWidth: '250px',
              boxShadow: '0px 4px 10px rgba(127, 1, 31, 0.15)'
            }}
          >
            Kirim Tugas Ke Operator
          </button>
        </div>

        {message && <p style={{ marginTop: '15px', color: '#7f011f', fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>{message}</p>}
      </form>
    </div>
  );
}

export default KirimTugas;