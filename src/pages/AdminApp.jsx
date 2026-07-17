import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, TrendingUp, Users, Activity, BatteryWarning } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminApp() {
  const { orders } = useStore();
  const navigate = useNavigate();

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
      <div className="bg-slate-900 text-white p-4 flex items-center space-x-3 shadow-md sticky top-0 z-10">
        <button onClick={() => navigate('/')}><ArrowLeft size={20} /></button>
        <h1 className="font-bold">Master Admin</h1>
      </div>

      <div className="p-4 space-y-4 pb-10">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><TrendingUp size={20}/></div>
              <span className="text-xs font-bold text-emerald-500">+12%</span>
            </div>
            <p className="text-xs text-slate-500">GMV (Today)</p>
            <h3 className="font-bold text-lg text-slate-800">₹{totalRevenue > 0 ? totalRevenue : 14500}</h3>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users size={20}/></div>
              <span className="text-xs font-bold text-emerald-500">+5%</span>
            </div>
            <p className="text-xs text-slate-500">Active Users</p>
            <h3 className="font-bold text-lg text-slate-800">1,204</h3>
          </div>
        </div>

        {/* Doctor Utility Rate */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="text-slate-400" size={20} />
            <h3 className="font-bold text-sm text-slate-800">Telehealth Utility Rate</h3>
          </div>
          <div className="flex items-end h-24 space-x-2">
            {[40, 60, 30, 80, 50, 90, 75].map((val, idx) => (
              <div key={idx} className="flex-1 bg-slate-100 rounded-t-md relative group">
                <div 
                  className="absolute bottom-0 w-full bg-emerald-500 rounded-t-md transition-all" 
                  style={{ height: `${val}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Low Inventory Alerts */}
        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
          <div className="flex items-center space-x-2 mb-3">
            <BatteryWarning className="text-red-500" size={20} />
            <h3 className="font-bold text-sm text-red-800">Critical Stock Alerts</h3>
          </div>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Amoxicillin 250mg</span>
              <span className="text-red-600 font-bold">2 strips left</span>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Cetirizine 10mg</span>
              <span className="text-red-600 font-bold">5 strips left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
