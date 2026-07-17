import React, { useState, useEffect } from 'react';
import { Video, PhoneOff, Mic, MicOff, Camera, CameraOff, FileText } from 'lucide-react';
import { useStore, MOCK_MEDICINES } from '../../store/useStore';

export default function TelehealthMock({ navigateTo }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [status, setStatus] = useState('connecting');
  const { addToCart } = useStore();

  useEffect(() => {
    // Simulate connection time
    const connectTimer = setTimeout(() => {
      setStatus('active');
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    let interval = null;
    if (status === 'active' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleEndCall();
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  const handleEndCall = () => {
    setStatus('completed');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleApplyPrescription = () => {
    // Mock doctor prescribed Amoxicillin
    addToCart(MOCK_MEDICINES.find(m => m.id === '2')); 
    navigateTo('cart');
  };

  if (status === 'completed') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Session Completed</h2>
          <p className="text-slate-500 mb-6 text-sm">Dr. Sharma has uploaded your digital prescription.</p>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-left">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Prescribed Medicines:</h3>
            <ul className="text-sm text-slate-600 list-disc pl-4 space-y-1">
              <li>Amoxicillin 250mg (1 strip)</li>
              <li>Paracetamol 500mg (SOS)</li>
            </ul>
          </div>

          <button 
            onClick={handleApplyPrescription}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            Add to Cart & Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-slate-900/80 absolute top-0 w-full z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold">
            DR
          </div>
          <div>
            <h2 className="font-bold text-sm">Dr. Amit Sharma</h2>
            <p className="text-xs text-emerald-400">
              {status === 'connecting' ? 'Connecting...' : 'General Physician'}
            </p>
          </div>
        </div>
        {status === 'active' && (
          <div className="bg-slate-800 px-3 py-1 rounded-full text-sm font-mono text-emerald-400">
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Video Area (Mock) */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-800">
        {status === 'connecting' ? (
          <div className="animate-pulse flex flex-col items-center">
            <Video size={48} className="text-slate-500 mb-4" />
            <p className="text-slate-400">Waiting for doctor to join...</p>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {/* Main Video (Doctor) */}
            <img 
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1000" 
              alt="Doctor" 
              className="w-full h-full object-cover"
            />
            {/* Picture in Picture (Patient) */}
            <div className="absolute top-20 right-4 w-24 h-32 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600 shadow-lg">
              {isVideoOff ? (
                <div className="w-full h-full flex items-center justify-center">
                  <CameraOff size={24} className="text-slate-400" />
                </div>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
                  alt="Patient"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-900 p-6 flex justify-center space-x-6">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'} transition`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button 
          onClick={handleEndCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition"
        >
          <PhoneOff size={24} />
        </button>
        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'} transition`}
        >
          {isVideoOff ? <CameraOff size={24} /> : <Camera size={24} />}
        </button>
      </div>
    </div>
  );
}
