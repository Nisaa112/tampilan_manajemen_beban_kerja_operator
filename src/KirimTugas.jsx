import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function KirimTugas() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState([]);
  
  const [selectedOperator, setSelectedOperator] = useState('');
  const [assignedMachine, setAssignedMachine] = useState({ id: '', name: 'Silakan pilih operator', plant: '-' });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [parts, setParts] = useState([
    { part_name: '', qty: 1, customer: '' }
  ]);

  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/operators')
      .then(res => setOperators(res.data.data))
      .catch(err => console.error(err));
  }, []);

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

  const handleAddRow = () => {
    setParts([...parts, { part_name: '', qty: 1, customer: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updatedParts = [...parts];
    updatedParts.splice(index, 1);
    setParts(updatedParts);
  };

  const handleInputChange = (index, field, value) => {
    const updatedParts = [...parts];
    updatedParts[index][field] = value;
    setParts(updatedParts);
  };

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
    } catch (err) {
      setMessage('Gagal mengirim tugas.');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '15px', boxSizing: 'border-box' }}>
      
      {/* Navigasi Cepat Responsif */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => navigate('/admin-dashboard')} style={{ padding: '8px 12px', cursor: 'pointer' }}>🔙 Dashboard</button>
        <button onClick={() => navigate('/monitoring-tugas')} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>📡 Live Monitoring</button>
      </div>

      <h2 style={{ fontSize: '20px', margin: '15px 0' }}>📝 KIRIM TUGAS HARIAN OPERATOR</h2>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9', boxSizing: 'border-box' }}>
        
        {/* HEADER FORM RESPONSIVE (MENGGUNAKAN GRID AUTO-FIT) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>1. Pilih Operator:</label>
            <select value={selectedOperator} onChange={(e) => handleOperatorChange(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
              <option value="">-- Pilih Operator --</option>
              {operators.map((op) => (
                <option key={op.id} value={op.id}>{op.operator_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Tanggal Pengerjaan:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ gridColumn: '1 / -1', padding: '12px', backgroundColor: '#e9ecef', borderRadius: '6px' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#666' }}>Hasil Logika Auto-Fill Mesin:</span>
            <strong style={{ fontSize: '14px', color: '#333' }}>
              📟 Mesin: {assignedMachine.name} | 📍 Lokasi: {assignedMachine.plant}
            </strong>
          </div>
        </div>

        {/* INPUT DETAIL TUGAS RESPONSIVE (MENGGUNAKAN FLEX WRAP) */}
        <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Daftar Part Pekerjaan</h3>
        {parts.map((part, index) => (
          <div key={index} style={{ 
            display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '15px', 
            borderBottom: '1px dashed #ccc', paddingBottom: '15px' 
          }}>
            <div style={{ flex: '2 1 200px' }}>
              <input type="text" placeholder="Nama Part" value={part.part_name} onChange={(e) => handleInputChange(index, 'part_name', e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 80px' }}>
              <input type="number" placeholder="Qty" min="1" value={part.qty} onChange={(e) => handleInputChange(index, 'qty', e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '2 1 200px' }}>
              <input type="text" placeholder="Nama Customer" value={part.customer} onChange={(e) => handleInputChange(index, 'customer', e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ width: '100%', textAlign: 'right' }}>
              {parts.length > 1 && (
                <button type="button" onClick={() => handleRemoveRow(index)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Hapus Baris</button>
              )}
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAddRow} style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px', fontSize: '12px' }}>
          ➕ Tambah Baris Part
        </button>

        <div style={{ borderTop: '1px solid #ddd', paddingTop: '15px', textAlign: 'right' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', maxWidth: '250px' }}>
            Kirim Tugas Ke Operator
          </button>
        </div>

        {message && <p style={{ marginTop: '15px', color: 'blue', fontWeight: 'bold', textAlign: 'center' }}>{message}</p>}
      </form>
    </div>
  );
}

export default KirimTugas;