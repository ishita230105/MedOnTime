import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import localMedicines from '../data/medicinesDB.json';

export const useStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  userRole: 'patient',
  setUserRole: (role) => set({ userRole: role }),
  selectedDoctor: null,
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),

  // Real Data
  medicines: [],
  inventory: [],
  fetchMedicines: async () => {
    try {
      if (!supabase) {
        set({ medicines: localMedicines });
        return;
      }
      const { data } = await supabase.from('medicines').select('*');
      if (data && data.length > 0) {
        set({ medicines: data });
      } else {
        set({ medicines: localMedicines });
      }
    } catch (e) {
      console.error("fetchMedicines Error:", e);
      set({ medicines: localMedicines });
    }
  },
  fetchInventory: async () => {
    try {
      if (!supabase) return;
      const { data } = await supabase.from('inventory').select('*, medicines(*)');
      if (data) set({ inventory: data });
    } catch (e) {
      console.error("fetchInventory Error:", e);
    }
  },

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

  // Orders State (Supabase Connected)
  orders: [],
  fetchOrders: async () => {
    try {
      if (!supabase) return;
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) set({ orders: data });
    } catch (e) {
      console.error("fetchOrders Error:", e);
    }
  },

  placeOrder: async (rxFileUrl = null) => {
    try {
      const { cart, cartTotal, user } = get();
      if (!supabase) return null;

      const newOrder = {
        patient_id: user?.id || null,
        total_amount: cartTotal(),
        status: 'pending',
        items: cart,
        rx_file_url: rxFileUrl
      };

      const { data, error } = await supabase.from('orders').insert(newOrder).select().single();
      
      if (!error && data) {
        set((state) => ({ 
          orders: [data, ...state.orders],
          cart: [] 
        }));
        return data;
      }
      if (error) console.error("placeOrder Supabase Error:", error);
    } catch (e) {
      console.error("placeOrder Error:", e);
    }
    return null;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    if (!supabase) return;
    // Optimistic UI update
    set((state) => ({
      orders: state.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    }));
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  },

  // Setup Realtime Listener for Orders
  initializeRealtime: () => {
    try {
      if (!supabase) return;
      const channel = supabase.channel('public:orders');
      if (channel && channel.on) {
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
          get().fetchOrders();
        });
        
        // Some older v2 clients require subscribe to be called directly on the channel, not chained.
        if (channel.subscribe) {
          channel.subscribe();
        }
      }
    } catch (e) {
      console.error("Realtime Init Error:", e);
    }
  }
}));
