import React, { useState } from 'react';
import { Site, CashAudit } from '../types';
import { X, Scale, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CashAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSite: Site;
  theoreticalBalance: number;
  onSaveAudit: (audit: CashAudit) => void;
}

export const CashAuditModal: React.FC<CashAuditModalProps> = ({
  isOpen,
  onClose,
  currentSite,
  theoreticalBalance,
  onSaveAudit
}) => {
  const [actualBalance, setActualBalance] = useState<number>(theoreticalBalance);
  const [auditorName, setAuditorName] = useState('Chef de Chantier');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const discrepancy = actualBalance - theoreticalBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const audit: CashAudit = {
      id: `audit-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      siteId: currentSite.id,
      theoreticalBalance,
      actualBalance: Number(actualBalance),
      discrepancy,
      auditorName: auditorName.trim(),
      notes: notes.trim() || undefined
    };

    onSaveAudit(audit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Arrêté & Contrôle de Caisse</h3>
              <p className="text-xs text-slate-400">Vérification physique des espèces en coffre</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400">Solde Théorique Calculé</span>
              <span className="text-base font-mono font-bold text-slate-100">
                {theoreticalBalance.toLocaleString()} {currentSite.currency}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              (Total Approvisionnements - Dépenses - Acomptes versés)
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Espèces Comptées en Coffre ({currentSite.currency})
            </label>
            <input
              type="number"
              value={actualBalance}
              onChange={(e) => setActualBalance(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-base text-slate-100 font-mono font-bold focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Discrepancy indicator */}
          <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
            discrepancy === 0
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : discrepancy > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {discrepancy === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Caisse parfaitement équilibrée (Écart: 0)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {discrepancy > 0 ? 'Excédent constaté : +' : 'Déficit constaté : '}
                  {discrepancy.toLocaleString()} {currentSite.currency}
                </span>
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Responsable du comptage</label>
            <input
              type="text"
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Explication / Justificatif éventuel</label>
            <input
              type="text"
              placeholder="Ex: Monnaie en attente, ticket essence non saisi..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
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
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-colors"
            >
              Valider l'Arrêté
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
