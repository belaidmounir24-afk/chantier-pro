import React, { useState } from 'react';
import { Worker, RecruitmentLevel } from '../types';
import { X, Sparkles, Users, Loader2, Check, UserPlus } from 'lucide-react';

interface AiRecruitmentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkers: (newWorkers: Worker[]) => void;
  currency: string;
}

export const AiRecruitmentGeneratorModal: React.FC<AiRecruitmentGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAddWorkers,
  currency
}) => {
  const [projectPhase, setProjectPhase] = useState('Gros Œuvre (Fondations, Poteaux, Dalles)');
  const [targetTeamSize, setTargetTeamSize] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [generatedWorkers, setGeneratedWorkers] = useState<Worker[]>([]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectPhase, targetTeamSize, currency })
      });
      const data = await res.json();
      if (data.workers) {
        setGeneratedWorkers(data.workers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImportAll = () => {
    onAddWorkers(generatedWorkers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Générateur d'Équipe IA Chantier</h3>
              <p className="text-xs text-slate-400">Dimensionnement d'effectif selon la phase BTP</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto my-4 space-y-4 flex-1 pr-1">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Phase du Chantier</label>
            <select
              value={projectPhase}
              onChange={(e) => setProjectPhase(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Gros Œuvre (Fondations, Poteaux, Dalles)">Gros Œuvre (Fondations, Poteaux, Dalles)</option>
              <option value="Maçonnerie & Cloisonnement">Maçonnerie & Cloisonnement</option>
              <option value="Second Œuvre (Électricité, Plomberie, Plâtre)">Second Œuvre (Électricité, Plomberie, Plâtre)</option>
              <option value="Revêtement & Finition (Carrelage, Peinture)">Revêtement & Finition (Carrelage, Peinture)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Taille d'équipe souhaitée</label>
            <input
              type="number"
              min="2"
              max="15"
              value={targetTeamSize}
              onChange={(e) => setTargetTeamSize(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Génération de l'équipe BTP..." : 'Générer la composition idéale'}
          </button>

          {generatedWorkers.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Profils Recommandés ({generatedWorkers.length}) :
              </h4>
              <div className="space-y-2">
                {generatedWorkers.map((w, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{w.name}</p>
                      <p className="text-amber-400 font-medium">{w.craft} • {w.recruitmentLevel}</p>
                      <p className="text-slate-400">{w.experienceYears} ans d'expérience</p>
                    </div>
                    <span className="font-mono font-bold text-slate-200">{w.rate.toLocaleString()} {currency}/j</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
          >
            Annuler
          </button>
          {generatedWorkers.length > 0 && (
            <button
              onClick={handleImportAll}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Intégrer les {generatedWorkers.length} ouvriers
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
