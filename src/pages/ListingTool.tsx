import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Link as LinkIcon, Plus, X, Loader2, Sparkles, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { cn } from '../lib/utils';
import { Category } from '../types';
import { api } from '../lib/api';

export default function ListingTool() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [step, setStep] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: Category.OTHER,
    pricePerDay: 0,
    images: [] as string[],
    location: '',
    neighborhood: ''
  });

  const extractImages = async () => {
    if (!htmlInput.trim()) return;
    setIsExtracting(true);
    
    try {
      const response = await fetch('/api/extract-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlInput })
      });
      
      const data = await response.json();
      if (data.images && data.images.length > 0) {
        setExtractedImages(data.images);
        setStep(2);
      } else {
        throw new Error("No images found");
      }
    } catch (error) {
      console.error("Extraction error:", error);
      // Fallback: simple Regex
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      const matches = [...htmlInput.matchAll(imgRegex)].map(m => m[1]);
      const validMatches = matches.filter(url => url.startsWith('http'));
      setExtractedImages(validMatches.length > 0 ? validMatches : []);
      if (validMatches.length > 0) setStep(2);
    } finally {
      setIsExtracting(false);
    }
  };

  const toggleImageSelection = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.includes(url) 
        ? prev.images.filter(i => i !== url) 
        : [...prev.images, url]
    }));
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const newItem = await api.createGearItem({...formData, tags: []}, token);
      navigate(`/item/${newItem.id}`);
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-brand-primary">List your gear</h1>
        <p className="text-gray-500">Share your tools with the community and earn while they're not in use.</p>
      </header>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              step === s ? "bg-brand-accent text-white scale-110" : step > s ? "bg-trust-green text-white" : "bg-gray-200 text-gray-500"
            )}>
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={cn("w-12 h-1 h-1 bg-gray-100 rounded-full overflow-hidden", step > s && "bg-trust-green/20")}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: step > s ? '100%' : '0%' }}
                className="h-full bg-trust-green"
              />
            </div>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Import Images</h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/10 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                    <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">AI Powered</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Paste the HTML source or a product URL from where you bought the gear. We'll automatically find the best photos for your listing.
                </p>
                <div className="space-y-2">
                  <textarea 
                    placeholder="Paste HTML source code here..."
                    className="w-full h-48 p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-mono text-xs transition-all"
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                  />
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <AlertCircle className="w-3 h-3" />
                    <span>Works best with Amazon, B&H, or official brand site HTML.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={extractImages}
                  disabled={isExtracting || !htmlInput.trim()}
                  className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-primary/10"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Extracting Gear Photos...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Find My Gear Photos</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-3 text-gray-400 text-sm font-medium hover:text-brand-primary transition-colors"
                >
                  Skip and upload manually
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Select Gear Photos</h2>
                <p className="text-sm text-gray-500">
                  Pick the images that best represent your item. You can select multiple.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {extractedImages.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => toggleImageSelection(url)}
                      className={cn(
                        "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group",
                        formData.images.includes(url) ? "border-brand-accent ring-4 ring-brand-accent/10" : "border-gray-50"
                      )}
                    >
                      <img src={url} alt="Extracted" className="w-full h-full object-cover" />
                      <div className={cn(
                        "absolute inset-0 flex items-center justify-center transition-opacity",
                        formData.images.includes(url) ? "bg-brand-accent/20 opacity-100" : "opacity-0 group-hover:opacity-100 bg-black/10"
                      )}>
                        {formData.images.includes(url) ? (
                          <div className="bg-white rounded-full p-1 shadow-md">
                            <CheckCircle2 className="w-5 h-5 text-brand-accent" />
                          </div>
                        ) : (
                          <Plus className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                  
                  <button className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand-accent hover:text-brand-accent transition-all">
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Upload</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-50 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-[2] py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 shadow-lg shadow-brand-primary/10 transition-all"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
             <motion.div
             key="step3"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="space-y-6"
           >
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Item Details</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Item Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Sony A7IV Camera Body"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Category</label>
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as Category})}
                      >
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Price/Day ($)</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                        value={formData.pricePerDay || ''}
                        onChange={e => setFormData({...formData, pricePerDay: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Pickup Neighborhood</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Williamsburg"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                        value={formData.neighborhood}
                        onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">City, State</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Brooklyn, NY"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Description</label>
                    <textarea 
                      placeholder="Tell neighbors about your gear, condition, and what's included..."
                      className="w-full h-32 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-gray-50 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex-[2] py-4 bg-brand-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 shadow-lg shadow-brand-accent/20 transition-all disabled:opacity-50"
                >
                  {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Listing"}
                </button>
              </div>
           </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
