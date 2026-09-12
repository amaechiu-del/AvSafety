/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingCart, Trash2, X, Plus, Minus, CheckCircle, ShieldCheck, 
  CreditCard, FileText, ArrowRight, Sparkles, Building, Mail, Phone, Globe, User, MessageSquare
} from 'lucide-react';
import { BookingItem, CommercialOrder } from '../../types';

interface MarketplaceCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BookingItem[];
  currency: 'NGN' | 'USD';
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onToggleSupplyOption: (index: number, option: 'SUPPLIED_BY_CLIENT' | 'PRODUCE_AND_INSTALL') => void;
  onToggleAddon: (itemIndex: number, addon: any) => void;
  onProceedToPaystack: (orderData: Partial<CommercialOrder>) => void;
  onRequestFormalQuote: (quoteData: any) => void;
}

export default function MarketplaceCartModal({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onToggleSupplyOption,
  onToggleAddon,
  onProceedToPaystack,
  onRequestFormalQuote
}: MarketplaceCartModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const currencySymbol = currency === 'USD' ? '$' : '₦';

  // Calculate pricing breakdown
  let subtotal = 0;
  let productionTotal = 0;
  let installationTotal = 0;
  let addonsTotal = 0;

  items.forEach((item) => {
    const qty = item.quantity || 1;
    const basePrice = currency === 'USD' ? (item.unitPriceUSD || 0) : (item.unitPriceNGN || 0);
    subtotal += basePrice * qty;

    if (item.supplyOption === 'PRODUCE_AND_INSTALL') {
      const prodCost = currency === 'USD' ? (item.productionCostUSD || 0) : (item.productionCostNGN || 0);
      const instCost = currency === 'USD' ? (item.installationCostUSD || 0) : (item.installationCostNGN || 0);
      productionTotal += prodCost * qty;
      installationTotal += instCost * qty;
    }
  });

  const grandTotal = subtotal + productionTotal + installationTotal + addonsTotal;

  const validateCustomerDetails = () => {
    if (!companyName.trim() || !contactPerson.trim() || !email.trim() || !phone.trim()) {
      setFormError('Please fill in Company Name, Contact Person, Email, and Phone.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handlePaystackCheckout = () => {
    if (!validateCustomerDetails()) return;
    onProceedToPaystack({
      companyName,
      contactPerson,
      email,
      phone,
      website,
      campaignMessage,
      specialInstructions,
      items,
      currency,
      subtotal,
      productionTotal,
      installationTotal,
      addonsTotal,
      totalAmount: grandTotal,
      paymentMethod: 'PAYSTACK'
    });
  };

  const handleFormalQuote = () => {
    if (!validateCustomerDetails()) return;
    onRequestFormalQuote({
      companyName,
      contactPerson,
      email,
      phone,
      website,
      summary: `Commercial Sponsorship Quotation for ${items.map(i => i.name).join(', ')}`,
      items: items.map(i => ({
        name: i.name,
        description: `Quantity: ${i.quantity}, Supply Mode: ${i.supplyOption}`,
        quantity: i.quantity,
        unitPrice: currency === 'USD' ? i.unitPriceUSD : i.unitPriceNGN,
        productionCost: i.supplyOption === 'PRODUCE_AND_INSTALL' ? (currency === 'USD' ? i.productionCostUSD : i.productionCostNGN) : 0,
        installationCost: i.supplyOption === 'PRODUCE_AND_INSTALL' ? (currency === 'USD' ? i.installationCostUSD : i.installationCostNGN) : 0,
        total: (currency === 'USD' ? i.unitPriceUSD : i.unitPriceNGN) * i.quantity
      })),
      currency,
      totalAmount: grandTotal,
      terms: 'Valid for 14 calendar days. 100% production lead time is 14 days prior to 17 November 2026.'
    });
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl h-full bg-slate-900 border-l border-amber-500/30 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Commercial Sponsorship Booking Cart</h3>
              <p className="text-xs text-slate-400">{items.length} Position(s) Selected • Currency: {currency}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {items.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">Your Sponsorship Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore the Advertising Inventory or Sponsorship Packages to select your visibility touchpoints.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
              >
                Browse Inventory
              </button>
            </div>
          ) : (
            <>
              {/* Selected Positions List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Selected Opportunities & Options:
                </h4>

                {items.map((item, index) => {
                  const unitPrice = currency === 'USD' ? item.unitPriceUSD : item.unitPriceNGN;
                  const itemSubtotal = (unitPrice || 0) * (item.quantity || 1);
                  const prodCost = currency === 'USD' ? (item.productionCostUSD || 0) : (item.productionCostNGN || 0);

                  return (
                    <div key={index} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">
                            {item.category}
                          </span>
                          <h5 className="font-bold text-sm text-white">{item.name}</h5>
                          <span className="text-xs font-mono text-amber-400 block">
                            {currencySymbol}{(unitPrice || 0).toLocaleString()} each
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveItem(index)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity & Supply Toggle */}
                      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        
                        {/* Quantity Controller */}
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 text-[11px]">Units / Slots:</span>
                          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(index, Math.max(1, (item.quantity || 1) - 1))}
                              className="p-1 rounded text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-bold text-white px-2">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(index, (item.quantity || 1) + 1)}
                              className="p-1 rounded text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Production Mode Toggle */}
                        {prodCost > 0 && (
                          <div className="space-y-1">
                            <span className="text-slate-400 text-[11px] block">Production Option:</span>
                            <div className="flex items-center space-x-2">
                              <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-slate-300">
                                <input
                                  type="radio"
                                  name={`supply-${index}`}
                                  checked={item.supplyOption === 'SUPPLIED_BY_CLIENT'}
                                  onChange={() => onToggleSupplyOption(index, 'SUPPLIED_BY_CLIENT')}
                                  className="text-amber-500"
                                />
                                <span>Client supplies artwork</span>
                              </label>
                              <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-amber-300">
                                <input
                                  type="radio"
                                  name={`supply-${index}`}
                                  checked={item.supplyOption === 'PRODUCE_AND_INSTALL'}
                                  onChange={() => onToggleSupplyOption(index, 'PRODUCE_AND_INSTALL')}
                                  className="text-amber-500"
                                />
                                <span>Domislink prints (+{currencySymbol}{prodCost.toLocaleString()})</span>
                              </label>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Customer Contact Information Form */}
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Sponsor / Advertiser Contact Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AeroSat Avionics Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Authorized Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Emeka Nwosu"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="enwosu@aerosat.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Telephone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 802 345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Company Website / Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://aerosat.ng"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Key Campaign Message / Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Pioneering Next-Gen ADS-B Flight Tracking Across West Africa"
                      value={campaignMessage}
                      onChange={(e) => setCampaignMessage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                    {formError}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer Pricing Calculation & Checkout Actions */}
        {items.length > 0 && (
          <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-4">
            
            {/* Price Breakdown */}
            <div className="space-y-1.5 font-mono text-xs text-slate-400 border-b border-slate-800/80 pb-3">
              <div className="flex justify-between">
                <span>Inventory Subtotal:</span>
                <span className="text-slate-200">{currencySymbol}{subtotal.toLocaleString()}</span>
              </div>
              {productionTotal > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Domislink Large-Format Print & Fabrication:</span>
                  <span>+{currencySymbol}{productionTotal.toLocaleString()}</span>
                </div>
              )}
              {installationTotal > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Venue Rigging & Technical Installation:</span>
                  <span>+{currencySymbol}{installationTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-amber-400 pt-1 border-t border-slate-800">
                <span>Grand Total Settlement:</span>
                <span>{currencySymbol}{grandTotal.toLocaleString()} {currency}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handlePaystackCheckout}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg"
              >
                <CreditCard className="w-4 h-4" />
                <span>Instant Paystack Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleFormalQuote}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center space-x-2 transition"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Official Pro-Forma Invoice</span>
              </button>
            </div>

            <div className="text-[10px] text-center text-slate-500">
              Payments processed securely via Paystack. Official receipts and tax invoices issued by Domislink International Services Ltd.
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
