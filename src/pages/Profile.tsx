import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Calendar, BadgeCheck, MessageCircle, Share2, Award, UserPlus, Fingerprint, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { User, GearItem } from '../types';
import IdentityVerificationModal from '../components/IdentityVerificationModal';

export default function Profile() {
  const { id } = useParams();
  const [showVerification, setShowVerification] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userGear, setUserGear] = useState<GearItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = id || 'u1';
    Promise.all([api.getUser(userId), api.getGearItems()])
      .then(([fetchedUser, allGear]) => {
        setUser(fetchedUser);
        setUserGear(allGear.filter(g => g.ownerId === fetchedUser.id));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  // For demo: show verification section only on "my" profile (u1)
  const isMyProfile = !id || id === 'u1';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-20">User not found</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar - User Info */}
      <aside className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-brand-accent/5 -z-0" />
          
          <div className="relative z-10 pt-4">
            <div className="relative inline-block">
              <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-lg mx-auto" />
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-trust-green text-white p-1.5 rounded-xl border-4 border-white shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-2">
              <h1 className="text-2xl font-bold text-brand-primary">{user.name}</h1>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
                <span className="text-gray-200">|</span>
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl font-black text-brand-primary">{user.trustScore}%</div>
                <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Trust Score</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <div className="text-2xl font-black text-brand-primary">{userGear.length}</div>
                <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Items</div>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <button className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-brand-primary/10">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Verification</h2>
          <div className="space-y-3">
            {[
              { label: 'Identity Verified', icon: BadgeCheck, status: user.isVerified ? 'verified' : 'pending' },
              { label: 'Neighbor Reference', icon: Award, status: 'verified' },
              { label: 'Criminal Records', icon: ShieldCheck, status: 'verified' },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  v.status === 'verified' ? "bg-trust-green/10 text-trust-green" : "bg-gray-100 text-gray-400"
                )}>
                  <v.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{v.label}</span>
                <span className={cn(
                  "ml-auto text-[10px] font-bold uppercase",
                  v.status === 'verified' ? "text-trust-green" : "text-gray-400"
                )}>
                  {v.status === 'verified' ? "Clear" : "Pending"}
                </span>
              </div>
            ))}
          </div>
          
          {isMyProfile && !user.isVerified && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowVerification(true)}
              className="w-full mt-4 p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-accent text-white flex items-center justify-center shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-brand-primary uppercase tracking-wider">Verify Identity</p>
                <p className="text-[10px] text-brand-accent font-bold">Secure your account now</p>
              </div>
            </motion.button>
          )}
        </div>
      </aside>

      <IdentityVerificationModal 
        isOpen={showVerification} 
        onClose={() => setShowVerification(false)}
        onComplete={() => {
          if (user) {
            user.isVerified = true;
          }
        }}
      />

      {/* Main Content */}
      <main className="lg:col-span-2 space-y-8">
        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4">About</h2>
          <p className="text-gray-600 leading-relaxed">
            {user.bio}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {user.badges.map(badge => (
              <span key={badge} className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
                {badge}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Gear Available ({userGear.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userGear.map(item => (
              <Link to={`/item/${item.id}`} key={item.id} className="block">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-brand-primary leading-tight line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-1 text-trust-gold mt-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">{item.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm font-black text-brand-accent">
                      ${item.pricePerDay}<span className="text-[10px] font-normal text-gray-400">/day</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
