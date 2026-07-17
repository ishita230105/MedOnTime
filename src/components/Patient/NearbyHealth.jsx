import React, { useState } from 'react';
import { ArrowLeft, MapPin, Star, Phone, Clock, Video, Building2, UserCircle2 } from 'lucide-react';
import regionalData from '../../data/regionalDB.json';
import { useStore } from '../../store/useStore';

export default function NearbyHealth({ navigateTo }) {
  const [activeTab, setActiveTab] = useState('doctors');
  const { setSelectedDoctor } = useStore();

  const handleConsult = (doctor) => {
    setSelectedDoctor(doctor);
    if (doctor.isVet) {
      navigateTo('telehealth_vet');
    } else {
      navigateTo('telehealth');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateTo('dashboard')} className="p-2 -ml-2 rounded-full hover:bg-emerald-700 transition">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Agra & Firozabad Health</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('doctors')}
          className={`flex-1 py-4 text-center font-bold ${activeTab === 'doctors' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
        >
          <div className="flex items-center justify-center gap-2"><UserCircle2 size={18}/> Doctors</div>
        </button>
        <button 
          onClick={() => setActiveTab('hospitals')}
          className={`flex-1 py-4 text-center font-bold ${activeTab === 'hospitals' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
        >
          <div className="flex items-center justify-center gap-2"><Building2 size={18}/> Hospitals</div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'doctors' ? (
          regionalData.doctors.map((doc) => (
            <div key={doc.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{doc.name}</h3>
                  <p className="text-emerald-600 font-medium text-sm">{doc.specialty}</p>
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-sm font-bold">
                  <Star size={14} className="mr-1 fill-yellow-500" /> {doc.rating}
                </div>
              </div>
              
              <div className="flex items-center text-slate-500 text-sm gap-1">
                <MapPin size={14} /> {doc.hospital}
              </div>
              <div className="flex items-center text-slate-500 text-sm gap-1">
                <Clock size={14} /> {doc.experience} Experience
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                <span className="font-black text-slate-800">₹{doc.fee} <span className="text-xs font-normal text-slate-500">/ consult</span></span>
                <button 
                  onClick={() => handleConsult(doc)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition"
                >
                  <Video size={16} /> Consult Now
                </button>
              </div>
            </div>
          ))
        ) : (
          regionalData.hospitals.map((hosp) => (
            <div key={hosp.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800 text-lg">{hosp.name}</h3>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-sm font-bold">
                  <Star size={14} className="mr-1 fill-yellow-500" /> {hosp.rating}
                </div>
              </div>
              <p className="text-emerald-600 font-medium text-sm">{hosp.type}</p>
              
              <div className="flex justify-between text-slate-500 text-sm mt-2">
                <div className="flex items-center gap-1"><MapPin size={14} /> {hosp.location}</div>
                <div className="font-bold text-slate-400">{hosp.distance}</div>
              </div>

              <button className="w-full mt-3 bg-slate-100 text-slate-700 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition">
                <Phone size={16} /> Contact Hospital
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
