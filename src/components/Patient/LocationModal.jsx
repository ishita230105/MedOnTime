import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, X, Loader2 } from 'lucide-react';
import L from 'leaflet';
import { useStore } from '../../store/useStore';

// Custom Map Marker (Avoids Vite static asset image path issues)
const customIcon = new L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Component to handle map clicks and marker movement
function MapEvents({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

export default function LocationModal({ isOpen, onClose }) {
  const { setDeliveryAddress } = useStore();
  const [position, setPosition] = useState({ lat: 27.1767, lng: 78.0081 }); // Default to Agra
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('menu'); // 'menu' or 'map'

  if (!isOpen) return null;

  // Reverse Geocoding via OpenStreetMap (Nominatim API)
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      setLoading(true);
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        // Simplify the long address
        const parts = data.display_name.split(', ');
        const shortAddress = parts.slice(0, 3).join(', ');
        setDeliveryAddress(shortAddress);
        onClose();
      }
    } catch (error) {
      console.error("Error fetching address", error);
      alert("Failed to get address. Try manual entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLocate = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          setLoading(false);
          alert("Location access denied or failed.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const confirmMapSelection = () => {
    fetchAddressFromCoords(position.lat, position.lng);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl shadow-2xl w-full max-w-md mx-auto flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-800">Select Delivery Location</h2>
          <button onClick={onClose} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>

        {view === 'menu' ? (
          <div className="p-5 space-y-4">
            <button 
              onClick={handleAutoLocate}
              disabled={loading}
              className="w-full flex items-center p-4 bg-emerald-50 border border-emerald-200 rounded-2xl hover:bg-emerald-100 transition"
            >
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Navigation size={24} />}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-emerald-800">Use Current Location</h3>
                <p className="text-xs text-emerald-600">Auto-detect using GPS</p>
              </div>
            </button>

            <button 
              onClick={() => setView('map')}
              className="w-full flex items-center p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition shadow-sm"
            >
              <div className="bg-slate-100 p-3 rounded-full text-slate-600 mr-4">
                <MapPin size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800">Select on Map</h3>
                <p className="text-xs text-slate-500">Drag pin to your exact building</p>
              </div>
            </button>

            <button 
              onClick={() => {
                const manual = window.prompt("Type your full address manually:");
                if (manual) {
                  setDeliveryAddress(manual);
                  onClose();
                }
              }}
              className="w-full py-4 text-center font-bold text-slate-500 hover:text-slate-800 text-sm"
            >
              Or type address manually
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[60vh]">
            <div className="flex-1 relative z-0">
              <MapContainer center={[position.lat, position.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            <div className="p-4 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10">
              <button 
                onClick={confirmMapSelection}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 shadow-md flex justify-center items-center"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : 'Confirm This Location'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
