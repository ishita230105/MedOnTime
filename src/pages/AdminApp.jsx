import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ShieldAlert, TrendingUp, PackageSearch, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminApp() {
  const { inventory, fetchInventory, orders, fetchOrders } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
    fetchOrders();
  }, []);

  const totalSold = inventory.reduce((acc, item) => acc + item.total_sold, 0);
  const revenue = orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.total_amount, 0);
  const lowStockItems = inventory.filter(i => i.stock_level <= i.reorder_threshold);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative shadow-2xl pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="mr-3">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Admin Headquarters</h1>
          <button onClick={() => fetchInventory()} className="ml-auto text-emerald-400">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-emerald-500 mb-2"><TrendingUp size={24} /></div>
            <p className="text-2xl font-black text-slate-800">{totalSold}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Items Sold</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-emerald-500 mb-2"><span className="font-bold text-2xl">₹</span></div>
            <p className="text-2xl font-black text-slate-800">{revenue}</p>
            <p className="text-xs font-bold text-slate-500 uppercase">Revenue (Completed)</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <h2 className="font-bold text-slate-800 flex items-center mt-6">
          <ShieldAlert className="mr-2 text-red-500" size={20}/> Low Stock Alerts
        </h2>
        {lowStockItems.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
            <p className="text-sm font-bold text-emerald-700">All stock levels are healthy! ✅</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="bg-red-50 border border-red-200 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-red-800">{item.medicines?.name}</p>
                  <p className="text-xs text-red-600">Threshold: {item.reorder_threshold}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-red-600">{item.stock_level}</p>
                  <p className="text-[10px] uppercase font-bold text-red-500">Left in Stock</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Inventory Catalog */}
        <h2 className="font-bold text-slate-800 flex items-center mt-6">
          <PackageSearch className="mr-2 text-slate-500" size={20}/> Full Inventory
        </h2>
        <div className="space-y-3">
          {inventory.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">{item.medicines?.name}</p>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">
                  {item.medicines?.category}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-800">{item.stock_level}</p>
                <p className="text-xs font-bold text-slate-500">Stock</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
