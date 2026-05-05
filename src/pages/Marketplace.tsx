import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Category, RentalStatus, GearItem, User } from '../types';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [gear, setGear] = useState<GearItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getGearItems(), api.getUsers()])
      .then(([gearData, usersData]) => {
        setGear(gearData);
        setUsers(usersData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['All', ...Object.values(Category)];

  const filteredGear = gear.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary">
          Borrow gear from neighbors you <span className="text-brand-accent">trust</span>.
        </h1>
        <p className="text-gray-500 text-lg">
          High-quality photography gear, tools, and outdoor equipment—just around the corner.
        </p>
      </section>

      {/* Search and Filter */}
      <div className="sticky top-16 bg-gray-50/80 backdrop-blur-md pt-2 pb-4 z-40 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
            <input 
              type="text"
              placeholder="Search for cameras, drills, tents..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/10" 
                  : "bg-white text-gray-500 border border-gray-100 hover:border-brand-accent/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGear.map((item, index) => {
          const owner = users.find(u => u.id === item.ownerId);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <Link to={`/item/${item.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.images[0]} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold shadow-sm">
                    ${item.pricePerDay}/day
                  </div>
                  {item.status === RentalStatus.RENTED && (
                    <div className="absolute inset-0 bg-brand-primary/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-white px-4 py-2 rounded-full text-sm font-bold text-brand-primary">Currently Rented</span>
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <Link to={`/item/${item.id}`} className="block">
                    <h3 className="font-display font-bold text-lg leading-tight group-hover:text-brand-accent transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <Link to={`/profile/${owner?.id}`} className="flex items-center gap-2 group/owner">
                    <img src={owner?.avatar} alt={owner?.name} className="w-6 h-6 rounded-full object-cover border border-gray-100" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700 group-hover/owner:text-brand-accent transition-colors">{owner?.name}</span>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-trust-green" />
                        <span className="text-[10px] text-gray-400 font-medium">Trust Score: {owner?.trustScore}%</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1 text-trust-gold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold">{item.rating}</span>
                    <span className="text-xs text-gray-400 font-normal">({item.reviewCount})</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredGear.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-brand-primary">No gear found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
