import React from 'react';
import { Site, Worker, AttendanceRecord, DailyExpense } from '../types';
import { X, Sparkles, Users, Award, Mic, TrendingUp, ChevronRight } from 'lucide-react';

interface AiPerformanceHubProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
  workers: Worker[];
  attendance: AttendanceRecord[];
  expenses: DailyExpense[];
  onOpenRecruitmentGenerator: () => void;
  onOpenWorkforceAudit: () => void;
  onOpenSmartCapture: () => void;
}

export const AiPerformanceHub: React.FC<AiPerformanceHubProps> = ({
  isOpen,
  onClose,
  site,
  workers,
  attendance,
  expenses,
  onOpenRecruitmentGenerator,
  onOpenWorkforceAudit,
  onOpenSmartCapture
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 rounded-xl shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Hub Intelligence Artificielle Chantier</h3>
              <p className="text-xs text-slate-400">Outils d'optimisation et productivité BTP</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {/* Card 1: Team Generator */}
          <div
            onClick={() => {
              onClose();
              onOpenRecruitmentGenerator();
            }}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                  Générateur d'Équipe Idéale
                </h4>
                <p className="text-xs text-slate-400">
                  Composez automatiquement le dimensionnement d'équipe selon la phase (Gros Œuvre, Finition...).
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
          </div>

          {/* Card 2: Workforce Audit */}
          <div
            onClick={() => {
              onClose();
              onOpenWorkforceAudit();
            }}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                  Audit de Matrice de Qualification
                </h4>
                <p className="text-xs text-slate-400">
                  Évaluez la solidité de votre main d'œuvre, décelez les compétences manquantes et sécurisez le chantier.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
          </div>

          {/* Card 3: Voice / Text Smart Capture */}
          <div
            onClick={() => {
              onClose();
              onOpenSmartCapture();
            }}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                  Saisie Vocale & Mémos Express
                </h4>
                <p className="text-xs text-slate-400">
                  Dictez ou collez un mémo : l'IA extrait les tâches achevées, météo et dépenses pour votre journal.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
          </div>
        </div>

        <div className="pt-4 mt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
