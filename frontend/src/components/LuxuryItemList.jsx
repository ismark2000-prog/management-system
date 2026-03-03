import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';

const LuxuryItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/luxury-items').then(res => setItems(res.data));
  }, []);

  const exportToCSV = (type) => {
    let headers = [];
    let data = [];

    if (type === 'internal') {
      headers = ['SKU', '品牌', '型號', '狀態', '標籤', '取得成本', '盤件價', '預售價', '來源'];
      data = items.map(item => [
        item.sku,
        item.brand,
        item.model,
        item.condition,
        item.tags,
        item.cost_price,
        item.wholesale_price,
        item.retail_price,
        item.source
      ]);
    } else {
      headers = ['SKU', '品牌', '型號', '狀態', '標籤', '盤件價', '預售價'];
      data = items.map(item => [
        item.sku,
        item.brand,
        item.model,
        item.condition,
        item.tags,
        item.wholesale_price,
        item.retail_price
      ]);
    }

    const csvContent = "\uFEFF" + [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `luxury_items_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">精品清單</h1>
        <div className="space-x-3">
          <button
            onClick={() => exportToCSV('internal')}
            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            <Download size={18} className="mr-2" /> 匯出內部帳
          </button>
          <button
            onClick={() => exportToCSV('external')}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Download size={18} className="mr-2" /> 匯出同行/對外清單
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">照片</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">SKU / 品牌</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">型號 / 狀態</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">成本 (私)</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">盤件價</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">預售價</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">來源</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  {item.photo_path ? (
                    <img src={item.photo_path} alt="Item" className="w-12 h-12 object-cover rounded shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">無照片</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-blue-600">{item.sku}</div>
                  <div className="text-sm text-gray-600 font-medium">{item.brand}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{item.model}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.condition === '全新' ? 'bg-green-100 text-green-700' :
                    item.condition === '9成新' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-red-600">${item.cost_price.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-gray-700">${item.wholesale_price.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">${item.retail_price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{item.source}</span>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">尚無精品資料</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LuxuryItemList;
