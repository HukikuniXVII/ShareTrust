import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, ChevronRight, MessageCircle, Calendar, Timer, Info, CheckCircle2, BadgeCheck, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_GEAR, MOCK_USERS } from '../constants/mockData';
import { cn } from '../lib/utils';
import { RentalStatus } from '../types';
import CheckoutModal from '../components/CheckoutModal';

export default function ItemDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const item = MOCK_GEAR.find(g => g.id === id) || MOCK_GEAR[0];
  const owner = MOCK_USERS.find(u => u.id === item.ownerId);

  // Mocking current user score
  const currentUserRenterScore = 5;

  return (
    <div className="space-y-8">
      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        item={item} 
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 tracking-wider">
        <Link to="/" className="hover:text-brand-accent transition-colors">Marketplace</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-300">{item.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-primary">{item.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <section className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <img 
              src={item.images[selectedImage]} 
              alt={item.name} 
              className="w-full h-full object-contain" // Contain for gear photos often looks better if aspects vary
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {item.images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                  selectedImage === i ? "border-brand-accent ring-4 ring-brand-accent/10" : "border-gray-50 opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Renter Score - Personal Reliability */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-black text-lg">
              {currentUserRenterScore}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-700">Your Renter Score</span>
                <div className="px-1.5 py-0.5 bg-trust-green text-[8px] font-black uppercase text-white rounded">Reliable</div>
              </div>
              <p className="text-[10px] text-gray-400">Based on your community history and gear care.</p>
            </div>
          </div>
        </section>

        {/* Info & Booking */}
        <section className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-[10px] font-bold uppercase tracking-wider rounded-full">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-trust-gold">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{item.rating}</span>
                <span className="text-xs text-gray-400 font-normal">({item.reviewCount} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-brand-primary leading-tight">{item.name}</h1>
            
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{item.location}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-black text-brand-primary">${item.pricePerDay}</span>
                <span className="text-gray-400 ml-1 font-medium">/ day</span>
              </div>
              {item.status === RentalStatus.AVAILABLE ? (
                <div className="flex items-center gap-1 text-trust-green bg-trust-green/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  Available Now
                </div>
              ) : (
                <div className="flex items-center gap-1 text-trust-gold bg-trust-gold/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  <Timer className="w-3 h-3" />
                  {item.status}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Start Date</label>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 hover:bg-gray-100 transition-all">
                  <span>Pick date</span>
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">End Date</label>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 hover:bg-gray-100 transition-all">
                  <span>Pick date</span>
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Security Deposit Notice */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                Security Deposit
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                A <span className="font-bold text-brand-primary">$500 temporary hold</span> will be placed on your card to ensure the gear is returned in good condition. The hold is released immediately after inspection.
              </p>
            </div>

            <button 
              onClick={() => setIsCheckoutOpen(true)}
              disabled={item.status !== RentalStatus.AVAILABLE}
              className={cn(
                "w-full py-4 rounded-2xl font-bold transition-all shadow-xl",
                item.status === RentalStatus.AVAILABLE 
                  ? "bg-brand-primary text-white hover:bg-opacity-90 shadow-brand-primary/20" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              )}
            >
              {item.status === RentalStatus.AVAILABLE ? "Request to Rent" : item.status === RentalStatus.RENTED ? "Currently Rented" : "Unavailable"}
            </button>
            
            <p className="text-center text-[10px] text-gray-400 font-medium">You won't be charged yet. {owner?.name.split(' ')[0]} will review your request.</p>
          </div>

          {/* Owner Summary */}
          <Link to={`/profile/${owner?.id}`} className="block group">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-center gap-4 transition-all group-hover:border-brand-accent/20">
              <div className="relative">
                <img src={owner?.avatar} alt={owner?.name} className="w-14 h-14 rounded-2xl object-cover border border-gray-50 shadow-sm" />
                {owner?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-trust-green text-white p-1 rounded-lg border-2 border-white shadow-sm">
                    <BadgeCheck className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lender Information</p>
                  <span className="px-1.5 py-0.5 bg-trust-green/10 text-trust-green text-[8px] font-black uppercase rounded">Verified Badge</span>
                </div>
                <h3 className="font-bold text-brand-primary group-hover:text-brand-accent transition-colors">{owner?.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-trust-green" />
                  <span className="text-xs font-black text-trust-green">Trust Score: {owner?.trustScore}%</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-brand-accent transition-colors translate-x-0 group-hover:translate-x-1" />
            </div>
          </Link>
        </section>
      </div>

      {/* Description & Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-gray-100">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">About this gear</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Pickup Location</h2>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-primary">{item.neighborhood}</p>
                      <p className="text-xs text-gray-500">{item.location}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-trust-green/10 text-trust-green text-[10px] font-bold uppercase rounded-full">
                    Safe Neighborhood
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Exact pickup address will be shared immediately after {owner?.name.split(' ')[0]} accepts your request. This is typically near {item.neighborhood}.
                </p>
              </div>
              {/* Stylized Map Preview */}
              <div className="h-48 bg-gray-50 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Pulsing indicator for neighborhood radius */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-32 h-32 bg-brand-accent/20 rounded-full border-2 border-brand-accent/10"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-brand-accent rounded-full border-4 border-white shadow-lg shadow-brand-accent/40" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center justify-between shadow-lg">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tight">Pickup zone active</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-trust-green animate-pulse" />
                    <span className="text-[10px] font-bold text-trust-green">Lender Home Office</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Safety & Trust</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-2xl border border-gray-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-trust-green/10 flex items-center justify-center text-trust-green">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-brand-primary">ShareTrust Protection</h3>
                <p className="text-xs text-gray-500">Every rental is covered by our damage protection and neighbor trust guarantee.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-gray-100 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <Timer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-brand-primary">Flexible Returns</h3>
                <p className="text-xs text-gray-500">Coordinate pickup and dropoff times directly with your neighbor through chat.</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary">
              <Info className="w-5 h-5" />
              <h3 className="font-bold">Rental Policy</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5" />
                <span>Pickup location is shared after booking.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5" />
                <span>Cancel for free up to 24h before rental.</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-600">
                <div className="w-1 h-1 rounded-full bg-gray-300 mt-1.5" />
                <span>Renter is responsible for battery recharge/cleaning.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
