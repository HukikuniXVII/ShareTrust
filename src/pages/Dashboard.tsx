import React from 'react';
import { LayoutDashboard, ReceiptText, Clock, Bell, Settings, Package, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_GEAR } from '../constants/mockData';
import { cn } from '../lib/utils';
import { RentalStatus } from '../types';

export default function Dashboard() {
  const stats = [
    { label: 'Active Rentals', value: '3', icon: Package, color: 'text-brand-accent' },
    { label: 'Pending Requests', value: '2', icon: Clock, color: 'text-trust-gold' },
    { label: 'Total Earnings', value: '$420', icon: ReceiptText, color: 'text-trust-green' },
  ];

  const recentActivity = [
    { type: 'rental_request', item: 'Sony A7IV', user: 'Sarah J.', status: 'Pending', date: '2 hours ago', price: '$90' },
    { type: 'rental_complete', item: 'DeWalt Drill', user: 'Mike R.', status: 'Completed', date: 'Yesterday', price: '$30' },
  ];

  return (
    <div className="space-y-8">
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
