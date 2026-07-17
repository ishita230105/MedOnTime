import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoleSelector from './pages/RoleSelector';
import PatientApp from './pages/PatientApp';
import PickerApp from './pages/PickerApp';
import RiderApp from './pages/RiderApp';
import AdminApp from './pages/AdminApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelector />} />
        <Route path="/patient" element={<PatientApp />} />
        <Route path="/picker" element={<PickerApp />} />
        <Route path="/rider" element={<RiderApp />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
