import React from 'react';
import { ChevronRight, X, Shield, BookOpen, ScrollText, HeartHandshake, HelpCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Legal() {
  const navigate = useNavigate();

  const legalItems = [
    { 
      id: 'gear-rules',
      label: 'กฎของอุปกรณ์โดยโฮสต์', 
      sublabel: "Host's Gear Rules",
      icon: BookOpen 
    },
    { 
      id: 'member-rules',
      label: 'กฎพื้นฐานสำหรับสมาชิก ShareTrust', 
      sublabel: 'Basic Rules for Members',
      icon: HeartHandshake 
    },
    { 
      id: 'refund-policy',
      label: 'นโยบายการจองและนโยบายการคืนเงิน', 
      sublabel: 'Rebooking & Refund Policy',
      icon: ScrollText 
    },
    { 
      id: 'rental-agreement',
      label: 'ข้อกำหนดและเงื่อนไข', 
      sublabel: 'Terms & Conditions',
      icon: AlertCircle 
    },
    { 
      id: 'privacy-policy',
      label: 'นโยบายความเป็นส่วนตัว', 
      sublabel: 'Privacy Policy',
      icon: Shield 
    },
    { 
      id: 'damage-compensation',
      label: 'การเรียกเก็บค่าชดเชยความเสียหาย', 
      sublabel: 'Damage Compensation Policy',
      icon: HelpCircle 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50">
          <h1 className="text-2xl font-bold text-brand-primary">เงื่อนไขการจอง</h1>
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-brand-primary" />
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {legalItems.map((item, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/policies#${item.id}`)}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-medium text-brand-primary">{item.label}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sublabel}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-accent transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-8 bg-gray-50/50">
          <p className="text-[11px] text-gray-400 leading-relaxed text-center">
            By using ShareTrust, you agree to comply with all community standards and legal protocols. 
            All agreements are digitally encrypted and legally binding.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
