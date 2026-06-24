import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function MasterMesin() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [machineName, setMachineName] = useState('');
  const [plant, setPlant] = useState('Plant 1');
  const [message, setMessage] = useState('');
  
  // 🔎 STATE BARU UNTUK MENAMPILKAN ERROR LANGSUNG DI LAYAR
  const [screenLog, setScreenLog] = useState('Sedang mencoba menghubungkan API...');

  const fetchMachines = async () => {
    try {
      const response = await api.get('/machines');
      
      // Catat respon sukses ke layar hitam di bawah
      setScreenLog("SUKSES Ambil Data!\nRespon Laravel:\n" + JSON.stringify(response.data, null, 2));

      // Pengaman pembacaan data
      if (response.data && response.data.data) {
        setMachines(response.data.data);
      } else if (Array.isArray(response.data)) {
        setMachines(response.data);
      } else {
        setMachines([]);
      }

    } catch (err) {
      // Catat pesan error ke layar hitam di bawah jika gagal (401/404/500)
      const errorDetail = err.response 
        ? `Status: ${err.response.status}\nPesan Server: ${JSON.stringify(err.response.data, null, 2)}`
        : err.message;
        
      setScreenLog("❌ ERROR Ambil Data!\nDetail:\n" + errorDetail);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/machines', {
        machine_name: machineName,
        plant: plant
      });
      setMessage('Mesin berhasil ditambahkan!');
      setMachineName('');
      fetchMachines(); // Refresh list setelah tambah data
    } catch (err) {
      setMessage('Gagal menambahkan mesin.');
    }
  };

  return (
    // 📱 KONTEN UTAMA RESPONSIVE DENGAN BOX-SIZING & PADDING PERSENTASE
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '15px', boxSizing: 'border-box', color: '#fff' }}>
      
      <button onClick={() => navigate('/admin-dashboard')} style={{ marginBottom: '15px', padding: '8px 12px', cursor: 'pointer' }}>🔙 Kembali</button>
      <h2 style={{ fontSize: '20px', margin: '10px 0' }}>⚙️ MASTER DATA MESIN</h2>

      {/* Form Input Mesin Baru */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff', color: '#333', marginBottom: '30px', boxSizing: 'border-box' }}>
        <h3 style={{ color: '#333', marginTop: 0, fontSize: '16px' }}>Tambah Mesin Baru</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Nama Mesin:</label>
          <input 
            type="text" 
            value={machineName} 
            onChange={(e) => setMachineName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} // <-- Tambah boxSizing
            placeholder="Contoh: CNC BUBUT DOOSAN" 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Lokasi Plant:</label>
          <select 
            value={plant} 
            onChange={(e) => setPlant(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} // <-- Tambah boxSizing
          >
            <option value="Plant 1">Plant 1</option>
            <option value="Plant 2">Plant 2</option>
            <option value="Plant 3">Plant 3</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Simpan Mesin</button>
        {message && <p style={{ marginTop: '10px', color: 'blue', fontWeight: 'bold' }}>{message}</p>}
      </form>

      {/* Tabel Daftar Mesin */}
      <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Daftar Mesin Tersedia</h3>
      
      {/* 📱 KONTEN SCROLL HORIZONTAL JIKA DI BUKA DI LAYAR HP KECIL */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', backgroundColor: '#fff', color: '#333' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
              <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>ID</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Nama Mesin</th>
              <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Lokasi Plant</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(machines) && machines.length > 0 ? (
              machines.map((m) => (
                <tr key={m.id}>
                  <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{m.id}</td>
                  <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{m.machine_name}</td>
                  <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{m.plant}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#999' }}>
                  Tidak ada data mesin / Gagal memuat data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📟 LAYAR HITAM MONITOR DEBUGGER (RESPONSIVE) */}
      {/* <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#1e1e1e', color: '#39ff14', fontFamily: 'monospace', borderRadius: '6px', border: '1px solid #39ff14', textAlign: 'left', boxSizing: 'border-box' }}>
        <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #39ff14', paddingBottom: '5px' }}>📟 CONSOLE MONITOR (TAMPILAN API):</h4>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0, fontSize: '13px' }}>{screenLog}</pre>
      </div> */}
    </div>
  );
}

export default MasterMesin;