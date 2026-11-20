import React from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, CheckCircle2 } from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Installer sur Android</h3>
              <p className="text-xs text-slate-400">Application PWA 100% Hors-Ligne</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <p className="font-semibold text-white mb-1">Pour installer ChantierPro comme application native :</p>
            <ol className="list-decimal list-inside space-y-2 mt-2 text-slate-300">
              <li>Ouvrez le menu de Chrome (les 3 points verticaux en haut à droite).</li>
              <li>Appuyez sur <strong className="text-amber-400">« Ajouter à l'écran d'accueil »</strong> ou <strong className="text-amber-400">« Installer l'application »</strong>.</li>
              <li>Validez l'installation : l'icône ChantierPro apparaîtra directement parmi vos applications.</li>
            </ol>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Fonctionnement 100% Hors-Ligne Garanti</p>
              <p className="text-[11px] opacity-90 mt-0.5">
                Sur le chantier sans réseau 4G, vos pointages, acomptes et dépenses restent totalement enregistrés dans votre téléphone.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
