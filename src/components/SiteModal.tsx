import React, { useState } from 'react';
import { Site } from '../types';
import { X, Building2, MapPin, DollarSign, Calendar } from 'lucide-react';

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSite: (site: Site) => void;
  initialSite?: Site | null;
}

export const SiteModal: React.FC<SiteModalProps> = ({
  isOpen,
  onClose,
  onSaveSite,
  initialSite
}) => {
  const [name, setName] = useState(initialSite?.name || '');
  const [client, setClient] = useState(initialSite?.client || '');
  const [address, setAddress] = useState(initialSite?.address || '');
  const [budget, setBudget] = useState<number>(initialSite?.budget || 15000000);
  const [currency, setCurrency] = useState(initialSite?.currency || 'DZD');
  const [startDate, setStartDate] = useState(
    initialSite?.startDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(initialSite?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const site: Site = {
      id: initialSite?.id || `site-${Date.now()}`,
      name: name.trim(),
      client: client.trim(),
      address: address.trim(),
      budget: Number(budget),
      currency: currency.trim() || 'DZD',
      status: initialSite?.status || 'active',
      startDate,
      notes: notes.trim() || undefined
    };

    onSaveSite(site);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">
                {initialSite ? 'Modifier le Chantier' : 'Nouveau Chantier'}
              </h3>
              <p className="text-xs text-slate-400">Paramètres et informations projet BTP</p>
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
            <label className="block text-xs font-medium text-slate-400 mb-1">Nom du chantier</label>
            <input
              type="text"
              placeholder="Ex: Résidence Les Orangers, École Primaire..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Maître d'Ouvrage / Client</label>
              <input
                type="text"
                placeholder="Ex: OPGI, Promotion Immobilière..."
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Devise de gestion</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Localisation / Adresse</label>
            <input
              type="text"
              placeholder="Ex: Bab Ezzouar, Alger"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Budget Total Déclaré</label>
              <input
                type="number"
                min="0"
                step="50000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date d'ouverture</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Observations / Spécifications</label>
            <input
              type="text"
              placeholder="Ex: R+4 avec sous-sol, délai contractuel 12 mois..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md transition-colors"
            >
              {initialSite ? 'Mettre à jour' : 'Créer le chantier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
