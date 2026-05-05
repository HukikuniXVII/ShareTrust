import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Camera, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  ArrowRight,
  Battery,
  Zap,
  Focus,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GearItem, Category } from '../types';

interface HandoverChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  item: GearItem;
  type: 'pickup' | 'return';
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: any;
}

const CATEGORY_CHECKLISTS: Record<Category | string, ChecklistItem[]> = {
  [Category.PHOTOGRAPHY]: [
    { id: 'power', label: 'Power & Battery', description: 'Device turns on and holds charge', icon: Battery },
    { id: 'autofocus', label: 'Autofocus Performance', description: 'Lens focuses quickly and accurately', icon: Focus },
    { id: 'sensor', label: 'Sensor/Lens Clarity', description: 'No scratches, fungus, or dust spots', icon: ImageIcon },
    { id: 'flash', label: 'Flash & Connectivity', description: 'Internal/external flash fires correctly', icon: Zap },
  ],
  [Category.ELECTRONICS]: [
    { id: 'power', label: 'System Boot', description: 'Device powers up to OS successfully', icon: Zap },
    { id: 'screen', label: 'Display Quality', description: 'No dead pixels or screen bleeding', icon: ImageIcon },
    { id: 'ports', label: 'Physical Ports', description: 'Charging and data ports are functional', icon: Battery },
  ],
  'default': [
    { id: 'structure', label: 'Structural Integrity', description: 'No cracks, breaks, or loose parts', icon: ShieldCheck },
    { id: 'clean', label: 'Cleanliness', description: 'Item is clean and ready for use', icon: CheckCircle2 },
    { id: 'parts', label: 'Included Accessories', description: 'All listed accessories are present', icon: CheckCircle2 },
  ]
};

export default function HandoverChecklist({ isOpen, onClose, item, type }: HandoverChecklistProps) {
  const checklist = CATEGORY_CHECKLISTS[item.category] || CATEGORY_CHECKLISTS['default'];
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [step, setStep] = useState<'checklist' | 'photo' | 'confirm'>('checklist');

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isAllChecked = checkedItems.length === checklist.length;

  const handleNext = () => {
    if (step === 'checklist') setStep('photo');
    else if (step === 'photo') setStep('confirm');
  };

  const handleComplete = () => {
    // In a real app, send verification to backend
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-primary/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-black text-brand-primary">Smart Handover</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {type === 'pickup' ? 'Pre-Rental Verification' : 'Return Inspection'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 'checklist' && (
                  <motion.div
                    key="checklist"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-brand-primary">Functional Checklist</h3>
                      <p className="text-xs text-gray-500 font-medium">Please verify the following functions together.</p>
                    </div>

                    <div className="space-y-3">
                      {checklist.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={cn(
                            "w-full p-4 rounded-3xl border-2 transition-all flex items-center gap-4 text-left group",
                            checkedItems.includes(item.id) 
                              ? "border-trust-green bg-trust-green/5" 
                              : "border-gray-50 bg-gray-50 hover:border-gray-200"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0",
                            checkedItems.includes(item.id)
                              ? "bg-trust-green text-white"
                              : "bg-white text-gray-400 group-hover:text-brand-accent shadow-sm"
                          )}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className={cn("text-sm font-black transition-colors", checkedItems.includes(item.id) ? "text-brand-primary" : "text-gray-600")}>
                              {item.label}
                            </p>
                            <p className="text-[11px] text-gray-400 font-bold tracking-tight">{item.description}</p>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                            checkedItems.includes(item.id)
                              ? "bg-trust-green border-trust-green text-white"
                              : "border-gray-200"
                          )}>
                            {checkedItems.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-blue-800 leading-relaxed font-bold">
                        If any item fails functional check, do not proceed with the handover and report the issue immediately.
                      </p>
                    </div>

                    <button
                      disabled={!isAllChecked}
                      onClick={handleNext}
                      className={cn(
                        "w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                        isAllChecked 
                          ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20" 
                          : "bg-gray-100 text-gray-300 cursor-not-allowed"
                      )}
                    >
                      Continue to Photo Proof
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {step === 'photo' && (
                  <motion.div
                    key="photo"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 text-center"
                  >
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-brand-accent/10 rounded-[32px] flex items-center justify-center mx-auto text-brand-accent">
                        <Camera className="w-10 h-10" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-brand-primary">Handover Photo Proof</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed px-8">
                          Take a photo of both parties with the item at the pickup location.
                        </p>
                      </div>
                    </div>

                    <div className="aspect-[4/3] bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 group hover:border-brand-accent/30 transition-all cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 group-hover:text-brand-accent transition-colors">
                        <Camera className="w-8 h-8" />
                      </div>
                      <p className="mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">Tap to Capture</p>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20"
                    >
                      Save & Review Agreement
                    </button>
                  </motion.div>
                )}

                {step === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-8"
                  >
                    <div className="w-24 h-24 bg-trust-green/10 rounded-[40px] flex items-center justify-center mx-auto text-trust-green ring-8 ring-trust-green/5">
                      <ShieldCheck className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-brand-primary">Verification Complete</h3>
                      <p className="text-sm text-gray-500 leading-relaxed px-4">
                        Handover verified. The temporary deposit hold will be managed based on this condition report.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 tracking-wider">
                        <span>Status Summary</span>
                        <span className="text-trust-green">All Passed</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {checklist.map(i => (
                          <div key={i.id} className="flex items-center gap-2 text-[11px] font-bold text-brand-primary bg-white px-3 py-2 rounded-xl border border-gray-100">
                             <CheckCircle2 className="w-3 h-3 text-trust-green" />
                             {i.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleComplete}
                      className="w-full py-5 bg-trust-green text-white rounded-2xl font-black text-sm shadow-xl shadow-trust-green/20 uppercase tracking-widest"
                    >
                      {type === 'pickup' ? 'Unlock Rental Now' : 'Release Security Hold'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
