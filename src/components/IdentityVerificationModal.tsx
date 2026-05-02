import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  FileSignature, 
  Camera, 
  UserCheck, 
  Lock, 
  CreditCard, 
  Plus, 
  ShieldAlert,
  Fingerprint,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function IdentityVerificationModal({ isOpen, onClose, onComplete }: IdentityVerificationModalProps) {
  const [step, setStep] = useState<'intro' | 'id-upload' | 'selfie-scan' | 'bank-auth' | 'verifying' | 'success'>('intro');

  const handleStart = () => setStep('id-upload');
  const handleIdUpload = () => setStep('selfie-scan');
  const handleSelfieScan = () => setStep('bank-auth');
  const handleBankAuth = () => {
    setStep('verifying');
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const handleFinalComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
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
                  <h2 className="font-black text-brand-primary">Identity Verification</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bank-Grade Secure Network</p>
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
                {step === 'intro' && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-brand-accent/5 rounded-[32px] flex items-center justify-center mx-auto text-brand-accent">
                        <Fingerprint className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-brand-primary">Security First</h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                          To protect our neighborhood and prevent theft, we require a one-time secure multi-factor identity verification.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { title: 'Government ID', desc: 'Encrypted scan of Passport or ID', icon: FileSignature },
                        { title: 'Biometric Face Mapping', desc: 'Secure live 3D selfie scan', icon: UserCheck },
                        { title: 'Financial Auth', desc: 'Bank record matching', icon: CreditCard },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-accent">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-brand-primary text-sm">{item.title}</p>
                            <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleStart}
                      className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-sm hover:bg-opacity-95 transition-all shadow-xl shadow-brand-primary/20"
                    >
                      Begin Secure Verification
                    </button>
                  </motion.div>
                )}

                {step === 'id-upload' && (
                  <motion.div
                    key="id-upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-brand-primary text-center">Upload ID Card</h3>
                    <div className="aspect-[1.6/1] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-8 bg-gray-50/50 group hover:border-brand-accent/30 transition-all cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400 group-hover:text-brand-accent transition-colors" />
                      <span className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Capture or Upload ID Photo</span>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl flex gap-3 border border-yellow-100">
                      <ShieldAlert className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-yellow-800 leading-relaxed font-bold">
                        Data is processed by bank-grade encrypted systems and never shared with hosts.
                      </p>
                    </div>
                    <button 
                      onClick={handleIdUpload}
                      className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-primary/20"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {step === 'selfie-scan' && (
                  <motion.div
                    key="selfie-scan"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-brand-primary text-center">Live Selfie Match</h3>
                    <div className="aspect-square max-w-[240px] mx-auto relative rounded-full overflow-hidden border-4 border-brand-accent p-1">
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-300" />
                        <div className="absolute inset-0 border-[16px] border-white/50 rounded-full" />
                      </div>
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-brand-accent/50 shadow-[0_0_15px_rgba(255,107,0,0.5)] z-10"
                      />
                    </div>
                    <button 
                      onClick={handleSelfieScan}
                      className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20"
                    >
                      Perform Biometric Scan
                    </button>
                  </motion.div>
                )}

                {step === 'bank-auth' && (
                  <motion.div
                    key="bank-auth"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-brand-primary text-center">Financial Identity Link</h3>
                    <div className="space-y-3">
                      {['Chase Bank', 'Bank of America'].map((bank, i) => (
                        <button key={i} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-brand-accent/20 transition-all text-left">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-brand-accent transition-colors" />
                            <span className="text-sm font-bold text-brand-primary">{bank}</span>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-brand-accent transition-all" />
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={handleBankAuth}
                      className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-xl shadow-brand-primary/20"
                    >
                      Authorize Verification
                    </button>
                  </motion.div>
                )}

                {step === 'verifying' && (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 flex flex-col items-center space-y-6 text-center"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 border-4 border-brand-accent/10 border-t-brand-accent rounded-full"
                      />
                      <Fingerprint className="w-10 h-10 text-brand-accent absolute inset-0 m-auto" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-brand-primary">Securing Network...</h3>
                      <p className="text-sm text-gray-400">Performing local & global identity cross-checks.</p>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-trust-green/10 rounded-[32px] flex items-center justify-center mx-auto text-trust-green">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-brand-primary">Verification Successful</h3>
                      <p className="text-sm text-gray-500">Your identity is now confirmed and secured.</p>
                    </div>
                    <button 
                      onClick={handleFinalComplete}
                      className="w-full py-4 bg-trust-green text-white rounded-2xl font-bold shadow-xl shadow-trust-green/20"
                    >
                      Return to App
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
