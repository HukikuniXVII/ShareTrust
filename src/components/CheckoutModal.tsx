import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Fingerprint, CheckCircle2, Camera, Lock, ShieldAlert, CreditCard, Wallet, ExternalLink, Loader2, ShieldCheck, MessageSquare, Calendar, PenTool, FileSignature, Shield, UserCheck, Plus, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { GearItem } from '../types';
import { MOCK_USERS } from '../constants/mockData';
import { Link, useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GearItem;
}

const SignaturePad = ({ onComplete }: { onComplete: (signature: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Draw Signature</label>
        <button onClick={clear} className="text-[10px] font-bold text-brand-accent hover:underline">Clear</button>
      </div>
      <div className="relative aspect-[3/1] bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-full"
          onMouseDown={startDrawing as any}
          onMouseMove={draw as any}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing as any}
          onTouchMove={draw as any}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <PenTool className="w-5 h-5 mr-2" />
            <span className="text-xs font-medium">Sign here</span>
          </div>
        )}
      </div>
      <button 
        disabled={!hasSignature}
        onClick={() => onComplete('signed')}
        className={cn(
          "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
          hasSignature ? "bg-brand-primary text-white shadow-lg" : "bg-gray-100 text-gray-300 cursor-not-allowed"
        )}
      >
        <FileSignature className="w-4 h-4" />
        Complete Digital Signing
      </button>
    </div>
  );
};

export default function CheckoutModal({ isOpen, onClose, item }: CheckoutModalProps) {
  const [step, setStep] = React.useState<'summary' | 'verifying' | 'signing' | 'success'>('summary');
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const currentUser = MOCK_USERS[0]; // Assuming Sarah Jenkins is the logged-in user
  const isVerified = currentUser.isVerified;

  const rentalDays = 3;
  const rentalFee = item.pricePerDay * rentalDays;
  const trustFee = 15.00;
  const taxes = rentalFee * 0.08;
  const totalAmount = rentalFee + trustFee + taxes;
  const holdAmount = 1200.00; // Mocked high value for pre-auth

  const handleStartVerification = () => {
    setStep('verifying');
    // Simulate verification delay
    setTimeout(() => {
      setStep('signing');
    }, 2500);
  };

  const handleSigningComplete = () => {
    setStep('success');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 'success' ? onClose : undefined}
            className="absolute inset-0 bg-brand-primary/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden z-[110]"
          >
            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-xl font-bold text-brand-primary">
                {step === 'success' ? 'Booking Confirmed' : step === 'signing' ? 'E-Contract Signing' : 'Secure Checkout'}
              </h2>
              {step !== 'verifying' && (
                <button 
                  onClick={onClose}
                  className="text-sm font-bold text-gray-400 hover:text-brand-primary transition-colors mt-0.5"
                >
                  {step === 'success' ? 'Close' : 'Cancel'}
                </button>
              )}
            </div>

            <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {step === 'summary' && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {!isVerified ? (
                      /* Locked State - Verification Required */
                      <div className="bg-red-50 rounded-3xl p-8 border border-red-100 space-y-6 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-[32px] flex items-center justify-center mx-auto text-red-600 mb-2">
                          <AlertCircle className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-brand-primary">Identity Not Verified</h3>
                          <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                            To ensure neighborhood safety, you must complete the identity verification in your profile before renting gear.
                          </p>
                        </div>
                        <div className="space-y-3 pt-2">
                          <button 
                            onClick={() => {
                              onClose();
                              navigate('/profile');
                            }}
                            className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20"
                          >
                            Go to Profile to Verify
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Takes less than 2 minutes</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Verification Required Banner (Now showing as Verified) */}
                        <div className="bg-trust-green/5 rounded-2xl p-6 border border-trust-green/10 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-trust-green flex items-center justify-center text-white shrink-0 shadow-lg shadow-trust-green/20">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                              <h3 className="font-bold text-brand-primary">Identity Securely Verified</h3>
                              <p className="text-xs text-trust-green font-bold uppercase tracking-wider">Multi-Step Clear</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-3">
                            <Lock className="w-3.5 h-3.5 text-trust-green" />
                            Bank-grade identity matching active for this transaction.
                          </div>
                        </div>
                      </>
                    )}

                    {/* Payment Breakdown */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.1em]">Payment Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 font-medium tracking-tight">Rental Fee ({rentalDays} days)</span>
                          <span className="text-sm font-black text-brand-primary">${rentalFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 font-medium tracking-tight">Trust & Safety Fee (Includes Insurance)</span>
                          <span className="text-sm font-black text-brand-primary">${trustFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 font-medium tracking-tight">Taxes</span>
                          <span className="text-sm font-black text-brand-primary">${taxes.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-base font-bold text-brand-primary">Total Amount</span>
                        <span className="text-xl font-black text-brand-primary">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Pre-auth Banner */}
                    <div className="bg-[#0F172A] rounded-2xl p-4 flex items-start gap-4">
                      <div className="shrink-0 mt-0.5">
                        <ShieldAlert className="w-5 h-5 text-trust-gold" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">Pre-authorization Hold</h5>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          To prevent theft, the full value of this item <span className="text-white font-bold">(${holdAmount.toLocaleString()})</span> will be held on your card during the rental period.
                        </p>
                      </div>
                    </div>

                    {/* Deposit Method */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.1em]">Security Deposit Method</h4>
                      <div className="flex gap-4">
                        <button className="flex-1 px-4 py-3 bg-[#F8FAFF] border-2 border-brand-accent rounded-xl flex items-center justify-center gap-2 text-brand-accent transition-all ring-4 ring-brand-accent/5">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-xs font-bold">Credit Card Hold</span>
                        </button>
                        <button className="flex-1 px-4 py-3 bg-white border border-gray-100 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:text-brand-primary transition-all">
                          <Wallet className="w-4 h-4" />
                          <span className="text-[11px] font-bold">Cash/Transfer</span>
                        </button>
                      </div>
                    </div>

                    {/* Rental Agreement & Key Terms */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.1em]">Rental Agreement & Key Terms</h4>
                      <div className="space-y-3">
                        {[
                          { 
                            title: 'Criminal Liability (Theft)', 
                            desc: 'Failure to return the item, or attempting to sell or pawn it, constitutes criminal theft and will result in immediate legal prosecution.' 
                          },
                          { 
                            title: 'Late Penalty', 
                            desc: 'Returning items past the agreed schedule will incur penalty fees at the host\'s stated hourly/daily rate.' 
                          },
                          { 
                            title: 'Damage & Loss', 
                            desc: 'You are fully financially responsible for any repair or full replacement costs for damage beyond normal wear and tear.' 
                          },
                        ].map((term, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-brand-primary">{term.title}</p>
                              <p className="text-[11px] text-gray-500 leading-relaxed">{term.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Privacy Consent */}
                    <div className="space-y-4 pt-2">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.1em]">Privacy Consent (PDPA/GDPR)</h4>
                      <label className="flex items-start gap-3 cursor-pointer group bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-brand-accent/20 transition-all">
                        <div className="relative mt-0.5">
                          <input 
                            type="checkbox" 
                            className="peer sr-only" 
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                          />
                          <div className={cn(
                            "w-5 h-5 border-2 rounded-md transition-all",
                            isAgreed ? "bg-brand-accent border-brand-accent" : "border-gray-200 bg-white"
                          )} />
                          <CheckCircle2 className={cn(
                            "absolute inset-0 w-3 h-3 m-auto text-white transition-opacity",
                            isAgreed ? "opacity-100" : "opacity-0"
                          )} />
                        </div>
                        <span className="text-[11px] text-gray-500 leading-relaxed">
                          I agree to the <a href="/legal" target="_blank" className="text-brand-accent font-bold underline cursor-pointer">Digital Rental Agreement</a> and consent to the secure collection of my <span className="font-bold text-brand-primary">Government ID</span> and <span className="font-bold text-brand-primary">facial biometric data</span> for identity verification.
                        </span>
                      </label>
                    </div>

                    {/* Action */}
                    {isVerified && (
                      <button 
                        onClick={handleStartVerification}
                        disabled={!isAgreed}
                        className={cn(
                          "w-full py-5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3",
                          isAgreed 
                            ? "bg-brand-primary text-white hover:bg-opacity-95 shadow-xl shadow-brand-primary/20 active:scale-[0.98]" 
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        Sign Digital Agreement & Book
                      </button>
                    )}
                  </motion.div>
                )}

                {step === 'verifying' && (
                  <motion.div
                    key="verifying"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-8"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: 360 
                        }}
                        transition={{ 
                          scale: { duration: 2, repeat: Infinity },
                          rotate: { duration: 10, repeat: Infinity, ease: "linear" }
                        }}
                        className="w-32 h-32 rounded-full border-4 border-brand-accent/10 border-t-brand-accent relative z-10"
                      />
                      <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-x-0 h-1 bg-brand-accent shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
                      />
                      <Fingerprint className="w-12 h-12 text-brand-accent absolute inset-0 m-auto animate-pulse" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-brand-primary">Authenticating Identity</h3>
                      <p className="text-sm text-gray-400 max-w-[240px] mx-auto">
                        Connecting to secure e-KYC network to verify biometric signatures...
                      </p>
                    </div>

                    <div className="w-full max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="h-full bg-brand-accent"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 'signing' && (
                  <motion.div
                    key="signing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white">
                          <FileSignature className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-brand-primary">Digital Rental Contract</h3>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Contract #ST-{Date.now().toString().slice(-6)}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-gray-100 max-h-[200px] overflow-y-auto text-[11px] leading-relaxed text-gray-500 space-y-4 font-mono">
                        <p className="font-bold text-brand-primary uppercase">E-Rental Agreement</p>
                        <p>This Electronic Rental Agreement ("Contract") is entered into by the Renter and the Lender ("Parties") via ShareTrust Platform. By signing digitally, the Renter acknowledges full legal liability for the item: <span className="font-bold text-brand-accent">{item.name}</span>.</p>
                        <p><span className="font-bold">LIABILITY:</span> Renter assumes all risk of loss, theft, damage, or destruction of the Gear. Any damage beyond normal wear and tear will result in charges for repair or full replacement cost based on market value.</p>
                        <p><span className="font-bold">CRIMINAL INTENT:</span> Intentional failure to return the item or unauthorized disposal thereof constitutes THEFT under applicable criminal statutes. ShareTrust is authorized to provide biometric and ID verification data to legal authorities immediately upon default.</p>
                        <p><span className="font-bold">E-KYC CONSENT:</span> The fingerprint and facial verification data provided in the previous step are hereby tied to this digital signature for non-repudiation purposes.</p>
                      </div>
                    </div>

                    <SignaturePad onComplete={handleSigningComplete} />

                    <div className="flex items-center gap-2 px-2">
                      <Shield className="w-3 h-3 text-trust-green" />
                      <span className="text-[10px] text-gray-400 font-medium">Legally binding via UETA & E-SIGN Act standards</span>
                    </div>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-6 space-y-8 text-center"
                  >
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-full bg-trust-green/10 flex items-center justify-center text-trust-green mx-auto">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute -bottom-2 -right-2 bg-white rounded-xl p-2 shadow-lg border border-gray-50"
                      >
                        <ShieldCheck className="w-6 h-6 text-trust-green" />
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-brand-primary">Booking Confirmed!</h3>
                      <p className="text-sm text-gray-500">
                        Identity verified & contract signed. The neighbor in <span className="font-bold text-brand-accent">{item.neighborhood}</span> has been notified.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-6 text-left space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-1">
                        <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">E-Contract Details</h4>
                        <span className="text-[10px] font-bold text-trust-green bg-trust-green/10 px-2 py-0.5 rounded-full">Signed & Encrypted</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { icon: MessageSquare, title: 'Chat with Owner', desc: 'Coordinate the pickup location and time.' },
                          { icon: Calendar, title: 'Check In', desc: 'Confirm gear condition upon pickup in the app.' },
                        ].map((step, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-primary shadow-sm">
                              <step.icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-brand-primary">{step.title}</p>
                              <p className="text-[10px] text-gray-400">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={onClose}
                        className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20"
                      >
                        Go to Messages
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
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
