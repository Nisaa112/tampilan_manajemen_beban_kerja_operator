import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
// 🎨 IMPORT IKON VECTOR MINIMALIS DARI FEATHER ICONS
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiX, FiSmartphone } from 'react-icons/fi';

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
  const [role, setRole] = useState('operator');
  const [message, setMessage] = useState('');

  // STATE MODAL & EDIT MODE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperatorId, setEditingOperatorId] = useState(null); // NULL jika tambah data, ISI ID jika edit data

  // STATE UNTUK TOGGLE LIHAT PASSWORD
  const [showPassword, setShowPassword] = useState(false);

  // STATE UNTUK PAGINATION (Dibatasi 5 baris per halaman)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      const resMachines = await api.get('/machines');
      if (resMachines.data && resMachines.data.data) {
        setMachines(resMachines.data.data);
      } else if (Array.isArray(resMachines.data)) {
        setMachines(resMachines.data);
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

  // 📖 LOGIKA PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOperators = Array.isArray(operators) ? operators.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil((operators ? operators.length : 0) / itemsPerPage);

  // Buka Modal untuk Tambah Data Baru
  const openCreateModal = () => {
    setEditingOperatorId(null);
    setSerialNumber('');
    setPassword('');
    setOperatorName('');
    setPhoneNumber('');
    setJKelamin('laki-laki');
    setRole('operator');
    if (machines.length > 0) setMachineId(machines[0].id);
    setMessage('');
    setIsModalOpen(true);
  };

  // Buka Modal untuk Edit Data
  const openEditModal = (op) => {
    setEditingOperatorId(op.id);
    setSerialNumber(op.user?.serial_number || '');
    setPassword(''); // Kosongkan password saat edit agar bersifat opsional
    setOperatorName(op.operator_name);
    setPhoneNumber(op.phone_number);
    setJKelamin(op.j_kelamin);
    setMachineId(op.machine_id || '');
    setRole(op.user?.role || 'operator');
    setMessage('');
    setIsModalOpen(true);
  };

  // Eksekusi Simpan Data (Tambah atau Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOperatorId) {
        // A. JALUR UPDATE (PUT) - Password opsional jika diedit
        await api.put(`/operators/${editingOperatorId}`, {
          operator_name: operatorName,
          phone_number: phoneNumber,
          j_kelamin: jKelamin,
          machine_id: machineId,
          password: password ? password : undefined // Kirim password hanya jika diisi
        });
        alert('Data operator berhasil diperbarui!');
      } else {
        // B. JALUR CREATE (POST)
        await api.post('/operators', {
          serial_number: serialNumber,
          password: password,
          operator_name: operatorName,
          phone_number: phoneNumber,
          j_kelamin: jKelamin,
          machine_id: machineId,
          role: role
        });
        alert('Operator & Akun Login berhasil dibuat!');
        setCurrentPage(1); // Kembalikan ke halaman 1
      }

      setIsModalOpen(false);
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
        setMessage('Gagal memproses data operator.');
      }
    }
  };

  // Eksekusi Hapus Data (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus operator dan akun loginnya?')) {
      try {
        await api.delete(`/operators/${id}`);
        alert('Operator berhasil dihapus!');
        if (currentOperators.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        fetchData();
      } catch (err) {
        alert('Gagal menghapus operator.');
      }
    }
  };

  // 📡 EKSEKUSI PUTUS DEVICE ID (Fungsi Baru)
  const handleDisconnectDevice = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin memutuskan Device ID milik operator [${name}]?`)) {
      try {
        await api.put(`/operators/${id}/disconnect-device`);
        alert('Device ID berhasil diputus! Operator sekarang bisa login dari perangkat lain.');
        fetchData(); // Refresh list agar tulisan Device ID hilang
      } catch (err) {
        alert('Gagal memutuskan Device ID.');
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

      {/* JUDUL HALAMAN DENGAN IKON USERS */}
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
        <FiUsers size={26} style={{ color: '#7f011f' }} /> MASTER DATA OPERATOR
      </h2>

      {/* HEADER TABEL & TRIGGERS MODAL */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
          Daftar Operator Terdaftar
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
          <FiPlus size={16} /> Tambah Operator
        </button>
      </div>

      {/* Tabel Operator */}
      <div style={{ 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        border: '1px solid #e0dbd3',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)'
      }}>
        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', color: '#2b2b2b' }}>
          <thead>
            <tr style={{ backgroundColor: '#faf8f5', textAlign: 'left', borderBottom: '1px solid #e0dbd3' }}>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Serial Number</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Nama Operator</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>No. HP</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Role</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px' }}>Mesin Default</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: '#8c8c8c', fontWeight: 'bold', letterSpacing: '0.5px', textAlign: 'center', width: '130px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentOperators) && currentOperators.length > 0 ? (
              currentOperators.map((op) => (
                <tr key={op.id} style={{ borderBottom: '1px solid #f0ede6' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 'bold', color: '#7f011f' }}>{op.user?.serial_number}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>{op.operator_name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>{op.phone_number}</td>
                  <td style={{ padding: '16px', fontSize: '14px', textTransform: 'capitalize', fontWeight: 'bold', color: op.user?.role === 'admin' ? '#dc3545' : '#28a745' }}>
                    {op.user?.role}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>{op.machine?.machine_name || 'Tidak ada'}</td>
                  
                  {/* KOLOM AKSI EDIT, DELETE & PUTUS DEVICE */}
                  <td style={{ padding: '16px', fontSize: '14px', textAlign: 'center' }}>
                    {/* 📱 TOMBOL PUTUS DEVICE (Hanya muncul jika user memiliki device_id) */}
                    {op.user?.device_id && (
                      <button
                        onClick={() => handleDisconnectDevice(op.id, op.operator_name)}
                        style={{ background: 'none', border: 'none', color: '#f5b971', cursor: 'pointer', marginRight: '12px', padding: 0 }}
                        title={`Putus Device ID: ${op.user.device_id}`}
                      >
                        <FiSmartphone size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(op)}
                      style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginRight: '12px', padding: 0 }}
                      title="Edit Operator"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(op.id)}
                      style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 0 }}
                      title="Hapus Operator"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                  Tidak ada data operator / Gagal memuat data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ⏱️ PAGINATION CONTROL */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: '500' }}>
            Menampilkan <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, operators.length)}</strong> dari <strong>{operators.length}</strong> operator
          </span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{ padding: '8px 12px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#ffffff', color: currentPage === 1 ? '#cccccc' : '#7f011f', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                style={{ width: '36px', height: '36px', border: currentPage === pageNumber ? 'none' : '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: currentPage === pageNumber ? '#7f011f' : '#ffffff', color: currentPage === pageNumber ? '#ffffff' : '#2b2b2b', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: currentPage === pageNumber ? '0px 3px 8px rgba(127, 1, 31, 0.15)' : 'none' }}
              >
                {pageNumber}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{ padding: '8px 12px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#ffffff', color: currentPage === totalPages ? '#cccccc' : '#7f011f', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          📟 POP-UP MODAL FORM OPERATOR (CREATE / EDIT)
          =================================================== */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 3000, padding: '15px', boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#ffffff', border: '1px solid #e0dbd3', borderRadius: '24px', padding: '30px',
            width: '100%', maxWidth: '560px', boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.15)',
            position: 'relative', boxSizing: 'border-box'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#8c8c8c', padding: 0 }}
            >
              <FiX size={20} />
            </button>

            <h3 style={{ color: '#1a1a1a', marginTop: 0, marginBottom: '20px', fontSize: '20px', fontWeight: '800' }}>
              {editingOperatorId ? 'Edit Data Operator' : 'Pendaftaran Operator Baru'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* Form Grid 2 Kolom di dalam Modal */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                
                {/* Username tidak boleh diubah jika sedang mode EDIT */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>Username / Serial Number:</label>
                  <input 
                    type="text" 
                    value={serialNumber} 
                    onChange={(e) => setSerialNumber(e.target.value)} 
                    required 
                    disabled={!!editingOperatorId} // Kunci input jika sedang Edit
                    style={{ 
                      width: '100%', padding: '12px 16px', marginTop: '6px', border: '1px solid #e0dbd3', borderRadius: '10px',
                      backgroundColor: editingOperatorId ? '#e9ecef' : '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none'
                    }} 
                    placeholder="Contoh: OP-003" 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>
                    Password Akun {editingOperatorId && '(Opsional)'}:
                  </label>
                  <div style={{ position: 'relative', marginTop: '6px' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required={!editingOperatorId} // Wajib hanya saat pendaftaran baru
                      placeholder={editingOperatorId ? 'Kosongkan jika tidak diubah' : 'Min. 6 karakter'}
                      style={{ width: '100%', padding: '12px 40px 12px 16px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: 0 }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>Nama Lengkap Operator:</label>
                  <input type="text" value={operatorName} onChange={(e) => setOperatorName(e.target.value)} required style={{ width: '100%', padding: '12px 16px', marginTop: '6px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>No. Handphone:</label>
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={{ width: '100%', padding: '12px 16px', marginTop: '6px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} placeholder="0812..." />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>Jenis Kelamin:</label>
                  <select value={jKelamin} onChange={(e) => setJKelamin(e.target.value)} style={{ width: '100%', padding: '12px 16px', marginTop: '6px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' }}>
                    <option value="laki-laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>Kunci Mesin Bawaan:</label>
                  <select value={machineId} onChange={(e) => setMachineId(e.target.value)} style={{ width: '100%', padding: '12px 16px', marginTop: '6px', border: '1px solid #e0dbd3', borderRadius: '10px', backgroundColor: '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' }}>
                    {Array.isArray(machines) && machines.map((m) => (
                      <option key={m.id} value={m.id}>{m.machine_name} ({m.plant})</option>
                    ))}
                  </select>
                </div>

                {/* Input Dropdown Role (Hanya bisa dipilih saat PENDAFTARAN BARU demi keamanan) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#8c8c8c' }}>Role Pengguna / Hak Akses:</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    disabled={!!editingOperatorId} // Kunci jika sedang edit
                    style={{ 
                      width: '100%', padding: '12px 16px', marginTop: '6px', border: '1px solid #e0dbd3', borderRadius: '10px', 
                      backgroundColor: editingOperatorId ? '#e9ecef' : '#faf8f5', color: '#333', fontSize: '14px', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' 
                    }}
                  >
                    <option value="operator">operator (Operator Mesin)</option>
                    <option value="admin">Admin (Pengelola Sistem)</option>
                  </select>
                </div>

              </div>

              {message && <p style={{ color: '#7f011f', fontWeight: 'bold', fontSize: '13px', margin: 0 }}>{message}</p>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '12px 20px', backgroundColor: '#faf8f5', color: '#8c8c8c', border: '1px solid #e0dbd3', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '12px 24px', backgroundColor: '#7f011f', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0px 4px 10px rgba(127, 1, 31, 0.15)' }}
                >
                  {editingOperatorId ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterOperator;