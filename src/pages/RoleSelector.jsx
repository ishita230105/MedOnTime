import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, Activity, Truck, Settings } from 'lucide-react';

export default function RoleSelector() {
  const navigate = useNavigate();
  const { setUserRole } = useStore();

  const handleRoleSelect = (role, path) => {
    setUserRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">MediBlink</h1>
          <p className="text-slate-500">Select a role to continue</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => handleRoleSelect('patient', '/patient')}
            className="w-full flex items-center p-4 rounded-xl border-2 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
          >
            <div className="bg-emerald-100 p-2 rounded-lg mr-4">
              <User className="text-emerald-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-800">Patient / User</h3>
              <p className="text-sm text-slate-500">Order medicines & Telehealth</p>
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelect('picker', '/picker')}
            className="w-full flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            <div className="bg-slate-100 p-2 rounded-lg mr-4">
              <Activity className="text-slate-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-800">Dark Store Picker</h3>
              <p className="text-sm text-slate-500">Manage orders & inventory</p>
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelect('rider', '/rider')}
            className="w-full flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            <div className="bg-slate-100 p-2 rounded-lg mr-4">
              <Truck className="text-slate-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-800">Delivery Rider</h3>
              <p className="text-sm text-slate-500">Deliveries & routing</p>
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelect('admin', '/admin')}
            className="w-full flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            <div className="bg-slate-100 p-2 rounded-lg mr-4">
              <Settings className="text-slate-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-800">Master Admin</h3>
              <p className="text-sm text-slate-500">Analytics & system health</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
