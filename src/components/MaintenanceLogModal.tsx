import React, { useState } from 'react';
import { Equipment, MaintenanceRecord, Site } from '../types';
import { X, Wrench, Calendar, DollarSign, UserCheck } from 'lucide-react';

interface MaintenanceLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  currentSite: Site;
  onSaveLog: (log: MaintenanceRecord, nextDueDate: string) => void;
}

export const MaintenanceLogModal: React.FC<MaintenanceLogModalProps> = ({
  isOpen,
  onClose,
  equipment,
  currentSite,
  onSaveLog
}) => {
  const [description, setDescription] = useState('Vidange moteur, changement filtre à huile et gazole');
  const [cost, setCost] = useState<number>(4500);
  const [performedBy, setPerformedBy] = useState('Mécanicien Chantier / Prestataire');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState<string>(
    new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
  );

  if (!isOpen || !equipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const log: MaintenanceRecord = {
      id: `maint-${Date.now()}`,
      equipmentId: equipment.id,
      date,
      description: description.trim(),
      cost: Number(cost),
      performedBy: performedBy.trim(),
      hoursAtMaintenance: equipment.hoursRun || equipment.hoursUsed,
      nextDueDate
    };

    onSaveLog(log, nextDueDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Enregistrer un Entretien</h3>
              <p className="text-xs text-slate-400">{equipment.name}</p>
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
            <label className="block text-xs font-medium text-slate-400 mb-1">Intervention réalisée</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Coût Pièces & M.O ({currentSite.currency})
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Effectué par</label>
              <input
                type="text"
                value={performedBy}
                onChange={(e) => setPerformedBy(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date d'intervention</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Prochaine révision</label>
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
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
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md transition-colors"
            >
              Valider l'intervention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
