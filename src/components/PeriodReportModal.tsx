import React, { useState } from 'react';
import { Site, Worker, AttendanceRecord, Advance, DailyExpense, SiteLog } from '../types';
import { generatePeriodReportPdf } from '../services/periodReportPdfService';
import { X, FileDown, Calendar, AlertCircle } from 'lucide-react';

interface PeriodReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
  workers: Worker[];
  attendance: AttendanceRecord[];
  advances: Advance[];
  expenses: DailyExpense[];
  logs?: SiteLog[];
}

export const PeriodReportModal: React.FC<PeriodReportModalProps> = ({
  isOpen,
  onClose,
  site,
  workers,
  attendance,
  advances,
  expenses,
  logs = []
}) => {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      generatePeriodReportPdf({
        site,
        startDate,
        endDate,
        workers,
        attendance,
        advances,
        expenses,
        logs
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Rapport Périodique PDF</h3>
              <p className="text-xs text-slate-400">Synthèse salaires, pointages et dépenses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            Génération automatique d'un rapport PDF professionnel avec tableau d'émargement et synthèse financière pour le chantier :{' '}
            <strong className="text-white">{site.name}</strong>.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date Début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleGeneratePdf}
              disabled={isGenerating}
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              {isGenerating ? 'Création...' : 'Télécharger PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
