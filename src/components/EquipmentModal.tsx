import React, { useState } from 'react';
import { Equipment, Site } from '../types';
import { X, Wrench, Shield, Calendar, Clock } from 'lucide-react';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSite: Site;
  onSaveEquipment: (equipment: Equipment) => void;
  initialEquipment?: Equipment | null;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isOpen,
  onClose,
  currentSite,
  onSaveEquipment,
  initialEquipment
}) => {
  const [name, setName] = useState(initialEquipment?.name || '');
  const [type, setType] = useState(initialEquipment?.type || 'Bétonnière');
  const [status, setStatus] = useState<Equipment['status']>(initialEquipment?.status || 'operational');
  const [hoursRun, setHoursRun] = useState(initialEquipment?.hoursRun || 120);
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState(
    initialEquipment?.lastMaintenanceDate || new Date().toISOString().split('T')[0]
  );
  const [nextMaintenanceDue, setNextMaintenanceDue] = useState(
    initialEquipment?.nextMaintenanceDue ||
      new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [maintenanceIntervalHours, setMaintenanceIntervalHours] = useState(
    initialEquipment?.maintenanceIntervalHours || 100
  );
  const [assignedDriver, setAssignedDriver] = useState(initialEquipment?.assignedDriver || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const equipment: Equipment = {
      id: initialEquipment?.id || `eq-${Date.now()}`,
      siteId: currentSite.id,
      name: name.trim(),
      type: type.trim(),
      status,
      hoursRun: Number(hoursRun),
      lastMaintenanceDate,
      nextMaintenanceDue,
      maintenanceIntervalHours: Number(maintenanceIntervalHours),
      assignedDriver: assignedDriver.trim() || undefined
    };

    onSaveEquipment(equipment);
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
              <h3 className="font-semibold text-lg text-slate-100">
                {initialEquipment ? "Modifier l'Engin" : "Ajouter un Engin / Matériel"}
              </h3>
              <p className="text-xs text-slate-400">Suivi technique et préventif</p>
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
            <label className="block text-xs font-medium text-slate-400 mb-1">Nom / Référence de l'engin</label>
            <input
              type="text"
              placeholder="Ex: Grue Potain 30T, Bétonnière thermique 350L, Rétrochargeuse JCB..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Type d'engin</label>
              <input
                type="text"
                placeholder="Ex: Grue, Compresseur..."
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">État actuel</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Equipment['status'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="operational">Opérationnel</option>
                <option value="needs_maintenance">Entretien Requis</option>
                <option value="broken">En Panne</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Heures de marche (Compteur)</label>
              <input
                type="number"
                min="0"
                value={hoursRun}
                onChange={(e) => setHoursRun(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Chauffeur / Opérateur</label>
              <input
                type="text"
                placeholder="Ex: Amar K."
                value={assignedDriver}
                onChange={(e) => setAssignedDriver(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Dernière Révision</label>
              <input
                type="date"
                value={lastMaintenanceDate}
                onChange={(e) => setLastMaintenanceDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Prochaine Échéance</label>
              <input
                type="date"
                value={nextMaintenanceDue}
                onChange={(e) => setNextMaintenanceDue(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
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
              {initialEquipment ? 'Mettre à jour' : 'Enregistrer Engin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
