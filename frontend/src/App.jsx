import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Package, PlusCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-slate-800 text-white flex flex-col">
          <div className="p-6 text-2xl font-bold border-b border-slate-700">質當管理系統</div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className="flex items-center p-3 hover:bg-slate-700 rounded transition-colors"><LayoutDashboard className="mr-3" size={20} /> Dashboard</Link>
            <Link to="/customers" className="flex items-center p-3 hover:bg-slate-700 rounded transition-colors"><Users className="mr-3" size={20} /> 客戶管理</Link>
            <Link to="/items" className="flex items-center p-3 hover:bg-slate-700 rounded transition-colors"><Package className="mr-3" size={20} /> 物品清單</Link>
            <Link to="/items/add" className="flex items-center p-3 hover:bg-slate-700 rounded transition-colors"><PlusCircle className="mr-3" size={20} /> 物品登錄</Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-8"><Routes><Route path="/" element={<Dashboard />} /><Route path="/customers" element={<CustomerList />} /><Route path="/items" element={<ItemList />} /><Route path="/items/add" element={<ItemForm />} /></Routes></main>
      </div>
    </Router>
  );
}
export default App;
