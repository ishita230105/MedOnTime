import { create } from 'zustand';

// Mock Data
export const MOCK_MEDICINES = [
  { id: '1', name: 'Paracetamol 500mg', molecule_salt: 'Paracetamol', price: 20.0, rx_required: false, category: 'otc', warnings: 'Do not exceed 4g per day.', generic_for: null },
  { id: '2', name: 'Augmentin 625 Duo (Branded)', molecule_salt: 'Amoxicillin + Clavulanic Acid', price: 200.0, rx_required: true, category: 'antibiotics', warnings: 'Complete full course.', generic_for: null },
  { id: '2_generic', name: 'Moxikind-CV (Generic)', molecule_salt: 'Amoxicillin + Clavulanic Acid', price: 60.0, rx_required: true, category: 'antibiotics', warnings: 'Complete full course.', generic_for: '2' },
  { id: '3', name: 'Cetirizine 10mg', molecule_salt: 'Cetirizine', price: 15.0, rx_required: false, category: 'allergies', side_effects: 'May cause drowsiness.', generic_for: null },
  { id: '4', name: 'Bravecto (Dog Flea/Tick)', molecule_salt: 'Fluralaner', price: 1500.0, rx_required: true, category: 'vet', generic_for: null },
  { id: '5', name: 'Heartgard Plus (Dog)', molecule_salt: 'Ivermectin/Pyrantel', price: 800.0, rx_required: true, category: 'vet', generic_for: null }
];

export const useStore = create((set, get) => ({
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),

  // Cart State
  cart: [],
  addToCart: (medicine) => set((state) => {
    const existing = state.cart.find(item => item.medicine.id === medicine.id);
    if (existing) {
      return { cart: state.cart.map(item => item.medicine.id === medicine.id ? { ...item, qty: item.qty + 1 } : item) };
    }
    return { cart: [...state.cart, { medicine, qty: 1 }] };
  }),
  removeFromCart: (medicineId) => set((state) => ({
    cart: state.cart.filter(item => item.medicine.id !== medicineId)
  })),
  clearCart: () => set({ cart: [] }),
  cartTotal: () => get().cart.reduce((total, item) => total + (item.medicine.price * item.qty), 0),
  needsPrescription: () => get().cart.some(item => item.medicine.rx_required),

  // Orders
  orders: [],
  placeOrder: (rxFile = null) => {
    const { cart, cartTotal } = get();
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      total: cartTotal(),
      status: 'pending',
      rx_file_url: rxFile,
      created_at: new Date().toISOString()
    };
    set((state) => ({ 
      orders: [...state.orders, newOrder],
      cart: [] 
    }));
    return newOrder;
  },
  updateOrderStatus: (orderId, newStatus) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
  })),

  // Telehealth State
  telehealthSession: null,
  startTelehealthSession: () => set({ telehealthSession: { status: 'connecting', startTime: Date.now() } }),
  endTelehealthSession: () => set({ telehealthSession: null }),
}));
