import React from 'react';
import { HelpCircle, X, CheckCircle2, Film, Layers, Sliders, ShieldCheck } from 'lucide-react';
import { FOUNDER_MEMORANDUM_EXCERPTS } from '../data/myflixData';

interface MemoReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoReferenceModal: React.FC<MemoReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    { num: 1, title: 'Business Concept', text: 'Digital marketplace for independent creators to upload, publish and monetise AI films, series, seasons, episodes, sequels, and prequels. V1 Creator ↔ Viewer focus.' },
    { num: 2, title: 'Core Marketplace Flow', text: 'Creator creates & uploads → Platform approves → Viewer pays → 30% Platform cut deducted → Creator receives 70% balance.' },
    { num: 5, title: 'AI Film Marketplace', text: 'Standalone films with title, poster, trailer, description, genre, duration, AI disclosure, and creator pricing.' },
    { num: 6, title: 'AI Series Marketplace', text: 'Series → Seasons → Episodes hierarchy (e.g. The Last Colony S1 Eps 1-4, S2 Eps 1-3).' },
    { num: 7, title: 'Sequels and Prequels', text: 'Connect related films into creator cinematic universes (Film A → Prequel Film B → Sequel Film C).' },
    { num: 8, title: 'Granular Pricing Models', text: 'Individual episode (₹49–₹99), standalone film (₹199–₹399), season pass (₹499–₹999), complete universe (₹1299+).' },
    { num: 9, title: 'Central Commission Engine', text: 'Default 30% commission automatically calculated and recorded in the permanent financial ledger.' },
    { num: 10, title: 'Next-Day Settlement (T+1)', text: 'Day 1 purchase (₹1,000) → Day 2 eligible payout (₹700) subject to refund rules, fraud checks, and chargeback reserves.' },
    { num: 15, title: 'AI Content Declaration', text: 'Creators disclose AI tools and warrant full IP rights for scripts, voices, images, and soundtrack assets.' },
    { num: 18, title: 'Central Commission Engine', text: 'Central commission engine managed dynamically by Admin (30% → 25% → 20%) propagating instantly across platform.' },
    { num: 19, title: 'Administrative Audit Trail', text: 'All policy changes record Admin, Date/Time, Previous Setting, New Setting, and Rationale.' },
    { num: 20, title: 'Future Revenue Expansion', text: 'Creator pro subscriptions, featured placement, promotional campaigns, platform subscriptions, and enterprise licensing.' },
    { num: 21, title: 'Standard Transaction Example', text: '₹299 Film → ₹89.70 (30%) Platform Commission → ₹209.30 (70%) Creator Net Payout permanently recorded in ledger.' },
    { num: 23, title: 'Founder Vision', text: 'Democratise entertainment production. Create a marketplace where anyone can create AI entertainment, sell to audiences, and build a creator business.' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 animate-scaleUp max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">myflixai.com Founder's Memorandum Specifications</h3>
              <p className="text-xs text-slate-400">Architectural & Financial Blueprint Overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable sections list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin text-xs">
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-300">
            <span className="font-bold text-white">Core Thesis: </span>
            {FOUNDER_MEMORANDUM_EXCERPTS.vision}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((sec) => (
              <div key={sec.num} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span className="text-amber-400">Section {sec.num}:</span>
                  <span>{sec.title}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{sec.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
