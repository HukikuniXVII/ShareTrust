/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, User, MessageSquare, LayoutDashboard, Compass, ShieldCheck } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { cn } from './lib/utils';

// Lazy load components
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const ItemDetail = React.lazy(() => import('./pages/ItemDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ListingTool = React.lazy(() => import('./pages/ListingTool'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Messages = React.lazy(() => import('./pages/Messages'));
const Policies = React.lazy(() => import('./pages/Policies'));
const Legal = React.lazy(() => import('./pages/Legal'));

function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Explore', icon: Compass },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/legal', label: 'Safety', icon: ShieldCheck },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-4 md:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-accent/20">S</div>
            <span className="font-display font-bold text-xl hidden sm:inline text-brand-primary">ShareTrust</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                  location.pathname === item.path 
                    ? "bg-brand-accent/10 text-brand-accent" 
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
          <SignedIn>
            <Link 
              to="/list-item"
              className="bg-brand-primary text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-brand-primary/10"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Share Gear</span>
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="bg-brand-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-opacity-90 transition-all cursor-pointer">
              <SignInButton mode="modal" />
            </div>
          </SignedOut>
          <button className="md:hidden p-2 text-gray-500 hover:text-brand-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 h-16 bg-brand-primary/95 backdrop-blur-xl rounded-2xl z-[60] px-6 flex items-center justify-between shadow-2xl shadow-brand-primary/40 border border-white/10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-white scale-110" : "text-gray-400 hover:text-white/80"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
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
        className="pt-20 pb-28 px-4 md:px-8 max-w-7xl mx-auto w-full"
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
              <Route path="/policies" element={<Policies />} />
              <Route path="/legal" element={<Legal />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

