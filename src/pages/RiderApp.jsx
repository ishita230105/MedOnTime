import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Map, Navigation, CheckCircle, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RiderApp() {
  const { orders, updateOrderStatus } = useStore();
  const navigate = useNavigate();
  const [podUploaded, setPodUploaded] = useState(false);
  const activeOrders = orders.filter(o => o.status === 'out_for_delivery');

  const handleDeliver = (orderId) => {
    if(!podUploaded) return alert('Please upload Proof of Delivery first.');
    updateOrderStatus(orderId, 'completed');
    setPodUploaded(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto shadow-2xl relative">
      {/* Map Mockup Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
          alt="Map" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      <div className="z-10 p-4 bg-white/90 backdrop-blur shadow-sm flex items-center space-x-3">
        <button onClick={() => navigate('/')} className="text-slate-700"><ArrowLeft size={20} /></button>
        <h1 className="font-bold text-slate-800">Rider Hub</h1>
      </div>

      <div className="flex-1 flex flex-col justify-end p-4 z-10 space-y-4">
        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <h2 className="font-bold text-slate-800">Waiting for orders...</h2>
            <p className="text-sm text-slate-500">You are online in Zone 1 (Mumbai)</p>
          </div>
        ) : (
          activeOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-bold">Order #{order.id}</h3>
                  <p className="text-xs text-slate-400">Est. Time: 7 mins</p>
                </div>
                <div className="bg-blue-500 p-2 rounded-full"><Navigation size={20} /></div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Customer Location</h4>
                    <p className="text-xs text-slate-500">123 Health Ave, Mumbai</p>
                  </div>
                </div>
                
                <hr className="border-slate-100" />

                <div className="flex justify-between space-x-2">
                  <button 
                    onClick={() => setPodUploaded(true)}
                    className={`flex-1 py-3 flex justify-center items-center rounded-xl border-2 font-bold text-sm transition ${podUploaded ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    {podUploaded ? <CheckCircle size={18} className="mr-2"/> : <Camera size={18} className="mr-2"/>}
                    {podUploaded ? 'POD Saved' : 'Upload POD'}
                  </button>
                  <button 
                    onClick={() => handleDeliver(order.id)}
                    disabled={!podUploaded}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition ${podUploaded ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-300'}`}
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
