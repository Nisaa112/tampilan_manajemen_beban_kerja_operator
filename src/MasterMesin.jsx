import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
// 🎨 IMPORT IKON VECTOR MINIMALIS DARI FEATHER ICONS
import { FiCpu, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

function MasterMesin() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [machineName, setMachineName] = useState('');
  const [plant, setPlant] = useState('Plant 1');
  const [message, setMessage] = useState('');
  
  // STATE UNTUK MANAJEMEN MODAL & EDIT MODE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachineId, setEditingMachineId] = useState(null);

  // 📖 1. STATE BARU UNTUK PAGINATION (Dibatasi 5 item per halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Ubah angka ini jika ingin membatasi jumlah baris lainnya

  const fetchMachines = async () => {
    try {
      const response = await api.get('/machines');
      if (response.data && response.data.data) {
        setMachines(response.data.data);
      } else if (Array.isArray(response.data)) {
        setMachines(response.data);
      } else {
        setMachines([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data mesin:", err);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  // 📖 2. LOGIKA MATEMATIKA UNTUK MEMBAGI HALAMAN (PAGINATION)
  const indexOfLastItem = currentPage * itemsPerPage; // Batas akhir data halaman ini
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Batas awal data halaman ini
  
  // Memotong array machines asli agar hanya menampilkan data di halaman saat ini
  const currentMachines = Array.isArray(machines) ? machines.slice(indexOfFirstItem, indexOfLastItem) : [];
  
  // Menghitung total jumlah halaman yang dibutuhkan
  const totalPages = Math.ceil((machines ? machines.length : 0) / itemsPerPage);

  // Buka Modal untuk Tambah Data Baru
  const openCreateModal = () => {
    setEditingMachineId(null);
    setMachineName('');
    setPlant('Plant 1');
    setMessage('');
    setIsModalOpen(true);
  };

  // Buka Modal untuk Edit Data
  const openEditModal = (machine) => {
    setEditingMachineId(machine.id);
    setMachineName(machine.machine_name);
    setPlant(machine.plant);
    setMessage('');
    setIsModalOpen(true);
  };

  // Eksekusi Simpan Data (Tambah atau Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMachineId) {
        // A. JALUR UPDATE (PUT)
        await api.put(`/machines/${editingMachineId}`, {
          machine_name: machineName,
          plant: plant
        });
        alert('Data mesin berhasil diperbarui!');
      } else {
        // B. JALUR CREATE (POST)
        await api.post('/machines', {
          machine_name: machineName,
          plant: plant
        });
        alert('Mesin berhasil ditambahkan!');
        setCurrentPage(1); // Balikkan ke halaman 1 agar mesin baru langsung terlihat di atas
      }

      setIsModalOpen(false);
      setMachineName('');
      fetchMachines(); // Refresh data
    } catch (err) {
      setMessage('Gagal memproses data mesin.');
    }
  };

  // Eksekusi Hapus Data (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mesin ini?')) {
      try {
        await api.delete(`/machines/${id}`);
        alert('Mesin berhasil dihapus!');
        
        // Pengaman: Jika data di halaman saat ini habis terjual/terhapus, mundur 1 halaman
        if (currentMachines.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
        fetchMachines();
      } catch (err) {
        alert('Gagal menghapus data mesin.');
      }
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '850px', 
      margin: '0 auto', 
      fontFamily: '"Poppins", "Segoe UI", Arial, sans-serif', 
      padding: '30px 20px', 
      boxSizing: 'border-box', 
      color: '#2b2b2b' 
    }}>

      {/* JUDUL HALAMAN */}
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '900', 
        color: '#1a1a1a', 
        margin: '0 0 30px 0', 
        letterSpacing: '-0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <FiCpu size={26} style={{ color: '#7f011f' }} /> MASTER DATA MESIN
      </h2>

      {/* HEADER TABEL & TRIGGERS TAMBAH MESIN */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
          Daftar Mesin Tersedia
        </h3>
        <button
          onClick={openCreateModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#7f011f',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
            boxShadow: '0px 4px 10px rgba(127, 1, 31, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FiPlus size={16} /> Tambah Mesin
        </button>
      </div>
      
      {/* 📊 TABEL DAFTAR DATA MESIN */}
      <div style={{ 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        border: '1px solid #e0dbd3',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)'
      }}>
        <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse', color: '#2b2b2b' }}>
          <thead>
            <tr style={{ backgroundColor: '#faf8f5', textAlign: 'left', borderBottom: '1px solid #e0dbd3' }}>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>ID</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Nama Mesin</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Lokasi Plant</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px', textAlign: 'center', width: '100px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* 📖 3. MENGGUNAKAN 'currentMachines' YANG SUDAH DIPOTONG UNTUK DILAKUKAN MAP */}
            {Array.isArray(currentMachines) && currentMachines.length > 0 ? (
              currentMachines.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f0ede6' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 'bold', color: '#7f011f' }}>{m.id}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>{m.machine_name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>{m.plant}</td>
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'center' }}>
                    <button
                      onClick={() => openEditModal(m)}
                      style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginRight: '15px', padding: 0 }}
                      title="Edit Mesin"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 0 }}
                      title="Hapus Mesin"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                  Tidak ada data mesin / Gagal memuat data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===================================================
          ⏱️ 4. STRUKTUR MENU NAVIGASI PAGINATION (MAROON STYLE)
          =================================================== */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Info Status Baris Data */}
          <span style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: '500' }}>
            Menampilkan <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, machines.length)}</strong> dari <strong>{machines.length}</strong> mesin
          </span>

          {/* Deretan Tombol Halaman */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {/* Tombol Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0dbd3',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                color: currentPage === 1 ? '#cccccc' : '#7f011f',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              Prev
            </button>

            {/* Render Angka Penomoran Halaman */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                style={{
                  width: '36px',
                  height: '36px',
                  border: currentPage === pageNumber ? 'none' : '1px solid #e0dbd3',
                  borderRadius: '10px',
                  backgroundColor: currentPage === pageNumber ? '#7f011f' : '#ffffff',
                  color: currentPage === pageNumber ? '#ffffff' : '#2b2b2b',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  boxShadow: currentPage === pageNumber ? '0px 3px 8px rgba(127, 1, 31, 0.15)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {pageNumber}
              </button>
            ))}

            {/* Tombol Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e0dbd3',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                color: currentPage === totalPages ? '#cccccc' : '#7f011f',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* POP-UP MODAL FORM */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3000,
          padding: '15px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0dbd3',
            borderRadius: '24px',
            padding: '30px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            boxSizing: 'border-box'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#8c8c8c',
                padding: 0
              }}
            >
              <FiX size={20} />
            </button>

            <h3 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '800' }}>
              {editingMachineId ? 'Edit Data Mesin' : 'Tambah Mesin Baru'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>Nama Mesin:</label>
                <input 
                  type="text" 
                  value={machineName} 
                  onChange={(e) => setMachineName(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    marginTop: '6px', 
                    border: '1px solid #e0dbd3',
                    borderRadius: '10px',
                    backgroundColor: '#faf8f5',
                    color: '#333',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }} 
                  placeholder="Contoh: CNC BUBUT DOOSAN" 
                />
              </div>
              
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>Lokasi Plant:</label>
                <select 
                  value={plant} 
                  onChange={(e) => setPlant(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    marginTop: '6px', 
                    border: '1px solid #e0dbd3',
                    borderRadius: '10px',
                    backgroundColor: '#faf8f5',
                    color: '#333',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    cursor: 'pointer'
                  }} 
                >
                  <option value="Plant 1">Plant 1</option>
                  <option value="Plant 2">Plant 2</option>
                  <option value="Plant 3">Plant 3</option>
                </select>
              </div>

              {message && <p style={{ color: '#7f011f', fontWeight: 'bold', fontSize: '13px', margin: 0 }}>{message}</p>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ 
                    padding: '12px 20px', 
                    backgroundColor: '#faf8f5', 
                    color: '#8c8c8c', 
                    border: '1px solid #e0dbd3', 
                    borderRadius: '10px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#7f011f', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '10px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    boxShadow: '0px 4px 10px rgba(127, 1, 31, 0.15)'
                  }}
                >
                  {editingMachineId ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterMesin;