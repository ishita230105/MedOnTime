import React, { useState } from 'react';
import Dashboard from '../components/Patient/Dashboard';
import CartCheckout from '../components/Patient/CartCheckout';
import TelehealthMock from '../components/Patient/TelehealthMock';
import TelehealthVetMock from '../components/Patient/TelehealthVetMock';
import ScannerMock from '../components/Patient/ScannerMock';
import NearbyHealth from '../components/Patient/NearbyHealth';

export default function PatientApp() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white relative shadow-2xl">
      {currentView === 'dashboard' && <Dashboard navigateTo={setCurrentView} />}
      {currentView === 'cart' && <CartCheckout navigateTo={setCurrentView} />}
      {currentView === 'telehealth' && <TelehealthMock navigateTo={setCurrentView} />}
      {currentView === 'telehealth_vet' && <TelehealthVetMock navigateTo={setCurrentView} />}
      {currentView === 'scanner' && <ScannerMock navigateTo={setCurrentView} />}
      {currentView === 'nearby' && <NearbyHealth navigateTo={setCurrentView} />}
    </div>
  );
}
