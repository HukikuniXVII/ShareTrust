/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, User, MessageSquare, LayoutDashboard, Compass } from 'lucide-react';
import { cn } from './lib/utils';

// Lazy load components
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const ItemDetail = React.lazy(() => import('./pages/ItemDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ListingTool = React.lazy(() => import('./pages/ListingTool'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Messages = React.lazy(() => import('./pages/Messages'));

function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Explore', icon: Compass },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
          <span className="font-display font-bold text-xl hidden sm:inline">ShareTrust</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                location.pathname === item.path 
                  ? "bg-gray-100 text-brand-primary" 
                  : "text-gray-500 hover:text-brand-primary hover:bg-gray-50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          to="/list-item"
          className="bg-brand-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Share Gear</span>
        </Link>
        <button className="md:hidden p-2 text-gray-500">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full"
            />
          </div>
        }>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/list-item" element={<ListingTool />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/messages" element={<Messages />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

