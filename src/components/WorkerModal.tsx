import React, { useState } from 'react';
import { Worker, RecruitmentLevel, RateType } from '../types';
import { X, User, Phone, Briefcase, Users, DollarSign, Award } from 'lucide-react';

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWorker: (worker: Worker) => void;
  initialWorker?: Worker | null;
  currency: string;
}

const RECRUITMENT_LEVELS: RecruitmentLevel[] = [
  "Niveau 1 — Manœuvre / Débutant",
  "Niveau 2 — Ouvrier Professionnel (OP1)",
  "Niveau 3 — Compagnon Professionnel (OP2)",
  "Niveau 4 — Maître Ouvrier / Chef d'Équipe"
];

export const WorkerModal: React.FC<WorkerModalProps> = ({
  isOpen,
  onClose,
  onSaveWorker,
  initialWorker,
  currency
}) => {
  const [name, setName] = useState(initialWorker?.name || '');
  const [craft, setCraft] = useState(initialWorker?.craft || 'Maçon Coffreur');
  const [team, setTeam] = useState(initialWorker?.team || 'Équipe A — Gros Œuvre');
  const [recruitmentLevel, setRecruitmentLevel] = useState<RecruitmentLevel>(
    initialWorker?.recruitmentLevel || "Niveau 2 — Ouvrier Professionnel (OP1)"
  );
  const [experienceYears, setExperienceYears] = useState(initialWorker?.experienceYears || 5);
  const [phone, setPhone] = useState(initialWorker?.phone || '');
  const [cin, setCin] = useState(initialWorker?.cin || '');
  const [rate, setRate] = useState(initialWorker?.rate || 3000);
  const [rateType, setRateType] = useState<RateType>(initialWorker?.rateType || 'jour');
  const [notes, setNotes] = useState(initialWorker?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const worker: Worker = {
      id: initialWorker?.id || `worker-${Date.now()}`,
      name: name.trim(),
      craft: craft.trim(),
      team: team.trim(),
      recruitmentLevel,
      experienceYears: Number(experienceYears),
      phone: phone.trim(),
      cin: cin.trim(),
      rate: Number(rate),
      rateType,
      notes: notes.trim(),
      active: true
    };

    onSaveWorker(worker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-base">
            {initialWorker ? 'Modifier la Fiche Ouvrier' : 'Ajouter un Nouvel Ouvrier'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Nom & Prénom *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Karim Mansouri"
              className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Corps d'état / Métier</label>
              <input
                type="text"
                value={craft}
                onChange={(e) => setCraft(e.target.value)}
                placeholder="Ex: Coffreur, Ferrailleur..."
                className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Équipe Affectée</label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Ex: Équipe A — Gros Œuvre"
                className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Niveau de Qualification / Recrutement</label>
            <select
              value={recruitmentLevel}
              onChange={(e) => setRecruitmentLevel(e.target.value as RecruitmentLevel)}
              className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500"
            >
              {RECRUITMENT_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Taux Journalier ({currency}) *</label>
              <input
                type="number"
                required
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Expérience (Années)</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-bold block mb-1">Téléphone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0550..."
                className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">N° CIN / Pièce d'Identité</label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="N° d'identité"
                className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Remarques ou compétences particulières</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Permis CACES, lecture de plans ferraillage..."
              className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
