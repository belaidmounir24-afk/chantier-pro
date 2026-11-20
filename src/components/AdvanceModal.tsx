import React, { useState } from 'react';
import { Worker, Site, Advance } from '../types';
import { X, HandCoins, Calendar, Hash, FileText } from 'lucide-react';

interface AdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workers: Worker[];
  currentSite: Site;
  preselectedWorkerId?: string | null;
  onSaveAdvance: (advance: Advance) => void;
}

export const AdvanceModal: React.FC<AdvanceModalProps> = ({
  isOpen,
  onClose,
  workers,
  currentSite,
  preselectedWorkerId,
  onSaveAdvance
}) => {
  const [workerId, setWorkerId] = useState(preselectedWorkerId || workers[0]?.id || '');
  const [amount, setAmount] = useState<number>(2000);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId || amount <= 0) return;

    const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;

    const newAdvance: Advance = {
      id: `adv-${Date.now()}`,
      workerId,
      siteId: currentSite.id,
      amount: Number(amount),
      date,
      receiptNumber,
      notes: notes.trim()
    };

    onSaveAdvance(newAdvance);
    onClose();
  };

  const selectedWorker = workers.find((w) => w.id === workerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Verser un acompte</h3>
              <p className="text-xs text-slate-400">Paiement d'avance sur salaire</p>
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
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Ouvrier bénéficiaire</label>
            <select
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              required
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.craft} ({w.rate.toLocaleString()} {currentSite.currency}/{w.rateType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Montant ({currentSite.currency})
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-3 pr-16 py-2.5 text-sm text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                {currentSite.currency}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Date du versement</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Motif / Remarque</label>
            <input
              type="text"
              placeholder="Ex: Acompte fin de semaine, urgence médicale..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {selectedWorker && (
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-300">
              <span className="font-semibold text-amber-400">{selectedWorker.name}</span> sera débité de{' '}
              <span className="font-bold text-white">{amount.toLocaleString()} {currentSite.currency}</span> lors du décompte de paie.
            </div>
          )}

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
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md transition-colors"
            >
              Confirmer le versement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
