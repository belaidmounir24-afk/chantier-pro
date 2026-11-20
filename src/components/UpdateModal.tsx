import React from 'react';
import { X, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Mise à jour disponible</h3>
              <p className="text-xs text-slate-400">Nouvelle version de ChantierPro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-300">
          <p>Une nouvelle mise à jour apporte des améliorations de performance et des corrections de bugs :</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Optimisation du pointage rapide d'équipe</li>
            <li>Calcul automatique de la paie nette déduite des acomptes</li>
            <li>Génération accélérée des PV de chantier</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Plus tard
          </button>
          <button
            onClick={onUpdate}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
};
