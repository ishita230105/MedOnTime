import React, { useState } from 'react';
import { ArrowLeft, MapPin, Star, Phone, Navigation, ShieldCheck } from 'lucide-react';

export default function NearbyHealth({ navigateTo }) {
  const [filter, setFilter] = useState('all');

  const places = [
    { id: 1, name: 'Dr. Rakesh Patel (Cardiologist)', type: 'doctor', rating: 4.9, reviews: 342, dist: '0.8 km', status: 'Available Now' },
    { id: 2, name: 'City Care Multi-Specialty Hospital', type: 'hospital', rating: 4.7, reviews: 1205, dist: '1.2 km', status: '24/7 ER Open' },
    { id: 3, name: 'Paws & Tails Vet Clinic', type: 'vet', rating: 4.8, reviews: 412, dist: '2.1 km', status: 'Available Now' },
    { id: 4, name: 'Dr. Smita Rao (Pediatrician)', type: 'doctor', rating: 4.9, reviews: 890, dist: '2.5 km', status: 'Available at 4 PM' },
    { id: 5, name: 'Happy Pets Vet Hospital', type: 'vet', rating: 4.6, reviews: 200, dist: '3.0 km', status: 'Emergency Only' }
  ];

  const filteredPlaces = filter === 'all' ? places : places.filter(p => p.type === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10 border-b border-slate-100">
        <button onClick={() => navigateTo('dashboard')} className="mr-4 text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Nearby Health & Vets</h1>
          <p className="text-xs text-slate-500 flex items-center"><MapPin size={12} className="mr-1"/> Detecting your location...</p>
        </div>
      </div>

      <div className="p-4">
        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
          {['all', 'hospital', 'doctor', 'vet'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap capitalize transition ${filter === f ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              {f === 'all' ? 'All Nearby' : `${f}s`}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4 pb-10">
          {filteredPlaces.map(place => (
            <div key={place.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 pr-4">{place.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${place.type === 'vet' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                  {place.type}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star size={14} className="fill-amber-500 mr-1"/> {place.rating} <span className="text-slate-400 font-normal ml-1">({place.reviews})</span>
                </div>
                <div className="flex items-center">
                  <Navigation size={14} className="mr-1 text-slate-400" /> {place.dist}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4 text-sm">
                <ShieldCheck size={16} className="text-emerald-500"/>
                <span className="text-emerald-600 font-semibold">{place.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => place.type === 'vet' ? navigateTo('telehealth_vet') : navigateTo('telehealth')}
                  className="flex items-center justify-center py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200"
                >
                  <Phone size={14} className="mr-2" /> Book Consult
                </button>
                <button className="flex items-center justify-center py-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-sm hover:bg-emerald-100 border border-emerald-200">
                  <Navigation size={14} className="mr-2" /> Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
