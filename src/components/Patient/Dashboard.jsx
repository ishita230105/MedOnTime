import React from 'react';
import { Search, MapPin, Clock, ShoppingCart, Video, PhoneCall, Camera } from 'lucide-react';
import { useStore, MOCK_MEDICINES } from '../../store/useStore';

export default function Dashboard({ navigateTo }) {
  const { cartTotal, cart } = useStore();
  const [activeCategory, setActiveCategory] = React.useState('all');

  const categoryMap = ['otc', 'antibiotics', 'vet', 'allergies'];
  
  const displayedMedicines = activeCategory === 'all' 
    ? MOCK_MEDICINES 
    : MOCK_MEDICINES.filter(m => m.category === activeCategory);

  return (
    <div className="pb-24">
      {/* Header & Geolocation */}
      <div className="bg-emerald-600 text-white p-4 rounded-b-2xl shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <MapPin size={20} />
            <div>
              <p className="text-xs text-emerald-100 uppercase font-semibold">Delivering to</p>
              <h2 className="text-sm font-bold truncate w-48">Home - 123 Health Ave, Mumbai</h2>
            </div>
          </div>
          <button onClick={() => navigateTo('cart')} className="relative p-2 bg-emerald-700 rounded-full hover:bg-emerald-800 transition">
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search medicines, salts, or diseases..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm"
          />
        </div>
      </div>

      {/* Speed Banner */}
      <div className="m-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-emerald-800 text-sm">Lightning Fast Delivery</h3>
            <p className="text-xs text-emerald-600">Your order arrives in 10-15 mins</p>
          </div>
        </div>
      </div>

      {/* Telehealth Panic Button */}
      <div className="mx-4 mb-6">
        <button 
          onClick={() => navigateTo('telehealth')}
          className="w-full bg-red-50 border border-red-200 text-red-700 py-4 px-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-red-100 transition animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <PhoneCall size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm">Consult Doctor Now</h3>
              <p className="text-xs">Instant 10-Min Session (Free)</p>
            </div>
          </div>
          <Video size={20} className="text-red-500" />
        </button>
      </div>

      {/* Quick Actions Panel */}
      <div className="px-4 mb-6 grid grid-cols-2 gap-3">
        <button onClick={() => navigateTo('scanner')} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-xl shadow-md flex items-center space-x-3 hover:shadow-lg transition">
          <Camera size={24} />
          <div className="text-left leading-tight">
            <span className="font-bold text-sm block">Rx Scanner</span>
            <span className="text-[10px] opacity-80">Scan & Reminder</span>
          </div>
        </button>
        <button onClick={() => navigateTo('nearby')} className="bg-white border border-slate-200 text-slate-700 p-4 rounded-xl shadow-sm flex items-center space-x-3 hover:bg-slate-50 transition">
          <MapPin size={24} className="text-blue-500"/>
          <div className="text-left leading-tight">
            <span className="font-bold text-sm block">Nearby Doctors</span>
            <span className="text-[10px] text-slate-500">Hospitals & Vets</span>
          </div>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-800">Shop by Category</h3>
          {activeCategory !== 'all' && (
            <button onClick={() => setActiveCategory('all')} className="text-xs text-emerald-600 font-bold underline">
              View All
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {['OTC Essentials', 'Chronic Care', 'Vet & Pets', 'First Aid'].map((cat, idx) => (
            <div key={idx} onClick={() => setActiveCategory(categoryMap[idx])} className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-1 shadow-sm cursor-pointer transition ${activeCategory === categoryMap[idx] ? 'bg-emerald-100 border-2 border-emerald-500' : 'bg-slate-100 hover:bg-slate-200'}`}>
                <span className="text-2xl">{['💊', '❤️', '🐾', '🩹'][idx]}</span>
              </div>
              <span className="text-[10px] font-semibold text-center text-slate-600">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Medicines */}
      <div className="px-4 mb-6">
        <h3 className="font-bold text-slate-800 mb-3">{activeCategory === 'all' ? 'Trending Right Now' : 'Recommended'}</h3>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {displayedMedicines.length === 0 ? (
            <div className="text-sm text-slate-500 p-4">No items found for this category.</div>
          ) : (
            displayedMedicines.map((med) => (
            <div key={med.id} className="min-w-[160px] bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col justify-between">
              <div>
                {med.rx_required && (
                  <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase mb-2 inline-block">Rx Req</span>
                )}
                <h4 className="font-bold text-sm text-slate-800">{med.name}</h4>
                <p className="text-[10px] text-slate-500 mb-2 truncate">{med.molecule_salt}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-emerald-600">₹{med.price}</span>
                <button 
                  onClick={() => {
                    useStore.getState().addToCart(med);
                  }}
                  className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-200"
                >
                  ADD
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
