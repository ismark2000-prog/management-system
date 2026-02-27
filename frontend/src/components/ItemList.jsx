import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
const ItemList = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { axios.get('/api/items').then(res => setItems(res.data)); }, []);
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <tbody>
          {items.map(item => (
            <tr key={item.id} className={item.is_alert ? 'bg-red-50 text-red-600' : ''}>
              <td className="px-6 py-4">{item.name}</td><td className="px-6 py-4">${item.loan_amount}</td><td className="px-6 py-4">${item.monthly_interest} (2%)</td><td className="px-6 py-4">{dayjs(item.expiry_date).format('YYYY-MM-DD')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ItemList;
