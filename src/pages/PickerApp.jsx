import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Package, CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PickerApp() {
  const { orders, updateOrderStatus } = useStore();
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState(null);

  const pendingOrders = orders.filter(o => o.status === 'pending');

  const handlePickItem = (orderId, index) => {
    // Simple state mutation for mock
    const itemEl = document.getElementById(`item-${orderId}-${index}`);
    if(itemEl) {
      itemEl.classList.add('opacity-50', 'line-through');
    }
  };

  const handleHandover = (orderId) => {
    updateOrderStatus(orderId, 'out_for_delivery');
    setActiveOrder(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto shadow-2xl relative">
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </button>
          <Package className="text-emerald-400" />
          <h1 className="font-bold">Dark Store Terminal</h1>
        </div>
        <span className="bg-emerald-500 text-xs px-2 py-1 rounded font-bold">{pendingOrders.length} Pending</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {!activeOrder ? (
          <div className="space-y-4">
            <h2 className="font-bold text-slate-800">Incoming Orders</h2>
            {pendingOrders.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">No pending orders.</div>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} className="bg-white border-l-4 border-red-500 rounded-lg p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800">Order #{order.id}</h3>
                    <p className="text-xs text-slate-500">{order.items.length} items • <Clock size={12} className="inline"/> 2 mins ago</p>
                  </div>
                  <button 
                    onClick={() => setActiveOrder(order)}
                    className="bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-700"
                  >
                    Start Picking
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Picking Order #{activeOrder.id}</h2>
              <span className="text-xs font-mono text-red-500 font-bold">2:59</span>
            </div>

            <div className="space-y-3 mb-6">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} id={`item-${activeOrder.id}-${idx}`} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 transition-all">
                  <div className="flex items-start space-x-3">
                    <button onClick={() => handlePickItem(activeOrder.id, idx)} className="text-slate-300 hover:text-emerald-500 mt-1">
                      <CheckCircle size={24} />
                    </button>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{item.medicine.name} x {item.qty}</h4>
                      <p className="text-xs text-slate-500 font-mono">Shelf: {String.fromCharCode(65 + idx)}-{Math.floor(Math.random()*10)+1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleHandover(activeOrder.id)}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition"
            >
              Handover to Rider
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
