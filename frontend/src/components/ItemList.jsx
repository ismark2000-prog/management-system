import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Download, RefreshCw } from 'lucide-react';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { axios.get('/api/items').then(res => setItems(res.data)); }, []);

  const handleTransfer = (item) => {
    navigate('/luxury-items/add', {
      state: {
        ...item,
        fromTransfer: true
      }
    });
  };

  const exportToCSV = () => {
    const headers = ['物品名稱', '客戶', '電話', '核貸金額', '每月利息', '典當日期', '滿當日期'];
    const data = items.map(item => [
      item.name,
      item.customer_name,
      item.customer_phone,
      item.loan_amount,
      item.monthly_interest,
      item.loan_date,
      item.expiry_date
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `items_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">質當物品清單</h1>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Download size={18} className="mr-2" /> 匯出資料
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">物品名稱</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">客戶 / 電話</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">核貸金額 (利息)</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">滿當日期</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className={`${item.is_alert ? 'bg-red-50' : 'hover:bg-gray-50'} transition`}>
                <td className="px-6 py-4">
                  <div className={`font-bold ${item.is_alert ? 'text-red-600' : 'text-gray-800'}`}>{item.name}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-700">{item.customer_name}</div>
                  <div className="text-xs text-gray-500">{item.customer_phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">${item.loan_amount.toLocaleString()}</div>
                  <div className="text-xs text-blue-600 font-medium">利息: ${item.monthly_interest.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`font-medium ${item.is_alert ? 'text-red-600' : 'text-gray-700'}`}>
                    {dayjs(item.expiry_date).format('YYYY-MM-DD')}
                  </div>
                  {item.is_alert && <div className="text-[10px] font-bold text-red-500 uppercase">即將到期</div>}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleTransfer(item)}
                    className="inline-flex items-center text-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md font-bold hover:bg-amber-200 transition"
                  >
                    <RefreshCw size={14} className="mr-1.5" /> 轉為精品
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">尚無質當資料</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ItemList;
