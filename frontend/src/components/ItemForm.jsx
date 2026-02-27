import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ItemForm = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    name: '',
    description: '',
    loan_amount: '',
    loan_date: new Date().toISOString().split('T')[0],
    expiry_date: ''
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    axios.get('/api/customers').then(res => setCustomers(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (photo) data.append('photo', photo);

    axios.post('/api/items', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => navigate('/items'))
    .catch(err => alert('發生錯誤: ' + (err.response?.data?.error || err.message)));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">典當物品登錄</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-5 border border-gray-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">選擇客戶</label>
          <select required className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})}>
            <option value="">-- 請選擇客戶 --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id_number})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">物品名稱</label>
          <input required placeholder="例如：黃金戒指" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">特徵描述</label>
          <textarea placeholder="請輸入物品特徵描述" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">上傳照片</label>
          <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setPhoto(e.target.files[0])} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">核貸金額</label>
            <input required type="number" placeholder="金額" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.loan_amount} onChange={e => setFormData({...formData, loan_amount: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">每月利息 (2%)</label>
            <div className="bg-blue-50 text-blue-800 p-2.5 rounded-lg font-bold border border-blue-100">
              NT$ {formData.loan_amount ? (formData.loan_amount * 0.02).toLocaleString() : 0}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">典當日期</label>
            <input required type="date" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.loan_date} onChange={e => setFormData({...formData, loan_date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">滿當日期</label>
            <input required type="date" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg mt-4 active:scale-95">
          確認登錄物品
        </button>
      </form>
    </div>
  );
};
export default ItemForm;
