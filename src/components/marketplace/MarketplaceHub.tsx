/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Crown, Sparkles, Bot, ShoppingCart, ShieldCheck, DollarSign, 
  Layers, Package, CheckCircle2, ArrowRight, Filter, Search, 
  Globe, Building, Compass, Coffee, Users, BookOpen, PenTool, Upload, Eye, FileText, Lock, Plus
} from 'lucide-react';

import { AdPosition, SponsorshipPackage, BookingItem, CommercialOrder, CustomQuote } from '../../types';
import AIAdvertisingAdvisor from './AIAdvertisingAdvisor';
import MarketplaceCartModal from './MarketplaceCartModal';
import PaystackCheckoutModal from './PaystackCheckoutModal';
import ArtworkSubmissionModal from './ArtworkSubmissionModal';
import ProofOfDisplayGallery from './ProofOfDisplayGallery';
import AdminCommercialCenter from './AdminCommercialCenter';

import CustomServicesDesk from './CustomServicesDesk';

interface MarketplaceHubProps {
  onBackToMain?: () => void;
}

export default function MarketplaceHub({ onBackToMain }: MarketplaceHubProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'packages' | 'advisor' | 'builder' | 'services' | 'creative' | 'client_desk' | 'proofs'>('inventory');
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  
  // Inventory state from server
  const [positions, setPositions] = useState<AdPosition[]>([]);
  const [packages, setPackages] = useState<SponsorshipPackage[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cart / Booking State
  const [cartItems, setCartItems] = useState<BookingItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Paystack & Order Modals
  const [activeOrderForPayment, setActiveOrderForPayment] = useState<CommercialOrder | null>(null);
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [selectedOrderForArtwork, setSelectedOrderForArtwork] = useState<CommercialOrder | null>(null);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [isAdminCenterOpen, setIsAdminCenterOpen] = useState(false);

  // Client Orders Lookup state
  const [clientLookupEmail, setClientLookupEmail] = useState('');
  const [clientOrders, setClientOrders] = useState<CommercialOrder[]>([]);
  const [hasSearchedOrders, setHasSearchedOrders] = useState(false);

  // Creative Request State
  const [creativeOrg, setCreativeOrg] = useState('');
  const [creativePerson, setCreativePerson] = useState('');
  const [creativeEmail, setCreativeEmail] = useState('');
  const [creativePhone, setCreativePhone] = useState('');
  const [creativeGoal, setCreativeGoal] = useState('');
  const [creativeAudience, setCreativeAudience] = useState('Aviation CEOs & Regulators');
  const [creativeFormat, setCreativeFormat] = useState('Programme Booklet A4 & Foyer Roll-up Banner');
  const [creativeLogoUrl, setCreativeLogoUrl] = useState('');
  const [creativeResult, setCreativeResult] = useState<any>(null);
  const [isGeneratingCreative, setIsGeneratingCreative] = useState(false);

  // Load Inventory from API
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/marketplace/inventory');
      if (res.ok) {
        const data = await res.json();
        if (data.positions) setPositions(data.positions);
        if (data.packages) setPackages(data.packages);
      }
    } catch (err) {
      console.error('Failed to load inventory from API:', err);
    }
  };

  // Cart Handlers
  const handleAddToCart = (position: AdPosition, quantity = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.positionId === position.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: 'b-item-' + Date.now() + Math.random().toString(36).substr(2, 4),
          positionId: position.id,
          name: position.name,
          category: position.category,
          quantity,
          unitPriceNGN: position.priceNGN,
          unitPriceUSD: position.priceUSD,
          supplyOption: 'SUPPLIED_BY_CLIENT',
          productionCostNGN: position.productionCostNGN || 0,
          productionCostUSD: position.productionCostUSD || 0,
          installationCostNGN: position.installationCostNGN || 0,
          installationCostUSD: position.installationCostUSD || 0
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleAddPackageToCart = (pkg: SponsorshipPackage) => {
    setCartItems(prev => {
      return [
        ...prev,
        {
          id: 'b-pkg-' + Date.now(),
          packageId: pkg.id,
          name: `${pkg.name} (${pkg.tier} Sponsorship Package)`,
          category: 'SPONSORSHIPS',
          quantity: 1,
          unitPriceNGN: pkg.priceNGN,
          unitPriceUSD: pkg.priceUSD,
          supplyOption: 'PRODUCE_AND_INSTALL',
          productionCostNGN: 0,
          productionCostUSD: 0,
          installationCostNGN: 0,
          installationCostUSD: 0
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleSupplyOption = (index: number, option: 'SUPPLIED_BY_CLIENT' | 'PRODUCE_AND_INSTALL') => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].supplyOption = option;
      return updated;
    });
  };

  // Order Submission & Paystack Flow
  const handleProceedToPaystack = async (orderPayload: Partial<CommercialOrder>) => {
    try {
      const res = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success && data.order) {
        setActiveOrderForPayment(data.order);
        setIsCartOpen(false);
        setIsPaystackOpen(true);
      }
    } catch (err) {
      console.error('Order creation error:', err);
    }
  };

  const handlePaymentSuccess = (verifiedOrder: CommercialOrder) => {
    setCartItems([]);
    setIsPaystackOpen(false);
    setSelectedOrderForArtwork(verifiedOrder);
    setIsArtworkModalOpen(true);
  };

  const handleRequestFormalQuote = async (quotePayload: any) => {
    try {
      const res = await fetch('/api/marketplace/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotePayload)
      });
      const data = await res.json();
      if (data.success && data.quote) {
        alert(`Official Pro-Forma Quotation #${data.quote.quoteNumber} has been generated and logged with the Domislink Secretariat!`);
        setIsCartOpen(false);
      }
    } catch (err) {
      console.error('Quote request error:', err);
    }
  };

  // Client Orders Lookup
  const handleLookupOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientLookupEmail) return;
    try {
      const res = await fetch(`/api/marketplace/orders?email=${encodeURIComponent(clientLookupEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setClientOrders(data.orders || []);
        setHasSearchedOrders(true);
      }
    } catch (err) {
      console.error('Failed to lookup orders:', err);
    }
  };

  // Creative Request Submission
  const handleGenerateCreative = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingCreative(true);
    try {
      const res = await fetch('/api/marketplace/creative-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: creativeOrg,
          contactPerson: creativePerson,
          email: creativeEmail,
          phone: creativePhone,
          message: creativeGoal,
          targetAudience: creativeAudience,
          preferredSizeFormat: creativeFormat,
          logoUrl: creativeLogoUrl,
          deadline: '17 November 2026'
        })
      });
      const data = await res.json();
      if (data.success && data.request) {
        setCreativeResult(data.request);
      }
    } catch (err) {
      console.error('Creative request failed:', err);
    } finally {
      setIsGeneratingCreative(false);
    }
  };

  const currencySymbol = currency === 'USD' ? '$' : '₦';

  const filteredPositions = positions.filter((pos) => {
    const matchesCategory = categoryFilter === 'ALL' || pos.category === categoryFilter;
    const matchesSearch = pos.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pos.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pos.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = cartItems.reduce((sum, it) => sum + (it.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#071324] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans pb-24">
      
      {/* Top Banner Identity */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0A192F] to-slate-950 border-b border-amber-500/20 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg flex items-center justify-center text-slate-950">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-amber-400 text-sm tracking-wider">
                  COMMERCIAL MARKETPLACE & SPONSORSHIP PORTAL
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Aviation Safety Summit 2026 • 17 Nov 2026 • Marriott Hotel Ikeja, Lagos
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-auto">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs font-mono">
              <button
                onClick={() => setCurrency('NGN')}
                className={`px-2.5 py-1 rounded-lg transition font-bold ${
                  currency === 'NGN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                ₦ NGN
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg transition font-bold ${
                  currency === 'USD' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative py-1.5 px-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center space-x-2 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {cartItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-black flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Admin Commercial Trigger */}
            <button
              onClick={() => setIsAdminCenterOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Desk</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 flex items-center space-x-1 overflow-x-auto shadow-md">
          {[
            { id: 'inventory', label: 'Advertising Inventory', icon: Layers, badge: `${positions.length}+ Opportunities` },
            { id: 'packages', label: 'Sponsorship Packages', icon: Package, badge: 'Title to Bronze' },
            { id: 'advisor', label: 'AI Commercial Advisor', icon: Bot, badge: 'Gemini AI' },
            { id: 'builder', label: 'Bundle & Custom Builder', icon: Compass, badge: 'Interactive' },
            { id: 'services', label: 'Custom Services', icon: Users, badge: 'Special Requests' },
            { id: 'creative', label: 'Creative Design Studio', icon: PenTool, badge: 'In-House Service' },
            { id: 'client_desk', label: 'Artwork & Client Desk', icon: Upload, badge: 'Approvals' },
            { id: 'proofs', label: 'Proof of Display', icon: ShieldCheck, badge: 'Auditable' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-2 transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Body Containers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ========================================================== */}
        {/* TAB 1: ADVERTISING INVENTORY */}
        {/* ========================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Category Filter Pills & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
              
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                {[
                  { id: 'ALL', label: 'All Inventory' },
                  { id: 'ONLINE', label: 'Online & Digital' },
                  { id: 'VENUE', label: 'Venue & Physical' },
                  { id: 'AIRPORT_ROUTE', label: 'Airport & Route' },
                  { id: 'EXHIBITION', label: 'Exhibition & Simulators' },
                  { id: 'FOOD_WATER', label: 'Food & Water' },
                  { id: 'STAFF', label: 'Event Staffing' },
                  { id: 'BOOK_MEDIA', label: 'Books & Media' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                      categoryFilter === cat.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-56 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 pr-8"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>

            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPositions.map((pos) => {
                const price = currency === 'USD' ? pos.priceUSD : pos.priceNGN;
                const prodCost = currency === 'USD' ? pos.productionCostUSD : pos.productionCostNGN;

                return (
                  <div 
                    key={pos.id} 
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4 relative group"
                  >
                    
                    <div className="space-y-3">
                      
                      {/* Category & Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                          {pos.category}
                        </span>
                        {pos.badge && (
                          <span className="text-[10px] bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-mono font-bold">
                            {pos.badge}
                          </span>
                        )}
                        {pos.exclusive && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-mono font-bold">
                            EXCLUSIVE
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition">
                          {pos.name}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3">
                          {pos.description}
                        </p>
                      </div>

                      {/* Technical Specs */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                        <div>
                          <strong className="text-slate-300">Location:</strong> {pos.location}
                        </div>
                        <div>
                          <strong className="text-slate-300">Format:</strong> {pos.sizeFormat}
                        </div>
                        <div>
                          <strong className="text-slate-300">Audience Reach:</strong> {pos.targetAudience}
                        </div>
                        {pos.regulatoryNote && (
                          <div className="text-amber-200/90 pt-1 border-t border-slate-800 flex items-start space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{pos.regulatoryNote}</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-3">
                      
                      <div className="flex items-baseline justify-between font-mono">
                        <div>
                          <span className="text-xl font-extrabold text-amber-400">
                            {currencySymbol}{(price || 0).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">{currency}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {pos.availableInventory} / {pos.totalInventory} Available
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(pos)}
                          disabled={pos.availableInventory <= 0}
                          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition ${
                            pos.availableInventory > 0
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{pos.availableInventory > 0 ? 'Book Position' : 'Sold Out'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('advisor');
                          }}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Advise</span>
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: SPONSORSHIP PACKAGES */}
        {/* ========================================================== */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-white font-serif tracking-wide">
                Official Summit Partnership & Sponsorship Tiers
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Elevate your corporate leadership and brand authority alongside ministers, regulators, airline chairmen, and 500+ aviation executives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const price = currency === 'USD' ? pkg.priceUSD : pkg.priceNGN;

                return (
                  <div
                    key={pkg.id}
                    className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between space-y-5 relative ${
                      pkg.popular
                        ? 'border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                        : 'border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        MOST PRESTIGIOUS TIER
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                          {pkg.tier} PARTNERSHIP
                        </span>
                        <h4 className="text-xl font-bold text-white mt-1">{pkg.name}</h4>
                        <p className="text-xs text-amber-300/90 font-medium mt-0.5">{pkg.tagline}</p>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono">
                        {pkg.isCustomPrice ? (
                          <span className="text-lg font-bold text-amber-400">Custom Agreement</span>
                        ) : (
                          <div>
                            <span className="text-2xl font-black text-amber-400">
                              {currencySymbol}{(price || 0).toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">{currency}</span>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {pkg.slotsAvailable} of {pkg.slotsTotal} Slot(s) Remaining
                        </span>
                      </div>

                      {/* Benefits Checklist */}
                      <div className="space-y-2 text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                          Included Privileges & Deliverables:
                        </span>
                        {pkg.benefits.map((benefit, bIdx) => (
                          <div key={bIdx} className="flex items-start space-x-2 text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddPackageToCart(pkg)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg"
                    >
                      <Package className="w-4 h-4" />
                      <span>Select {pkg.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: AI ADVISOR */}
        {/* ========================================================== */}
        {activeTab === 'advisor' && (
          <AIAdvertisingAdvisor
            onAddToCart={handleAddToCart}
            onSelectPackage={handleAddPackageToCart}
            currency={currency}
          />
        )}

        {/* ========================================================== */}
        {/* TAB 4: BUNDLE & CUSTOM BUILDER */}
        {/* ========================================================== */}
        {activeTab === 'builder' && (
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-serif">
                Interactive Custom Sponsorship & Bundle Builder
              </h3>
              <p className="text-xs text-slate-400">
                Select combinations of online, venue branding, exhibition stands, and delegate hospitality to calculate an instant bundled price.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.slice(0, 9).map((pos) => {
                const isSelected = cartItems.some(i => i.positionId === pos.id);
                const price = currency === 'USD' ? pos.priceUSD : pos.priceNGN;

                return (
                  <div
                    key={pos.id}
                    onClick={() => {
                      if (isSelected) {
                        const idx = cartItems.findIndex(i => i.positionId === pos.id);
                        if (idx > -1) handleRemoveCartItem(idx);
                      } else {
                        handleAddToCart(pos);
                      }
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-white">{pos.name}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'border border-slate-700 text-slate-500'
                      }`}>
                        {isSelected ? '✓' : '+'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">{pos.category}</span>
                      <span className="text-amber-400 font-bold">{currencySymbol}{price.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Custom Bundle Total ({cartItems.length} items)</span>
                <span className="text-xl font-bold text-amber-400 font-mono">
                  {currencySymbol}{cartItems.reduce((acc, it) => acc + ((currency === 'USD' ? it.unitPriceUSD : it.unitPriceNGN) * it.quantity), 0).toLocaleString()} {currency}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Review & Checkout Bundle
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: CUSTOM SERVICES */}
        {/* ========================================================== */}
        {activeTab === 'services' && (
          <CustomServicesDesk onRequestQuote={handleRequestFormalQuote} />
        )}

        {/* ========================================================== */}
        {/* TAB 6: CREATIVE STUDIO */}
        {/* ========================================================== */}
        {activeTab === 'creative' && (
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-serif">
                Domislink In-House Creative Design Service & AI Concept Studio
              </h3>
              <p className="text-xs text-slate-400">
                Don’t have completed print or digital artwork? Submit your vector logo and campaign briefing. Our creative team will draft and refine high-impact advertising layouts.
              </p>
            </div>

            <form onSubmit={handleGenerateCreative} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AeroSat Nigeria Ltd"
                    value={creativeOrg}
                    onChange={(e) => setCreativeOrg(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Contact Person & Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="Engr. Emeka Nwosu • +234 802..."
                    value={creativePerson}
                    onChange={(e) => setCreativePerson(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="enwosu@aerosat.ng"
                    value={creativeEmail}
                    onChange={(e) => setCreativeEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Logo URL or Drive Link</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={creativeLogoUrl}
                    onChange={(e) => setCreativeLogoUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-xs block mb-1">Campaign Message / Objective</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. We want to position ourselves as the #1 avionics supplier in West Africa with a focus on safety radar sensors."
                  value={creativeGoal}
                  onChange={(e) => setCreativeGoal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingCreative}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Advertising Draft Concept</span>
              </button>
            </form>

            {creativeResult && (
              <div className="p-5 bg-slate-950 rounded-xl border border-amber-500/30 space-y-3">
                <span className="text-xs font-bold text-amber-400 block font-mono">
                  PROPOSED ADVERTISING COPY & ARTWORK CONCEPT
                </span>
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900 p-4 rounded-lg border border-slate-800">
                  {creativeResult.aiDraftConcept}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 6: CLIENT DESK */}
        {/* ========================================================== */}
        {activeTab === 'client_desk' && (
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-serif">
                Client Portal & Artwork Verification Desk
              </h3>
              <p className="text-xs text-slate-400">
                Look up your commercial sponsorship order to upload artwork, check secretariat technical clearance, and download official receipts.
              </p>
            </div>

            <form onSubmit={handleLookupOrders} className="flex gap-2 max-w-lg">
              <input
                type="email"
                required
                placeholder="Enter your booking email address..."
                value={clientLookupEmail}
                onChange={(e) => setClientLookupEmail(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Lookup Orders
              </button>
            </form>

            {hasSearchedOrders && (
              <div className="space-y-4">
                {clientOrders.length === 0 ? (
                  <p className="text-xs text-slate-400">No commercial orders found for this email address.</p>
                ) : (
                  clientOrders.map((order) => (
                    <div key={order.id} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white text-sm">{order.companyName}</span>
                          <span className="text-xs text-amber-400 font-mono ml-2">#{order.orderNumber}</span>
                        </div>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'VERIFIED_PAID'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrderForArtwork(order);
                            setIsArtworkModalOpen(true);
                          }}
                          className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700"
                        >
                          Manage Artwork ({order.artworkFiles?.length || 0} Assets)
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 7: PROOF OF DISPLAY */}
        {/* ========================================================== */}
        {activeTab === 'proofs' && (
          <ProofOfDisplayGallery />
        )}

      </div>

      {/* Floating Cart Modal Drawer */}
      <MarketplaceCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onToggleSupplyOption={handleToggleSupplyOption}
        onToggleAddon={() => {}}
        onProceedToPaystack={handleProceedToPaystack}
        onRequestFormalQuote={handleRequestFormalQuote}
      />

      {/* Paystack Checkout Modal */}
      <PaystackCheckoutModal
        isOpen={isPaystackOpen}
        onClose={() => setIsPaystackOpen(false)}
        order={activeOrderForPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Artwork Submission Modal */}
      <ArtworkSubmissionModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
        order={selectedOrderForArtwork}
        onArtworkUploaded={(upOrder) => setSelectedOrderForArtwork(upOrder)}
      />

      {/* Admin Commercial Center Modal */}
      {isAdminCenterOpen && (
        <AdminCommercialCenter
          onClose={() => setIsAdminCenterOpen(false)}
          onRefreshData={fetchInventory}
        />
      )}

    </div>
  );
}
