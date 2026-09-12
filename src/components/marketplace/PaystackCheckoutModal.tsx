/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, CreditCard, Building, Smartphone, CheckCircle, 
  AlertCircle, ArrowRight, RefreshCw, Download, FileText, X, Sparkles, Receipt
} from 'lucide-react';
import { CommercialOrder } from '../../types';

interface PaystackCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CommercialOrder | null;
  onPaymentSuccess: (verifiedOrder: CommercialOrder, receiptNumber: string) => void;
}

export default function PaystackCheckoutModal({
  isOpen,
  onClose,
  order,
  onPaymentSuccess
}: PaystackCheckoutModalProps) {
  const [paymentChannel, setPaymentChannel] = useState<'card' | 'bank' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('4084 0840 8408 4084');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('381');
  const [pin, setPin] = useState('1234');
  const [selectedBank, setSelectedBank] = useState('Access Bank / First Bank / GTBank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successReceipt, setSuccessReceipt] = useState<{ receiptNumber: string; reference: string } | null>(null);

  if (!isOpen || !order) return null;

  const currencySymbol = order.currency === 'USD' ? '$' : '₦';
  const displayAmount = (order.totalAmount || 0).toLocaleString();

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Step 1: Initialize transaction on server
      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: order.email,
          amount: order.totalAmount,
          currency: order.currency || 'NGN',
          orderId: order.id,
          companyName: order.companyName,
          contactPerson: order.contactPerson
        })
      });

      const initData = await initRes.json();
      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize Paystack session');
      }

      const reference = initData.reference;

      // Small delay to simulate secure gateway bank authorization
      await new Promise(r => setTimeout(r, 1200));

      // Step 2: Server-side verification (NEVER trust client alone)
      const verifyRes = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          orderId: order.id,
          amount: order.totalAmount
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success || !verifyData.verified) {
        throw new Error(verifyData.error || 'Payment gateway verification unconfirmed');
      }

      const updatedOrder: CommercialOrder = verifyData.order || {
        ...order,
        paymentStatus: 'VERIFIED_PAID',
        paystackReference: reference,
        orderStatus: 'APPROVED',
        paidAt: new Date().toISOString()
      };

      setSuccessReceipt({
        receiptNumber: verifyData.receiptNumber || `REC-AVS26-${Math.floor(10000 + Math.random() * 90000)}`,
        reference
      });

      onPaymentSuccess(updatedOrder, verifyData.receiptNumber || 'REC-AVS26-CONFIRMED');
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-base tracking-wide">Paystack Secure Checkout</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full font-mono">
                  256-BIT SSL
                </span>
              </div>
              <p className="text-xs text-slate-400">Domislink International Services Ltd Merchant Gateway</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successReceipt ? (
          /* Payment Confirmed State */
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 mx-auto flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Payment Successfully Verified!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your commercial sponsorship booking has been secured and confirmed on the summit ledger.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Receipt Number:</span>
                <span className="text-amber-400 font-bold">{successReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Order Reference:</span>
                <span className="text-slate-200">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Paystack Gateway Ref:</span>
                <span className="text-teal-300 truncate max-w-[200px]">{successReceipt.reference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-bold">{currencySymbol}{displayAmount} {order.currency}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Company / Entity:</span>
                <span className="text-slate-200">{order.companyName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">SETTLED & CONFIRMED</span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left text-xs text-amber-200 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Next Step:</strong> Please visit the <strong>Artwork Desk</strong> in your portal to upload your high-resolution vector logos and campaign artwork for technical approval.
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 border border-slate-700"
              >
                <Download className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition shadow-lg"
              >
                Go to Artwork Desk
              </button>
            </div>
          </div>
        ) : (
          /* Payment Selection & Card Form */
          <div className="p-6 space-y-5">
            {/* Order Summary Pill */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-sans">Total Commercial Settlement</span>
                <span className="text-2xl font-extrabold text-amber-400 font-mono tracking-tight">
                  {currencySymbol}{displayAmount}
                </span>
                <span className="text-xs text-slate-400 ml-1 font-mono">{order.currency}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Order Reference</span>
                <span className="text-xs font-bold text-slate-200 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {order.orderNumber}
                </span>
              </div>
            </div>

            {/* Channels Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 block">
                Select Paystack Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentChannel('card')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    paymentChannel === 'card'
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs font-medium">Debit / Credit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentChannel('bank')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    paymentChannel === 'bank'
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span className="text-xs font-medium">Bank Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentChannel('ussd')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    paymentChannel === 'ussd'
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs font-medium">USSD Code</span>
                </button>
              </div>
            </div>

            {/* Channel Body */}
            {paymentChannel === 'card' && (
              <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Card Number (Visa / Mastercard / Verve)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                    <div className="absolute right-3 top-2 flex items-center space-x-1">
                      <span className="text-[9px] font-bold bg-blue-600/30 text-blue-300 px-1 py-0.5 rounded">VISA</span>
                      <span className="text-[9px] font-bold bg-amber-600/30 text-amber-300 px-1 py-0.5 rounded">MC</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentChannel === 'bank' && (
              <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                <p className="text-slate-400">Direct Paystack Virtual Dedicated Account:</p>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Name:</span>
                    <span className="text-white font-bold">Wema Bank / Titan Trust (Paystack)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Number:</span>
                    <span className="text-amber-400 font-bold tracking-wider">9920 8472 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Beneficiary:</span>
                    <span className="text-white">DOMISLINK / AVIATION SUMMIT 2026</span>
                  </div>
                </div>
                <p className="text-[11px] text-teal-400 flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Transfers to this account are confirmed automatically within 30 seconds.</span>
                </p>
              </div>
            )}

            {paymentChannel === 'ussd' && (
              <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-xs">
                <label className="text-slate-400 block">Select your Bank for USSD String:</label>
                <select 
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option>GTBank (*737*...)</option>
                  <option>Access Bank (*901*...)</option>
                  <option>Zenith Bank (*966*...)</option>
                  <option>First Bank (*894*...)</option>
                  <option>UBA (*919*...)</option>
                </select>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-center font-mono text-amber-400 text-sm font-bold">
                  *737*000*4482#
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Authorize Button */}
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition shadow-lg flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing via Paystack Security...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Payment of {currencySymbol}{displayAmount}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-500">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>PCI-DSS Level 1 Compliant</span>
              </span>
              <span>•</span>
              <span>Central Bank of Nigeria Licensed</span>
              <span>•</span>
              <span>Domislink Certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
