import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Package, Clock } from 'lucide-react';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/dashboard')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-gray-500">載入中...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">系統概覽</h1>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">總典當物品</p>
            <p className="text-4xl font-black text-gray-800 mt-1">{data?.total_items || 0}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <Package size={32} className="text-blue-500" />
          </div>
        </div>

        <div className={`bg-white p-8 rounded-2xl shadow-sm border ${data?.alert_count > 0 ? 'border-red-100 ring-2 ring-red-50' : 'border-gray-100'} flex items-center justify-between`}>
          <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">即將到期警示 (5天內)</p>
            <p className={`text-4xl font-black mt-1 ${data?.alert_count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {data?.alert_count || 0}
            </p>
          </div>
          <div className={`${data?.alert_count > 0 ? 'bg-red-50' : 'bg-gray-50'} p-4 rounded-xl`}>
            <AlertCircle size={32} className={data?.alert_count > 0 ? 'text-red-500' : 'text-gray-400'} />
          </div>
        </div>
      </div>

      {/* 警示清單 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-red-50/30">
          <div className="flex items-center text-red-700 font-bold">
            <Clock className="mr-2" size={20} />
            即將滿當警示項目
          </div>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
            紅色警示
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="px-8 py-4">物品名稱</th>
                <th className="px-8 py-4">客戶名稱</th>
                <th className="px-8 py-4">滿當日期</th>
                <th className="px-8 py-4">狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.alerts.length > 0 ? (
                data.alerts.map(item => (
                  <tr key={item.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-8 py-5 font-bold text-red-600">{item.name}</td>
                    <td className="px-8 py-5 text-gray-600">{item.customer_name}</td>
                    <td className="px-8 py-5 text-gray-600">{dayjs(item.expiry_date).format('YYYY-MM-DD')}</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        剩餘 {item.days_left < 0 ? '已逾期' : item.days_left + ' 天'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-gray-300 italic">
                    目前沒有需要立即處理的警示項目
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
