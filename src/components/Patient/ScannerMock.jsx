import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, Clock, ArrowLeft, Loader2, Pill } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ScannerMock({ navigateTo }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const { addToCart, medicines } = useStore();

  const handleAddAll = () => {
    let med = medicines.find(m => m.name.toLowerCase().includes('augmentin'));
    if (!med && medicines.length > 0) med = medicines[0]; // fallback to anything so demo works
    if (med) addToCart(med);
    navigateTo('cart');
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setResult([
        { name: 'Augmentin 625 Duo', times: ['Morning (After Breakfast)', 'Night (After Dinner)'], days: 5 },
        { name: 'Pan 40', times: ['Morning (Empty Stomach)'], days: 5 }
      ]);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative">
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10 border-b border-slate-100">
        <button onClick={() => navigateTo('dashboard')} className="mr-4 text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">AI Rx Scanner</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {!result && !scanning && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-emerald-100 p-6 rounded-full">
              <Camera size={48} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Scan Prescription</h2>
              <p className="text-slate-500 mt-2 text-sm px-4">Our AI will read your handwritten prescription, add items to cart, and build a pill reminder schedule.</p>
            </div>
            
            <div className="w-full space-y-3 mt-8">
              <button onClick={handleSimulateScan} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-700 flex justify-center items-center">
                <Camera size={20} className="mr-2" /> Open Camera
              </button>
              <button onClick={handleSimulateScan} className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-xl shadow-sm hover:bg-slate-200 border border-slate-200 flex justify-center items-center">
                <Upload size={20} className="mr-2" /> Upload Gallery Image
              </button>
            </div>
          </div>
        )}

        {scanning && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-lg animate-ping opacity-20"></div>
              <img src="https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&q=80&w=200" alt="Scanning..." className="w-48 h-64 object-cover rounded-lg shadow-2xl" />
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#34d399]"></div>
            </div>
            <div className="flex items-center text-emerald-600 font-bold">
              <Loader2 className="animate-spin mr-2" /> Extracting medicines...
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-start">
              <CheckCircle className="text-emerald-500 mt-1 mr-3" size={24} />
              <div>
                <h3 className="font-bold text-emerald-800">Prescription Analyzed!</h3>
                <p className="text-sm text-emerald-600">We found 2 medicines. Reminders have been set.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center">
                <Pill className="mr-2 text-slate-500" size={20}/> Your Pill Schedule
              </h3>
              {result.map((med, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 text-lg">{med.name}</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">{med.days} Days</span>
                  </div>
                  <div className="space-y-2">
                    {med.times.map((t, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <Clock size={16} className="text-emerald-500 mr-2" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleAddAll} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-700">
              Add All to Cart & Continue
            </button>
          </div>
        )}
      </div>
      
      {/* Global Style for scanning animation */}
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}
