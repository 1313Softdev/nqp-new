import React, { useState } from 'react';
import { Flame, ArrowRight, X } from 'lucide-react';

export default function SubscribeCard() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative mt-auto bg-white rounded-3xl p-5 border border-[#F0EDFF] shadow-soft text-center group transition-all duration-200 hover:shadow-hover">
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
        aria-label="Close offer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="w-12 h-12 bg-[#FFF3EC] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
        <Flame className="w-6 h-6 text-[#FF6B00] fill-[#FF6B00]/20" />
      </div>

      <h4 className="text-sm font-bold text-gray-900 leading-snug">
        Subscribe to our<br />new plan <span className="text-[#FF6B00]">$25</span>
      </h4>

      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed px-1">
        It is a limited time offer that will expire soon.
      </p>

      <button className="w-full mt-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg active:scale-95">
        <span>Subscribe now</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
