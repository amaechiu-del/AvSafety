/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Package, ShieldCheck, CheckCircle2, 
  AlertCircle, Upload, Eye, FileText, Plus, Edit2, Save, X, RefreshCw, Filter, Search, Layers, Sparkles
} from 'lucide-react';
import { AdPosition, SponsorshipPackage, CommercialOrder, CustomQuote, ProofOfDisplayRecord, RevenueMetrics } from '../../types';

interface AdminCommercialCenterProps {
  onClose: () => void;
  onRefreshData?: () => void;
}

export default function AdminCommercialCenter({ onClose, onRefreshData }: AdminCommercialCenterProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'quotes' | 'proofs'>('analytics');
  
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [orders, setOrders] = useState<CommercialOrder[]>([]);
  const [positions, setPositions] = useState<AdPosition[]>([]);
  const [packages, setPackages] = useState<SponsorshipPackage[]>([]);
  const [quotes, setQuotes] = useState<CustomQuote[]>([]);
  const [proofs, setProofs] = useState<ProofOfDisplayRecord[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [selectedOrderForArtwork, setSelectedOrderForArtwork] = useState<CommercialOrder | null>(null);
  const [artworkFeedbackText, setArtworkFeedbackText] = useState('');
  const [selectedOrderForProof, setSelectedOrderForProof] = useState<CommercialOrder | null>(null);
  const [proofTitle, setProofTitle] = useState('');
  const [proofLocation, setProofLocation] = useState('Marriott Hotel Ikeja — Grand Foyer');
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');

  // Edit Position state
  const [editingPosition, setEditingPosition] = useState<AdPosition | null>(null);

  useEffect(() => {
    fetchAdminCommercialData();
  }, []);

  const fetchAdminCommercialData = async () => {
    setIsLoading(true);
    try {
      // 1. Metrics
      const metricsRes = await fetch('/api/marketplace/revenue-metrics');
      if (metricsRes.ok) {
        const d = await metricsRes.json();
        if (d.metrics) setMetrics(d.metrics);
      }

      // 2. Orders
      const ordersRes = await fetch('/api/marketplace/orders', {
        headers: { 'x-admin-mode': 'true' }
      });
      if (ordersRes.ok) {
        const d = await ordersRes.json();
        if (d.orders) setOrders(d.orders);
      }

      // 3. Inventory
      const invRes = await fetch('/api/marketplace/inventory');
      if (invRes.ok) {
        const d = await invRes.json();
        if (d.positions) setPositions(d.positions);
        if (d.packages) setPackages(d.packages);
      }

      // 4. Quotes
      const quotesRes = await fetch('/api/marketplace/quotes');
      if (quotesRes.ok) {
        const d = await quotesRes.json();
        if (d.quotes) setQuotes(d.quotes);
      }

      // 5. Proofs
      const proofsRes = await fetch('/api/marketplace/proof-of-display');
      if (proofsRes.ok) {
        const d = await proofsRes.json();
        if (d.proofs) setProofs(d.proofs);
      }
    } catch (err) {
      console.error('Failed to load commercial admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string, paymentStatus: string) => {
    try {
      const res = await fetch('/api/marketplace/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, orderStatus, paymentStatus })
      });
      if (res.ok) {
        fetchAdminCommercialData();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleArtworkDecision = async (orderId: string, artworkId: string, status: 'APPROVED' | 'REVISION_REQUIRED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/marketplace/orders/artwork-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          artworkId,
          status,
          adminFeedback: artworkFeedbackText || (status === 'APPROVED' ? 'Approved by Secretariat for venue display and programme print.' : 'Please provide 300 DPI CMYK vector file.')
        })
      });
      if (res.ok) {
        setSelectedOrderForArtwork(null);
        setArtworkFeedbackText('');
        fetchAdminCommercialData();
      }
    } catch (err) {
      console.error('Failed to submit artwork decision:', err);
    }
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForProof || !proofUrl) return;

    try {
      const res = await fetch('/api/marketplace/proof-of-display', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderForProof.id,
          title: proofTitle || 'Live Venue / Portal Display Deployment',
          location: proofLocation,
          mediaUrl: proofUrl,
          mediaType: 'PHOTOGRAPH',
          notes: proofNotes || 'Verified active on 17 November 2026.',
          verifiedBy: 'Domislink Secretariat Compliance Officer'
        })
      });
      if (res.ok) {
        setSelectedOrderForProof(null);
        setProofTitle('');
        setProofUrl('');
        setProofNotes('');
        fetchAdminCommercialData();
      }
    } catch (err) {
      console.error('Failed to upload proof of display:', err);
    }
  };

  const handleSavePositionEdit = async () => {
    if (!editingPosition) return;
    const updated = positions.map(p => p.id === editingPosition.id ? editingPosition : p);
    try {
      const res = await fetch('/api/marketplace/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positions: updated })
      });
      if (res.ok) {
        setPositions(updated);
        setEditingPosition(null);
      }
    } catch (err) {
      console.error('Failed to update inventory position:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold text-lg font-serif">Domislink Commercial Control Center</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  ADMINISTRATOR SECURE
                </span>
              </div>
              <p className="text-xs text-slate-400">Aviation Safety Summit 2026 Commercial Sponsorship & Advertising Operations</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAdminCommercialData}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/80 px-6 py-2.5 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Revenue Analytics', icon: TrendingUp },
            { id: 'orders', label: `Orders Ledger (${orders.length})`, icon: Package },
            { id: 'inventory', label: `Inventory Master (${positions.length})`, icon: Layers },
            { id: 'quotes', label: `Custom Quotations (${quotes.length})`, icon: FileText },
            { id: 'proofs', label: `Proof of Display Logs (${proofs.length})`, icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: REVENUE ANALYTICS */}
          {activeTab === 'analytics' && metrics && (
            <div className="space-y-6">
              
              {/* Primary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-sans">Total Commercial Sales</span>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    ₦{metrics.totalSalesNGN.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-500 block font-mono">
                    + ${metrics.totalSalesUSD.toLocaleString()} USD
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
                  <span className="text-xs text-emerald-400 font-sans">Verified Paid Revenue</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    ₦{metrics.paidRevenueNGN.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-500 block font-mono">
                    {metrics.paidOrdersCount} Settled Transactions
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1">
                  <span className="text-xs text-amber-300 font-sans">Pending Invoiced & Unpaid</span>
                  <div className="text-2xl font-black text-amber-300 font-mono">
                    ₦{metrics.pendingRevenueNGN.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-500 block font-mono">
                    {metrics.pendingOrdersCount} Pending Clearances
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-sans">Commercial Bookings</span>
                  <div className="text-2xl font-black text-white font-mono">
                    {metrics.ordersCount}
                  </div>
                  <span className="text-[11px] text-teal-400 block font-mono">
                    Across 8 Monetisation Categories
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Revenue Distribution by Category
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(metrics.byCategory || {}).map(([cat, val]) => {
                    const categoryData = val as { totalNGN: number; count: number };
                    return (
                      <div key={cat} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-amber-400 font-mono font-bold block">{cat}</span>
                        <span className="text-sm font-bold text-white font-mono">₦{(categoryData.totalNGN || 0).toLocaleString()}</span>
                        <span className="text-[11px] text-slate-400 block">{categoryData.count || 0} items sold</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Corporate Spenders */}
              {metrics.topCompanies && metrics.topCompanies.length > 0 && (
                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Top Corporate Sponsors & Advertisers
                  </h4>
                  <div className="space-y-2">
                    {metrics.topCompanies.map((c, i) => (
                      <div key={i} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-[10px]">
                            {i + 1}
                          </span>
                          <span className="font-bold text-white">{c.companyName}</span>
                          <span className="text-slate-500">({c.ordersCount} bookings)</span>
                        </div>
                        <span className="font-mono font-bold text-amber-400">
                          ₦{c.totalNGN.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ORDERS LEDGER */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Commercial Orders Directory
                </h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search by company or order #..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none w-56"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="VERIFIED_PAID">Paid Only</option>
                    <option value="UNPAID">Unpaid Only</option>
                    <option value="APPROVED">Approved</option>
                    <option value="SUBMITTED">Submitted</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {orders
                  .filter(o => {
                    const matchesSearch = o.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'VERIFIED_PAID' ? o.paymentStatus === 'VERIFIED_PAID' : o.paymentStatus !== 'VERIFIED_PAID');
                    return matchesSearch && matchesStatus;
                  })
                  .map((order) => (
                    <div key={order.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{order.companyName}</span>
                            <span className="font-mono text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {order.orderNumber}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                              order.paymentStatus === 'VERIFIED_PAID'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            {order.contactPerson} • {order.email} • {order.phone}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-extrabold text-amber-400 font-mono block">
                            {order.currency === 'USD' ? '$' : '₦'}{order.totalAmount?.toLocaleString()} {order.currency}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-2.5 bg-slate-900 rounded-lg text-xs space-y-1">
                        <span className="text-[11px] text-slate-400 block font-semibold">Booked Items:</span>
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300">
                            <span>• {it.name} (Qty: {it.quantity})</span>
                            <span className="text-slate-400">{it.supplyOption}</span>
                          </div>
                        ))}
                      </div>

                      {/* Management Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(
                              order.id, 
                              order.orderStatus, 
                              order.paymentStatus === 'VERIFIED_PAID' ? 'UNPAID' : 'VERIFIED_PAID'
                            )}
                            className={`px-3 py-1 rounded-lg font-semibold transition ${
                              order.paymentStatus === 'VERIFIED_PAID'
                                ? 'bg-slate-800 text-slate-400 hover:text-red-400'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            }`}
                          >
                            {order.paymentStatus === 'VERIFIED_PAID' ? 'Mark as Unpaid' : 'Mark as Verified Paid'}
                          </button>

                          <button
                            onClick={() => setSelectedOrderForArtwork(order)}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-semibold flex items-center space-x-1"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Artwork Desk ({order.artworkFiles?.length || 0})</span>
                          </button>

                          <button
                            onClick={() => setSelectedOrderForProof(order)}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-semibold flex items-center space-x-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Log Proof of Display</span>
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500 text-[11px]">Workflow Stage:</span>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value, order.paymentStatus)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                          >
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="DEPLOYED">DEPLOYED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY MASTER */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Advertising & Sponsorship Inventory Control
                </h4>
              </div>

              <div className="space-y-3">
                {positions.map((pos) => (
                  <div key={pos.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{pos.name}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            {pos.category}
                          </span>
                          {pos.exclusive && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                              EXCLUSIVE
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">{pos.location}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right font-mono">
                          <span className="text-sm font-bold text-amber-400 block">
                            ₦{pos.priceNGN.toLocaleString()} / ${pos.priceUSD}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Avail: {pos.availableInventory} / {pos.totalInventory}
                          </span>
                        </div>
                        <button
                          onClick={() => setEditingPosition({ ...pos })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM QUOTATIONS */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Custom Corporate Proposals & Quotations
                </h4>
              </div>

              <div className="space-y-3">
                {quotes.map((q) => (
                  <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{q.companyName}</span>
                          <span className="font-mono text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded">
                            {q.quoteNumber}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            {q.status}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">{q.summary}</span>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-base font-extrabold text-amber-400 block">
                          ₦{q.totalAmount.toLocaleString()} {q.currency}
                        </span>
                        <span className="text-[10px] text-slate-500">Valid until {q.validUntil}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROOFS OF DISPLAY */}
          {activeTab === 'proofs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Proof of Delivery Logs
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proofs.map((p) => (
                  <div key={p.id} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                    <img src={p.mediaUrl} alt={p.title} className="w-full h-36 object-cover" />
                    <div className="p-3 space-y-1.5 text-xs">
                      <span className="font-bold text-white block">{p.companyName}</span>
                      <span className="text-slate-400 block">{p.title} • {p.location}</span>
                      <span className="text-[10px] text-emerald-400 font-mono block">Verified by {p.verifiedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Sub-modal: Artwork Review Desk */}
      {selectedOrderForArtwork && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold">Review Artwork: {selectedOrderForArtwork.companyName}</h3>
              <button onClick={() => setSelectedOrderForArtwork(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedOrderForArtwork.artworkFiles && selectedOrderForArtwork.artworkFiles.length > 0 ? (
              <div className="space-y-3">
                {selectedOrderForArtwork.artworkFiles.map((file) => (
                  <div key={file.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">{file.fileName}</span>
                      <span className="text-amber-400 font-mono">{file.status}</span>
                    </div>
                    <a 
                      href={file.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-400 underline block"
                    >
                      View / Download Asset ({file.fileUrl})
                    </a>

                    <textarea
                      rows={2}
                      placeholder="Admin technical feedback / print instructions..."
                      value={artworkFeedbackText}
                      onChange={(e) => setArtworkFeedbackText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleArtworkDecision(selectedOrderForArtwork.id, file.id, 'APPROVED')}
                        className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded"
                      >
                        Approve for Print
                      </button>
                      <button
                        onClick={() => handleArtworkDecision(selectedOrderForArtwork.id, file.id, 'REVISION_REQUIRED')}
                        className="flex-1 py-1.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded"
                      >
                        Request Revision
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Customer has not uploaded artwork yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Sub-modal: Log Proof of Display */}
      {selectedOrderForProof && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <form onSubmit={handleUploadProof} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold">Log Proof of Display: {selectedOrderForProof.companyName}</h3>
              <button type="button" onClick={() => setSelectedOrderForProof(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Display Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Foyer Entrance Arch & Delegate Lanyards Live"
                  value={proofTitle}
                  onChange={(e) => setProofTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={proofLocation}
                  onChange={(e) => setProofLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Photograph / Screenshot URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Notes / Verification Details</label>
                <textarea
                  rows={2}
                  placeholder="Verified by compliance team..."
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Confirm & Save Delivery Evidence
            </button>
          </form>
        </div>
      )}

      {/* Sub-modal: Edit Position */}
      {editingPosition && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold">Edit Position: {editingPosition.name}</h3>
              <button onClick={() => setEditingPosition(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Price NGN</label>
                <input
                  type="number"
                  value={editingPosition.priceNGN}
                  onChange={(e) => setEditingPosition({ ...editingPosition, priceNGN: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Price USD</label>
                <input
                  type="number"
                  value={editingPosition.priceUSD}
                  onChange={(e) => setEditingPosition({ ...editingPosition, priceUSD: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Available Inventory</label>
                <input
                  type="number"
                  value={editingPosition.availableInventory}
                  onChange={(e) => setEditingPosition({ ...editingPosition, availableInventory: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Status</label>
                <select
                  value={editingPosition.status}
                  onChange={(e: any) => setEditingPosition({ ...editingPosition, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                  <option value="REQUESTED">REQUESTED</option>
                  <option value="SOLD">SOLD</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSavePositionEdit}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Save Inventory Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
