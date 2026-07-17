import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function CartCheckout({ navigateTo }) {
  const { cart, cartTotal, removeFromCart, needsPrescription, placeOrder } = useStore();
  const [rxUploaded, setRxUploaded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = cartTotal();
  const rxNeeded = needsPrescription();

  const handleCheckout = () => {
    if (rxNeeded && !rxUploaded) return;
    setIsCheckingOut(true);
    setTimeout(() => {
      placeOrder(rxUploaded ? 'mock_rx_url.pdf' : null);
      alert('Order Placed Successfully! Generating WhatsApp notification...');
      // WhatsApp Mock Integration
      const text = encodeURIComponent(`Hi, your MediBlink order has been confirmed! Total: ₹${total}. Delivery in 10-15 mins.`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
      navigateTo('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => navigateTo('dashboard')} className="mr-4 text-slate-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Your Cart</h1>
      </div>

      <div className="p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">Your cart is empty.</div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
              {cart.map((item) => (
                <div key={item.medicine.id} className="flex justify-between items-center p-4 border-b border-slate-100 last:border-0">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{item.medicine.name}</h3>
                    <p className="text-xs text-slate-500">Qty: {item.qty} x ₹{item.medicine.price}</p>
                    {item.medicine.rx_required && (
                      <span className="text-[10px] text-red-600 font-bold">Requires Prescription</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">₹{item.medicine.price * item.qty}</p>
                    <button 
                      onClick={() => removeFromCart(item.medicine.id)}
                      className="text-xs text-red-500 underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Prescription Block */}
            {rxNeeded && (
              <div className={`p-4 rounded-xl border ${rxUploaded ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start space-x-3">
                  {rxUploaded ? <FileText className="text-emerald-500" /> : <AlertTriangle className="text-red-500" />}
                  <div>
                    <h3 className={`font-bold text-sm ${rxUploaded ? 'text-emerald-800' : 'text-red-800'}`}>
                      {rxUploaded ? 'Prescription Uploaded' : 'Prescription Required'}
                    </h3>
                    <p className={`text-xs mt-1 ${rxUploaded ? 'text-emerald-600' : 'text-red-600'}`}>
                      {rxUploaded ? 'Your document is verified.' : 'One or more items require a valid doctor\'s prescription.'}
                    </p>
                    
                    {!rxUploaded && (
                      <div className="mt-3 flex space-x-2">
                        <button 
                          onClick={() => setRxUploaded(true)}
                          className="flex items-center px-3 py-2 bg-white border border-red-200 text-red-700 text-xs font-bold rounded-lg shadow-sm hover:bg-red-100"
                        >
                          <Upload size={14} className="mr-1" /> Upload PDF/JPG
                        </button>
                        <button 
                          onClick={() => navigateTo('telehealth')}
                          className="flex items-center px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700"
                        >
                          Consult Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bill Details */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 mb-3">Bill Details</h3>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Item Total</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Delivery Fee</span>
                <span><strike className="text-slate-400 mr-1">₹40</strike> <span className="text-emerald-600 font-bold">FREE</span></span>
              </div>
              <hr className="my-2 border-slate-100" />
              <div className="flex justify-between font-bold text-slate-800 text-lg">
                <span>To Pay</span>
                <span>₹{total}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-4 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button 
            onClick={handleCheckout}
            disabled={isCheckingOut || (rxNeeded && !rxUploaded)}
            className={`w-full py-3 md:py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${
              (rxNeeded && !rxUploaded) 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30'
            }`}
          >
            {isCheckingOut ? 'Processing...' : `Pay ₹${total}`}
          </button>
        </div>
      )}
    </div>
  );
}
