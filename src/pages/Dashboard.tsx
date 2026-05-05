import React, { useState } from 'react';
import { LayoutDashboard, ReceiptText, Clock, Bell, Settings, Package, ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_GEAR } from '../constants/mockData';
import { cn } from '../lib/utils';
import { RentalStatus } from '../types';
import HandoverChecklist from '../components/HandoverChecklist';

export default function Dashboard() {
  const [showHandover, setShowHandover] = useState(false);
  const [selectedGear, setSelectedGear] = useState(MOCK_GEAR[0]);
  const stats = [
    { label: 'Active Rentals', value: '3', icon: Package, color: 'text-brand-accent' },
    { label: 'Pending Requests', value: '2', icon: Clock, color: 'text-trust-gold' },
    { label: 'Total Earnings', value: '$420', icon: ReceiptText, color: 'text-trust-green' },
  ];

  const recentActivity = [
    { type: 'rental_request', item: 'Sony A7IV', user: 'Sarah J.', status: 'Pending', date: '2 hours ago', price: '$90' },
    { type: 'rental_complete', item: 'DeWalt Drill', user: 'Mike R.', status: 'Completed', date: 'Yesterday', price: '$30' },
  ];

  const statStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'w-10 h-10 rounded-xl bg-trust-gold/10 flex items-center justify-center text-trust-gold';
      case 'Completed': return 'w-10 h-10 rounded-xl bg-trust-green/10 flex items-center justify-center text-trust-green';
      default: return 'w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500';
    }
  };

  return (
    <div className="space-y-8 relative">
      <HandoverChecklist 
        isOpen={showHandover} 
        onClose={() => setShowHandover(false)} 
        item={selectedGear} 
        type="pickup"
      />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-brand-primary">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's what's happening with your gear.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-brand-primary transition-all shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-brand-primary transition-all shadow-sm">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Active Handover Panel */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-brand-accent/10" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-brand-primary">Active Handover</h2>
            </div>
            <span className="text-[10px] font-black uppercase text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full animate-pulse">Required</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0">
               <img src={MOCK_GEAR[0].images[0]} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-black text-brand-primary">{MOCK_GEAR[0].name}</h3>
              <p className="text-sm text-gray-500 font-medium">Recipient: <span className="text-brand-primary font-bold">James Wilson</span></p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-trust-green uppercase">
                  <CheckCircle2 className="w-3 h-3" /> Identity Verified
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-accent uppercase">
                  <ShieldCheck className="w-3 h-3" /> $1,200 Held
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedGear(MOCK_GEAR[0]);
                setShowHandover(true);
              }}
              className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Begin Smart Handover
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-brand-primary">{stat.value}</div>
              <div className="text-xs font-bold uppercase text-gray-400 tracking-wider">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button className="text-xs font-bold text-brand-accent uppercase tracking-wider">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-100">
                <div className={statStyle(activity.status)}>
                  {activity.status === 'Pending' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-brand-primary truncate">{activity.item}</h3>
                    <span className="font-bold text-brand-primary">{activity.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">{activity.user} • {activity.date}</span>
                    <span className={`text-[10px] font-bold uppercase ${activity.status === 'Pending' ? 'text-trust-gold' : 'text-trust-green'}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* My Gear Quick View */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">My Gear</h2>
            <button className="text-xs font-bold text-brand-accent uppercase tracking-wider">Manage</button>
          </div>
          <div className="space-y-4">
            {MOCK_GEAR.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-brand-primary text-sm truncate">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      item.status === RentalStatus.AVAILABLE ? "bg-trust-green" : "bg-trust-gold"
                    )} />
                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{item.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-brand-accent">${item.pricePerDay}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function statStyle(status: string) {
  const base = "w-10 h-10 rounded-xl flex items-center justify-center ";
  return status === 'Pending' ? base + "bg-trust-gold/10 text-trust-gold" : base + "bg-trust-green/10 text-trust-green";
}
