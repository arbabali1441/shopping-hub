'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { 
  Search, ShoppingBag, X, CheckCircle2, Printer, Bot, Sparkles, Send, 
  ChevronLeft, ChevronRight, SlidersHorizontal, Star, Heart, Plus, Minus, 
  Trash2, ShieldCheck, Truck, RefreshCw, Eye, Flame, ArrowRight,
  PackageSearch, Download, ShieldAlert, Award, QrCode, Sparkle
} from 'lucide-react';

const HERO_SLIDES = [
  { 
    id: 1, 
    title: "EXECUTIVE ERGONOMIC SEATING", 
    subtitle: "Italian engineered mesh & dynamic lumbar support crafted for peak performance and posture.", 
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=2000&q=90", 
    tag: "NEW SEASON • EXECUTIVE COLLECTION",
    cta: "EXPLORE COLLECTION"
  },
  { 
    id: 2, 
    title: "ACOUSTIC STUDIO ANC SERIES", 
    subtitle: "Active Noise Cancellation paired with high-fidelity acoustic precision.", 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2000&q=90", 
    tag: "STUDIO AUDIO 2026",
    cta: "DISCOVER SOUND"
  },
  { 
    id: 3, 
    title: "SCANDINAVIAN TIMBER WORKSPACES", 
    subtitle: "Handcrafted solid European oak tables designed for modern minimalist homes.", 
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=2000&q=90", 
    tag: "LUXURY FURNITURE",
    cta: "VIEW TIMBER DESKS"
  }
];

const COLLAB_BRANDS = [
  { name: 'Herman Miller', logo: '🏛️' },
  { name: 'Bose Acoustics', logo: '🎧' },
  { name: 'Logitech Master', logo: '⌨️' },
  { name: 'Steelcase Work', logo: '🪑' },
  { name: 'Apple Enterprise', logo: '💻' },
  { name: 'Keychron Keyboards', logo: '⚡' }
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);

  // Tracking Modal State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // AI Assistant States
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string; receipt?: any }[]>([
    { sender: 'ai', text: "👋 Welcome to Executive Shopping Hub! Ask me to add items to your cart, check order tracking, or print your Luxury 3D Invoice!" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Checkout & Order System
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any>(null);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', paymentMethod: 'Apple Pay / Platinum Card' });
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);

  const { cart, toggleCart, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, wishlist, toggleWishlist, toastMessage } = useCartStore();
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleTrackOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = trackQuery.trim().toLowerCase();
    const found = ordersHistory.find(o => o.orderId.toLowerCase() === query || o.customer.phone.includes(query));
    if (found) {
      setTrackResult(found);
    } else {
      setTrackResult('NOT_FOUND');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      const q = userMsg.toLowerCase();
      let aiText = "";
      let attachReceipt = null;

      const matchedProd = PRODUCTS.find(p => q.includes(p.name.toLowerCase()) || q.includes(p.category.toLowerCase()));
      if (q.includes('add') || q.includes('buy') || q.includes('cart') || q.includes('book') || q.includes('chahiye')) {
        if (matchedProd) {
          addToCart(matchedProd);
          aiText = `✅ I have added "${matchedProd.name}" (AED ${matchedProd.price}) directly to your shopping cart!`;
        } else {
          aiText = "Which item would you like to add? Specify chair, headphones, or desk.";
        }
      } 
      else if (q.includes('receipt') || q.includes('bill') || q.includes('invoice') || q.includes('hub-')) {
        const orderIdMatch = q.match(/hub-\d+/i);
        const searchId = orderIdMatch ? orderIdMatch[0].toUpperCase() : q;
        const foundOrder = ordersHistory.find(o => o.orderId === searchId);

        if (foundOrder) {
          aiText = `👑 Here is your Ultra-Luxury VIP Invoice for Order #${foundOrder.orderId}:`;
          attachReceipt = foundOrder;
        } else if (ordersHistory.length > 0) {
          const latestOrder = ordersHistory[ordersHistory.length - 1];
          aiText = `👑 Here is your latest Ultra-Luxury VIP Receipt for Order #${latestOrder.orderId}:`;
          attachReceipt = latestOrder;
        } else {
          aiText = "No active order found. Please complete a checkout first or provide an order ID (e.g., 'HUB-883921').";
        }
      }
      else if (q.includes('track') || q.includes('status')) {
        if (ordersHistory.length > 0) {
          const lastOrder = ordersHistory[ordersHistory.length - 1];
          aiText = `🚚 Order #${lastOrder.orderId} is [IN TRANSIT] via Express Air UAE Courier.`;
        } else {
          aiText = "Enter your Order ID or phone number in the Track Booking header.";
        }
      }
      else {
        aiText = `Welcome! Ask me: "Add Ergonomic Chair to cart", "Show receipt for HUB-883921", or "Track order status".`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText, receipt: attachReceipt }]);
    }, 500);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) return alert("Please fill all required fields");
    
    const receipt = {
      orderId: 'HUB-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      total: totalAmount,
      tax: Math.round(totalAmount * 0.05),
      grandTotal: Math.round(totalAmount * 1.05),
      customer: { ...customer },
      status: 'VERIFIED & IN TRANSIT'
    };

    setOrdersHistory(prev => [...prev, receipt]);
    setOrderPlaced(receipt);
    setShowCheckout(false);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-12 relative selection:bg-indigo-600 selection:text-white">
      
      {/* Announcement */}
      <div className="bg-gradient-to-r from-amber-600 via-purple-700 to-indigo-800 text-white text-[11px] font-extrabold uppercase tracking-widest py-2 px-4 text-center flex items-center justify-center space-x-2 border-b border-amber-500/20 z-50 relative">
        <Flame className="w-3.5 h-3.5 animate-bounce text-amber-300" />
        <span>ULTRA-LUXURY EXECUTIVE EDITION • FREE EXPRESS UAE SHIPPING ON ORDERS OVER AED 500</span>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-black text-xs px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /><span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <header className="fixed top-8 inset-x-0 z-40 bg-[#07090e]/80 border-b border-slate-800/80 px-6 py-4 flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-600/30">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-wider block leading-none">SHOPPING HUB</span>
            <span className="text-[10px] font-mono text-amber-400 font-semibold tracking-widest uppercase">Luxury Gold Edition</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search products..." 
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-11 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all" 
          />
          {search && (<button onClick={() => setSearch('')} className="absolute right-3 top-3 text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>)}
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={() => setIsTrackingOpen(true)} className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all">
            <PackageSearch className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Track Booking</span>
          </button>

          <button onClick={() => setIsAiOpen(!isAiOpen)} className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-600/20 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">AI Concierge</span>
          </button>

          <button onClick={toggleCart} className="relative p-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-white flex items-center space-x-2 hover:border-slate-700 transition-all">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {cart.length > 0 && (<span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">{cart.reduce((a, c) => a + c.quantity, 0)}</span>)}
          </button>
        </div>
      </header>

      {/* 100vh FULL SCREEN HERO SLIDER */}
      <section className="relative w-full h-screen overflow-hidden bg-slate-950 flex items-center justify-center">
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={slide.image} 
              className="w-full h-full object-cover scale-105 transition-transform duration-10000 ease-out" 
              alt={slide.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />

            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center space-y-6 pt-20">
              <span className="px-4 py-1.5 bg-amber-500/90 border border-amber-300/40 text-slate-950 text-[11px] font-black uppercase tracking-widest rounded-full w-fit backdrop-blur-md">
                {slide.tag}
              </span>
              <h1 className="text-4xl sm:text-7xl font-black text-white max-w-3xl leading-tight tracking-tight uppercase">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg text-slate-300 max-w-xl font-medium leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="pt-4 flex items-center space-x-4">
                <button 
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} 
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-2xl shadow-amber-500/30 flex items-center space-x-3 tracking-wider"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} 
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-slate-950/60 border border-slate-800 text-white rounded-full hover:bg-amber-500 hover:text-slate-950 backdrop-blur-md transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)} 
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-slate-950/60 border border-slate-800 text-white rounded-full hover:bg-amber-500 hover:text-slate-950 backdrop-blur-md transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-10 inset-x-0 z-30 flex justify-center space-x-3">
          {HERO_SLIDES.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)} 
              className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-10 bg-amber-500' : 'w-2 bg-slate-700'}`} 
            />
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">

        {/* Brand Logos */}
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-amber-500/80 text-center">Authorized Global Partners</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COLLAB_BRANDS.map((brand) => (
              <div key={brand.name} className="bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/40 p-4 rounded-2xl flex items-center justify-center space-x-3 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{brand.logo}</span>
                <span className="text-xs font-bold text-slate-300 group-hover:text-amber-400">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Catalog Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white">Curated Product Catalog</h2>
              <p className="text-xs text-slate-400 mt-0.5">Explore premium ergonomic seating and audio solutions</p>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between space-x-4 max-w-md">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Max Budget:</span>
            </div>
            <input type="range" min="200" max="5000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
            <span className="text-xs font-mono font-bold text-emerald-400 w-24 text-right">AED {maxPrice}</span>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p, idx) => {
              const isWishlisted = wishlist.includes(p.id);
              return (
                <div key={`${p.id}-${idx}`} className="bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 transition-all rounded-3xl overflow-hidden p-4 space-y-4 flex flex-col justify-between group relative">
                  
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-950">
                      <Link href={`/product/${p.id}`}>
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                      </Link>
                      
                      {p.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-xl tracking-wider shadow-lg">
                          {p.badge}
                        </span>
                      )}

                      <button onClick={() => toggleWishlist(p.id)} className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md border transition-all ${isWishlisted ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'}`}>
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                      </button>

                      <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/product/${p.id}`} className="w-full py-2.5 bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center space-x-2 backdrop-blur-md transition-all">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{p.category}</span>
                      <Link href={`/product/${p.id}`}>
                        <h3 className="font-bold text-sm text-white hover:text-amber-400 transition-colors line-clamp-1">{p.name}</h3>
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between items-center">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-black text-emerald-400">AED {p.price}</span>
                        <span className="text-xs text-slate-500 line-through">AED {Math.round(p.price * 1.25)}</span>
                      </div>
                      <div className="flex items-center bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        <span>{p.rating}</span>
                      </div>
                    </div>

                    <button onClick={() => addToCart(p)} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2">
                      <ShoppingBag className="w-4 h-4" /><span>Add to Cart</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Track Booking Portal Modal */}
      {isTrackingOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#07090e] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <PackageSearch className="w-5 h-5 text-amber-400" />
                <span>Track Order Booking</span>
              </h3>
              <button onClick={() => { setIsTrackingOpen(false); setTrackResult(null); }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Enter Order ID or Phone Number</label>
                <input 
                  type="text" 
                  value={trackQuery} 
                  onChange={e => setTrackQuery(e.target.value)} 
                  placeholder="e.g. HUB-123456 or +971 50..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" 
                />
              </div>
              <button type="submit" className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all">
                Search Order Status
              </button>
            </form>

            {trackResult && trackResult !== 'NOT_FOUND' && (
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="text-amber-400 font-black">{trackResult.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="text-white font-bold">{trackResult.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">{trackResult.status}</span>
                </div>
              </div>
            )}

            {trackResult === 'NOT_FOUND' && (
              <p className="text-xs text-rose-400 font-bold text-center">No order found. Verify your Order ID or phone number.</p>
            )}
          </div>
        </div>
      )}

      {/* AI Assistant */}
      {isAiOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-[#07090e] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
          <div className="bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 p-4 flex justify-between items-center text-slate-950 font-black">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-slate-950" />
              <div>
                <span className="text-xs block text-slate-950 font-black">AI Concierge & Receipts</span>
                <span className="text-[9px] text-slate-900 font-bold">Interactive Shopping Intelligence</span>
              </div>
            </div>
            <button onClick={() => setIsAiOpen(false)} className="text-slate-950"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60 scrollbar-thin">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-amber-500 text-slate-950 font-bold rounded-br-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>

                {/* Inline 3D Luxury Receipt in Chat */}
                {msg.receipt && (
                  <div className="mt-3 w-full bg-gradient-to-br from-slate-900 via-[#0d111a] to-slate-950 border border-amber-500/40 p-4 rounded-3xl text-xs space-y-3 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex justify-between items-center border-b border-amber-500/20 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 font-black text-[11px] tracking-wider uppercase">Executive VIP Invoice</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">#{msg.receipt.orderId}</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] text-white font-bold">{msg.receipt.customer.name}</p>
                      <p className="text-[10px] text-emerald-400 font-black">Total Paid: AED {msg.receipt.grandTotal || msg.receipt.total}</p>
                    </div>

                    <button onClick={() => setOrderPlaced(msg.receipt)} className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] rounded-xl flex items-center justify-center space-x-1 shadow-lg">
                      <Eye className="w-3 h-3" /><span>View Full 3D VIP Card</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex space-x-2">
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              placeholder="Ask AI: 'Show receipt', 'Add chair'..." 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
            />
            <button type="submit" className="p-2.5 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400 transition-colors"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#07090e] border-l border-slate-800 p-6 flex flex-col justify-between h-full shadow-2xl">
            <div className="space-y-6 overflow-y-auto pr-1">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h2 className="text-lg font-black text-white flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <span>Shopping Cart ({cart.length})</span>
                </h2>
                <button onClick={toggleCart} className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl"><X className="w-5 h-5" /></button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-sm text-slate-400">Your cart is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex space-x-3 items-center">
                      <img src={item.image} className="w-16 h-16 object-cover rounded-xl bg-slate-950" alt={item.name} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <span className="text-xs font-black text-emerald-400">AED {item.price}</span>
                        <div className="flex items-center space-x-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-slate-950 text-slate-300 rounded-lg"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-slate-950 text-slate-300 rounded-lg"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-800 pt-4 space-y-4">
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-xl text-emerald-400">AED {totalAmount}</span>
                </div>
                <button onClick={() => { toggleCart(); setShowCheckout(true); }} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-amber-500/20">
                  PROCEED TO VIP CHECKOUT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#07090e] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white">VIP Order Checkout</h3>
              <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Full Name</label>
                <input required type="text" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Phone Number</label>
                <input required type="tel" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" placeholder="+971 50 123 4567" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">Delivery Address</label>
                <textarea required rows={2} value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" placeholder="Dubai Design District, Building 4..." />
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-amber-500/30">
                GENERATE LUXURY 3D RECEIPT & ORDER (AED {totalAmount})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ULTRA-LUXURY 3D GLASSMORPHISM VIP RECEIPT MODAL */}
      {orderPlaced && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 bg-gradient-to-b from-[#0f1422] via-[#090d16] to-[#05070c] border border-amber-500/40 rounded-[2.5rem] p-6 sm:p-10 text-white shadow-[0_0_80px_rgba(245,158,11,0.15)] overflow-hidden">
            
            {/* Background 3D Ambient Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Gold Hologram Badge & Header */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-amber-500/20 pb-6 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/30 font-black">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black tracking-widest text-amber-400 uppercase">EXECUTIVE HUB</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[9px] font-extrabold rounded-full">VIP CERTIFIED</span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-wider">OFFICIAL PASSPORT RECEIPT</h2>
                </div>
              </div>

              {/* Close Button */}
              <button onClick={() => setOrderPlaced(null)} className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl self-end sm:self-auto"><X className="w-5 h-5" /></button>
            </div>

            {/* Receipt Body & Specs */}
            <div className="relative z-10 py-6 space-y-6">
              
              {/* Security ID & Date Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/60 border border-amber-500/20 p-4 rounded-2xl backdrop-blur-md">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Invoice No</span>
                  <span className="text-xs font-mono font-black text-amber-400">{orderPlaced.orderId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Issue Date</span>
                  <span className="text-xs font-bold text-white">{orderPlaced.date}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Security Status</span>
                  <span className="text-xs font-black text-emerald-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </span>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Billed To</span>
                <p className="text-sm font-black text-white">{orderPlaced.customer.name}</p>
                <p className="text-xs text-slate-400">{orderPlaced.customer.phone} • {orderPlaced.customer.address}</p>
              </div>

              {/* Purchased Items Table */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Purchased Items</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {orderPlaced.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} className="w-10 h-10 object-cover rounded-lg border border-slate-800" alt={item.name} />
                        <div>
                          <p className="font-bold text-white">{item.name}</p>
                          <span className="text-[10px] text-slate-400">Qty: {item.quantity} × AED {item.price}</span>
                        </div>
                      </div>
                      <span className="font-black text-emerald-400">AED {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total Breakdown */}
              <div className="border-t border-amber-500/20 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span>AED {orderPlaced.total}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>VAT (5% UAE Standard)</span>
                  <span>AED {orderPlaced.tax}</span>
                </div>
                <div className="flex justify-between items-center text-base font-black pt-2 border-t border-slate-800">
                  <span className="text-amber-400 uppercase tracking-wider">Grand Total Paid</span>
                  <span className="text-2xl font-black text-emerald-400">AED {orderPlaced.grandTotal}</span>
                </div>
              </div>

              {/* Digital QR Code & Hologram Stamp */}
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <QrCode className="w-10 h-10 text-amber-400" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">Digital Verification QR</span>
                    <span className="text-[9px] font-mono text-slate-500">Scan to verify authenticity</span>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-400/40 rounded-xl text-amber-400 font-black text-[10px] uppercase tracking-widest">
                  VIP EXECUTIVE
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-800">
              <button 
                onClick={() => window.print()} 
                className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 tracking-wider transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>DOWNLOAD / PRINT 3D RECEIPT</span>
              </button>
              <button 
                onClick={() => setOrderPlaced(null)} 
                className="py-4 px-6 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-2xl transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05070b] pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <span className="text-lg font-black text-white tracking-wider">SHOPPING HUB</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premium executive workspace solutions, acoustic audio hardware, and solid European oak timber furniture.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Ergonomic Seating</li>
              <li>Acoustic Headphones</li>
              <li>Solid Oak Desks</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Order Tracking</li>
              <li>2-Year Warranty</li>
              <li>Easy 30-Day Returns</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">Dubai Headquarters</h4>
            <p className="text-xs text-slate-400">Dubai Design District, Building 4, UAE</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
