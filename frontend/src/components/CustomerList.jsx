import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', id_number: '' });
  useEffect(() => { fetchCustomers(); }, []);
  const fetchCustomers = () => { axios.get('/api/customers').then(res => setCustomers(res.data)); };
  const handleSubmit = (e) => { e.preventDefault(); axios.post('/api/customers', formData).then(() => { setFormData({ name: '', phone: '', id_number: '' }); setShowForm(false); fetchCustomers(); }).catch(err => alert(err.response?.data?.error || '發生錯誤')); };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">客戶管理</h1><button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"><UserPlus className="mr-2" size={20} /> 新增客戶</button></div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <input required placeholder="姓名" className="border rounded-md px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input placeholder="電話" className="border rounded-md px-3 py-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input required placeholder="身分證字號" className="border rounded-md px-3 py-2" value={formData.id_number} onChange={e => setFormData({...formData, id_number: e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 md:col-span-3">儲存</button>
        </form>
      )}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-100">{customers.map(c => (<tr key={c.id}><td className="px-6 py-4">{c.name}</td><td className="px-6 py-4">{c.phone}</td><td className="px-6 py-4">{c.id_number}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};
export default CustomerList;
