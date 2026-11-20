import React from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface UpdateBannerProps {
  onOpenUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({ onOpenUpdate, onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-4 py-2 flex items-center justify-between text-xs font-medium shadow-md">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>Une mise à jour ChantierPro est disponible !</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenUpdate}
          className="px-2.5 py-1 bg-slate-950 text-amber-400 font-bold rounded-lg text-[11px] flex items-center gap-1 hover:bg-slate-900 transition-colors"
        >
          Installer <ArrowRight className="w-3 h-3" />
        </button>
        <button onClick={onDismiss} className="p-1 hover:bg-black/10 rounded">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
