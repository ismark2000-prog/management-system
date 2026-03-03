import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const LuxuryItemForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const transferData = location.state || {};

  const [formData, setFormData] = useState({
    brand: transferData.name || '',
    model: transferData.description || '',
    condition: '9成新',
    tags: '',
    cost_price: transferData.loan_amount || '',
    wholesale_price: '',
    retail_price: '',
    source: transferData.fromTransfer ? '流當轉入' : '買斷收購',
    photo_path: transferData.photo_path || null
  });
  const [photo, setPhoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    if (photo) data.append('photo', photo);

    axios.post('/api/luxury-items', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => navigate('/luxury-items'))
    .catch(err => alert('發生錯誤: ' + (err.response?.data?.error || err.message)));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">精品登錄</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-5 border border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">品牌</label>
            <input required placeholder="例如：Rolex" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">型號</label>
            <input required placeholder="例如：Submariner" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">新舊狀態</label>
          <select className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
            <option value="全新">全新</option>
            <option value="9成新">9成新</option>
            <option value="有使用痕跡">有使用痕跡</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">彈性標籤/備註 (配件、雷射碼等)</label>
          <textarea placeholder="例如：盒單齊全, 亂碼字頭" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border h-24" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">進貨來源</label>
          <select className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
            <option value="流當轉入">流當轉入</option>
            <option value="買斷收購">買斷收購</option>
            <option value="同業調貨">同業調貨</option>
            <option value="新品代購">新品代購</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-red-600 mb-1">取得成本 (內部機密)</label>
            <input required type="number" placeholder="成本" className="w-full border-red-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none border" value={formData.cost_price} onChange={e => setFormData({...formData, cost_price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">同行盤件價</label>
            <input required type="number" placeholder="盤件價" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.wholesale_price} onChange={e => setFormData({...formData, wholesale_price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">終端預售價</label>
            <input required type="number" placeholder="預售價" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none border" value={formData.retail_price} onChange={e => setFormData({...formData, retail_price: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">照片上傳</label>
          {formData.photo_path && !photo && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">已帶入原典當照片：</p>
              <img src={formData.photo_path} alt="Preview" className="w-20 h-20 object-cover rounded border" />
            </div>
          )}
          <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setPhoto(e.target.files[0])} />
        </div>

        <button type="submit" className="w-full bg-slate-800 text-white p-3.5 rounded-lg font-bold hover:bg-slate-900 transition shadow-lg mt-4 active:scale-95">
          確認登錄精品
        </button>
      </form>
    </div>
  );
};

export default LuxuryItemForm;
