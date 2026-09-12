import React, { useState } from 'react';
import { Send, FileText, CheckCircle2, ChevronRight, Briefcase, Map, Coffee, Users, Zap } from 'lucide-react';

interface CustomServicesDeskProps {
  onRequestQuote: (payload: any) => void;
}

export default function CustomServicesDesk({ onRequestQuote }: CustomServicesDeskProps) {
  const [activeService, setActiveService] = useState('logo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Common contact state
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Service specific state
  const [locationReq, setLocationReq] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [artworkSupplied, setArtworkSupplied] = useState('SUPPLIED');

  const services = [
    { id: 'logo', label: 'Display My Logo', icon: FileText },
    { id: 'physical', label: 'Physical Advertising Space', icon: Briefcase },
    { id: 'airport', label: 'Airport & Route Branding', icon: Map },
    { id: 'foodwater', label: 'Food & Water Partner', icon: Coffee },
    { id: 'staff', label: 'Event Staffing & Uniforms', icon: Users },
    { id: 'activation', label: 'Product Sampling & Exhibition', icon: Zap }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      companyName,
      contactPerson,
      email,
      phone,
      items: [
        {
          name: `Custom Service Request: ${services.find(s => s.id === activeService)?.label}`,
          description: `Location/Type: ${locationReq} | Quantity: ${quantity} | Artwork/Supply: ${artworkSupplied} | Notes: ${message}`
        }
      ]
    };

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    onRequestQuote(payload);
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setSubmitSuccess(false);
      setMessage('');
      setLocationReq('');
    }, 4000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar menu */}
      <div className="w-full lg:w-64 shrink-0 space-y-1">
        {services.map(srv => {
          const Icon = srv.icon;
          return (
            <button
              key={srv.id}
              onClick={() => { setActiveService(srv.id); setSubmitSuccess(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs font-semibold transition-colors ${
                activeService === srv.id 
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{srv.label}</span>
              </div>
              {activeService === srv.id && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        
        <div className="mb-6 pb-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white font-serif tracking-wide">
            {services.find(s => s.id === activeService)?.label}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Submit your specific requirements below. Our commercial team will classify your request and generate a formal quotation for Paystack checkout.
          </p>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-lg font-bold text-emerald-400">Request Submitted Successfully</h4>
            <p className="text-xs text-slate-300">Your custom service request has been logged. An official quotation will be generated shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Dynamic Fields based on active service */}
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-4 mb-6">
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase mb-3">Service Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeService === 'logo' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Display Location</label>
                      <select required value={locationReq} onChange={e => setLocationReq(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                        <option value="">Select location...</option>
                        <option>Website Main Page</option>
                        <option>Sponsor Page</option>
                        <option>Stage Screen / Backdrop</option>
                        <option>Registration Area</option>
                        <option>Lanyard / Badge</option>
                        <option>Programme Booklet</option>
                      </select>
                    </div>
                  </>
                )}

                {activeService === 'physical' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Item Type</label>
                      <select required value={locationReq} onChange={e => setLocationReq(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                        <option value="">Select item...</option>
                        <option>Roll-up Banners</option>
                        <option>Outdoor Flags</option>
                        <option>Branded Booth / Table</option>
                        <option>Backdrop</option>
                        <option>Vehicle Branding</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Production Requirement</label>
                      <select value={artworkSupplied} onChange={e => setArtworkSupplied(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                        <option value="SUPPLIED">I will supply the physical material</option>
                        <option value="DOMISLINK_PRODUCE">I require DomisLink to produce it</option>
                        <option value="PRODUCE_INSTALL">I require BOTH production and installation</option>
                      </select>
                    </div>
                  </>
                )}

                {activeService === 'airport' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location Requested</label>
                      <select required value={locationReq} onChange={e => setLocationReq(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                        <option value="">Select location...</option>
                        <option>Airport Arrival Area (Pending FAAN Approval)</option>
                        <option>Airport Transfer Vehicle</option>
                        <option>Airport to Venue Route</option>
                        <option>Motorway Billboard</option>
                        <option>Hotel Area</option>
                      </select>
                    </div>
                    <div className="col-span-full">
                      <p className="text-[10px] text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        IMPORTANT: Do not represent any airport, motorway, road, hotel or public-space advertising location as available unless it has actually been secured or authorised. Some locations require pending regulatory approval.
                      </p>
                    </div>
                  </>
                )}

                {activeService === 'foodwater' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Catering/Water Option</label>
                      <select required value={locationReq} onChange={e => setLocationReq(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                        <option value="">Select option...</option>
                        <option>Branded Bottled Water</option>
                        <option>VIP Water Station</option>
                        <option>Breakfast Sponsor</option>
                        <option>Lunch Sponsor</option>
                        <option>Coffee / Tea Refreshments</option>
                        <option>Sky Party Catering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantity / Pax</label>
                      <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white" />
                    </div>
                  </>
                )}

                {activeService === 'staff' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Staff Role</label>
                      <select required value={locationReq} onChange={e => setLocationReq(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                        <option value="">Select role...</option>
                        <option>Registration Staff</option>
                        <option>Ushers</option>
                        <option>Brand Promoters</option>
                        <option>Logistics / Technical Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Personnel</label>
                      <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white" />
                    </div>
                    <div className="col-span-full">
                      <p className="text-[10px] text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        IMPORTANT: The system distinguishes event staff from security. DomisLink does not provide security, police, or regulatory personnel. Only authorised authorities can provide official law-enforcement.
                      </p>
                    </div>
                  </>
                )}

                {activeService === 'activation' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Activation Type</label>
                      <select required value={locationReq} onChange={e => setLocationReq(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                        <option value="">Select type...</option>
                        <option>Product Display Booth</option>
                        <option>Product Sampling</option>
                        <option>Interactive Demonstration</option>
                      </select>
                    </div>
                  </>
                )}

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Special Instructions / Requirements</label>
                <textarea rows={2} required value={message} onChange={e => setMessage(e.target.value)} placeholder="Provide specific details about your request..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"></textarea>
              </div>

            </div>

            {/* Standard Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Name</label>
                <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contact Person</label>
                <input required type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition disabled:opacity-50">
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Request...' : 'Submit Request for Formal Quotation'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  )
}
