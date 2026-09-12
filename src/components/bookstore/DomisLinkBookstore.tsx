/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, Search, Filter, ShoppingBag, Shield, CheckCircle, 
  ExternalLink, Eye, X, Send, CreditCard, Sparkles, Download, FileText,
  Printer, Smartphone, Award, User, Building2
} from 'lucide-react';
import { INITIAL_DOMISLINK_BOOKS, BookProduct } from '../../data/bookstoreData';

export default function DomisLinkBookstore() {
  const [books, setBooks] = useState<BookProduct[]>(INITIAL_DOMISLINK_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [previewBook, setPreviewBook] = useState<BookProduct | null>(null);
  const [checkoutBook, setCheckoutBook] = useState<BookProduct | null>(null);
  const [checkoutFormat, setCheckoutFormat] = useState<'SOFT_COPY' | 'HARD_COPY'>('SOFT_COPY');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ bookTitle: string; format: string; orderId: string } | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Publications' },
    { id: 'AVIATION_SAFETY', label: 'Aviation Safety' },
    { id: 'AIRLINES', label: 'Airlines & Ops' },
    { id: 'AIRPORTS', label: 'Airports & Infrastructure' },
    { id: 'HUMAN_FACTORS', label: 'Human Factors' },
    { id: 'SIMULATION', label: 'Flight Simulation' },
    { id: 'TECHNOLOGY', label: 'Technology & AI' },
    { id: 'LEADERSHIP', label: 'Leadership & Culture' },
    { id: 'INVESTMENT', label: 'Investment & Finance' },
    { id: 'PASSENGER_SAFETY', label: 'Passenger Trust' },
    { id: 'REGULATION', label: 'Regulation & NSIB' }
  ];

  const filteredBooks = books.filter(b => {
    // Only show published / approved books for public sale
    if (b.status !== 'PUBLISHED' && b.status !== 'APPROVED') return false;

    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesFormat = selectedFormat === 'ALL' || b.format === selectedFormat;

    return matchesSearch && matchesCategory && matchesFormat;
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutBook || !customerName.trim() || !customerEmail.trim()) return;

    setIsProcessingPayment(true);
    // Simulate Paystack verification
    setTimeout(() => {
      setIsProcessingPayment(false);
      const orderId = `DLK-ORD-${Math.floor(100000 + Math.random() * 900000)}`
      setOrderSuccess({
        bookTitle: checkoutBook.title,
        format: checkoutFormat === 'SOFT_COPY' ? 'Digital Soft Copy (Instant PDF/Ebook Access)' : 'Hard Copy (Printed Book - Fulfillment Dispatched)',
        orderId
      });
      setCheckoutBook(null);
    }, 1800);
  };

  const getFormatBadge = (fmt: string) => {
    switch (fmt) {
      case 'SOFT_COPY': return { label: 'Soft Copy (PDF)', icon: Smartphone, color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'HARD_COPY': return { label: 'Hard Copy (Print)', icon: Printer, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'EBOOK': return { label: 'E-Book', icon: BookOpen, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'SPEAKER_HANDBOOK': return { label: 'Speaker Handbook', icon: Award, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default: return { label: 'Summit Publication', icon: FileText, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  return (
    <section id="domislink-bookstore" className="py-24 bg-[#0A192F] text-white relative overflow-hidden border-t border-[#D4AF37]/30">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            <span>DomisLink Bookstore & Knowledge Library</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight uppercase">
            Permanent Aviation Literature
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
          <p className="text-sm sm:text-base text-[#8A99AD] font-light leading-relaxed">
            Turning the Aviation Safety Summit 2026 into a living knowledge repository. Explore peer-reviewed books, speaker handbooks, and regulatory publications.
          </p>
        </div>

        {/* Success Modal / Order Confirmation */}
        {orderSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#071324] border border-[#D4AF37]/50 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-white uppercase">Payment Verified & Order Confirmed</h3>
                <p className="text-xs text-[#8A99AD] font-mono">Order Reference: {orderSuccess.orderId}</p>
              </div>

              <div className="bg-[#0A192F] border border-white/10 rounded-xl p-4 text-left space-y-2 text-xs">
                <p className="text-white font-semibold">{orderSuccess.bookTitle}</p>
                <p className="text-[#D4AF37] font-mono">{orderSuccess.format}</p>
                <p className="text-[#8A99AD]">A confirmation email and download link have been dispatched via Gmail.</p>
              </div>

              <button
                type="button"
                onClick={() => setOrderSuccess(null)}
                className="w-full py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition cursor-pointer"
              >
                Return to Bookstore
              </button>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#071324] border border-[#D4AF37]/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">{previewBook.publisher}</span>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">{previewBook.title}</h3>
                </div>
                <button type="button" onClick={() => setPreviewBook(null)} className="text-white/60 hover:text-white p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37]">Subtitle & Author</h4>
                  <p className="text-sm text-neutral-300 italic">{previewBook.subtitle}</p>
                  <p className="text-xs text-[#8A99AD] mt-1 font-semibold">Author: {previewBook.author}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-1">Description</h4>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">{previewBook.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-2">Table of Contents</h4>
                  <ul className="space-y-1.5 bg-[#0A192F] p-4 rounded-xl border border-white/10 text-xs text-neutral-300 font-mono">
                    {previewBook.tableOfContents.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="text-[#D4AF37]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] mb-1">Sample Preview (Introduction)</h4>
                  <div className="bg-[#0A192F] p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                    "{previewBook.previewSample}"
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewBook(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs rounded-xl"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const b = previewBook;
                    setPreviewBook(null);
                    setCheckoutBook(b);
                  }}
                  className="px-6 py-2.5 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center space-x-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Order Publication (₦4,500 / ₦9,000)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {checkoutBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#071324] border border-[#D4AF37]/50 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-[#D4AF37]" />
                  <h3 className="text-base font-bold font-serif uppercase">Secure Paystack Checkout</h3>
                </div>
                <button type="button" onClick={() => setCheckoutBook(null)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 bg-[#0A192F] p-4 rounded-xl border border-white/10">
                <h4 className="font-serif font-bold text-sm text-white">{checkoutBook.title}</h4>
                <p className="text-xs text-[#8A99AD]">{checkoutBook.author}</p>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1.5">Select Format & Fixed Pricing</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutFormat('SOFT_COPY')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        checkoutFormat === 'SOFT_COPY' ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white' : 'bg-[#0A192F] border-white/15 text-[#8A99AD]'
                      }`}
                    >
                      <span className="block text-xs font-bold">Soft Copy (Digital PDF)</span>
                      <span className="block text-sm font-mono text-[#D4AF37] mt-1">₦4,500</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutFormat('HARD_COPY')}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        checkoutFormat === 'HARD_COPY' ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white' : 'bg-[#0A192F] border-white/15 text-[#8A99AD]'
                      }`}
                    >
                      <span className="block text-xs font-bold">Hard Copy (Printed)</span>
                      <span className="block text-sm font-mono text-[#D4AF37] mt-1">₦9,000</span>
                      <span className="block text-[9px] text-neutral-400 mt-0.5">+ Delivery fee</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Capt. John Doe"
                    className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Email Address (for instant digital delivery) *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="johndoe@airline.com"
                    className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {checkoutFormat === 'HARD_COPY' && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#8A99AD] mb-1">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={e => setCustomerAddress(e.target.value)}
                      placeholder="Enter full delivery address in Lagos / Nigeria"
                      className="w-full px-3.5 py-2 bg-[#0A192F] border border-white/15 rounded-xl text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-[#8A99AD]">
                    Total: <span className="text-[#D4AF37] font-bold font-mono text-base">₦{checkoutFormat === 'SOFT_COPY' ? '4,500' : '9,000'}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="px-6 py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayment ? <Sparkles className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    <span>{isProcessingPayment ? 'Verifying Paystack...' : 'Pay with Paystack'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#8A99AD]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search titles, authors, keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#071324] border border-[#D4AF37]/30 rounded-xl text-xs text-white placeholder-[#8A99AD] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Format Filter */}
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {['ALL', 'SOFT_COPY', 'HARD_COPY', 'EBOOK', 'SUMMIT_PUBLICATION'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase transition cursor-pointer shrink-0 ${
                    selectedFormat === fmt ? 'bg-[#D4AF37] text-[#0A192F] font-bold' : 'bg-[#071324] text-[#8A99AD] hover:text-white border border-white/10'
                  }`}
                >
                  {fmt === 'ALL' ? 'All Formats' : fmt.replace('_', ' ')}
                </button>
              ))}
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id ? 'bg-[#D4AF37] text-[#0A192F] shadow-md' : 'bg-[#071324] text-[#8A99AD] hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookstore Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => {
            const badge = getFormatBadge(book.format);
            const FormatIcon = badge.icon;

            return (
              <div 
                key={book.id} 
                className="bg-[#071324] border border-[#D4AF37]/25 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl hover:border-[#D4AF37]/60 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono border ${badge.color}`}>
                      <FormatIcon className="h-3 w-3" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{book.category.replace('_', ' ')}</span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#8A99AD] italic mt-1 line-clamp-1">{book.subtitle}</p>
                    <p className="text-xs text-neutral-300 font-semibold mt-2">{book.author}</p>
                    <p className="text-[11px] text-[#8A99AD]">{book.publisher}</p>
                  </div>

                  <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-3">
                    {book.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#8A99AD] block">Soft / Hard Copy</span>
                      <span className="text-sm font-mono font-bold text-[#D4AF37]">₦4,500 / ₦9,000</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setPreviewBook(book)}
                        className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCheckoutBook(book)}
                    className="w-full py-3 bg-[#D4AF37] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center justify-center space-x-2 transition cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Order / Buy Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
