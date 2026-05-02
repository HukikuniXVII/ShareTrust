import React, { useEffect } from 'react';
import { ShieldCheck, Scale, FileText, Lock, AlertTriangle, Clock, UserCheck, ShieldAlert, HeartHandshake, BookOpen, ScrollText, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function Policies() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const sections = [
    {
      id: 'gear-rules',
      title: 'Host\'s Gear Rules',
      icon: BookOpen,
      color: 'text-brand-accent',
      bgColor: 'bg-brand-accent/5',
      content: [
        {
          subtitle: 'Maintenance',
          text: 'Hosts must ensure gear is in safe, working condition and clean before handing it over.'
        },
        {
          subtitle: 'Instructions',
          text: 'Usage manuals or verbal demonstrations must be provided for complex equipment.'
        }
      ]
    },
    {
      id: 'member-rules',
      title: 'Basic Rules for Members',
      icon: HeartHandshake,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      content: [
        {
          subtitle: 'Punctuality',
          text: 'Always arrive on time for pick-up and drop-off. Respect your neighbor\'s schedule.'
        },
        {
          subtitle: 'Respect',
          text: 'Treat borrowed gear better than your own. Return it in the same or better condition.'
        }
      ]
    },
    {
      id: 'refund-policy',
      title: 'Rebooking & Refund Policy',
      icon: ScrollText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      content: [
        {
          subtitle: 'Cancellation',
          text: 'Full refund if cancelled 24 hours before pickup. 50% refund if cancelled within 24 hours.'
        },
        {
          subtitle: 'Item Mismatch',
          text: 'If the item is not as described, report it within 2 hours of pickup for a full refund.'
        }
      ]
    },
    {
      id: 'rental-agreement',
      title: 'Digital Rental Agreement',
      icon: FileText,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/5',
      content: [
        {
          subtitle: '1. Criminal Liability (Theft)',
          text: 'Failure to return the rented item by the end of the specified rental period, or any attempt to sell, pawn, or otherwise dispose of the item, constitutes criminal theft. ShareTrust maintains a zero-tolerance policy.'
        },
        {
          subtitle: '2. Electronic Signatures',
          text: 'Every rental on ShareTrust is backed by a digitally signed contract. Our e-signature system complies with the UETA/ESIGN Acts, making agreements legally binding.'
        },
        {
          subtitle: '3. Condition & Inspection',
          text: 'Renters must inspect gear upon pickup. If damage beyond "wear and tear" is found later, the renter is financially responsible.'
        }
      ]
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy (PDPA/GDPR)',
      icon: Lock,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      content: [
        {
          subtitle: 'Data Collection',
          text: 'We collect government ID and biometrics strictly for e-KYC and digital contract enforcement.'
        },
        {
          subtitle: 'Security',
          text: 'All data is encrypted. We never sell your personal information to third parties.'
        }
      ]
    },
    {
      id: 'damage-compensation',
      title: 'Damage Compensation',
      icon: HelpCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      content: [
        {
          subtitle: 'Minor Damage',
          text: 'Repair costs will be deducted from the security deposit based on fair market estimates.'
        },
        {
          subtitle: 'Major Loss',
          text: 'In case of total loss, the renter is liable for the full replacement value of the item.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary text-white rounded-full text-xs font-bold uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          Legal & Safety Center
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-primary">
          Built on <span className="text-brand-accent">Trust</span>, Bound by Law.
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Our policies are designed to protect both lenders and renters, ensuring a safe and reliable sharing economy for your neighborhood.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 md:p-12 space-y-8">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${section.bgColor} flex items-center justify-center ${section.color}`}>
                  <section.icon className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-brand-primary">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.content.map((item, i) => (
                  <div key={i} className="space-y-3">
                    <h3 className="font-bold text-brand-primary flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                      {item.subtitle}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      <footer className="bg-brand-primary rounded-[32px] p-8 md:p-12 text-white text-center space-y-6">
        <Scale className="w-12 h-12 mx-auto text-brand-accent opacity-50" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Have questions about our terms?</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Our legal team is here to help you understand your rights and responsibilities within the ShareTrust community.
          </p>
        </div>
        <button className="px-8 py-4 bg-white text-brand-primary rounded-2xl font-bold hover:bg-gray-100 transition-all">
          Contact Legal Support
        </button>
      </footer>
    </div>
  );
}
