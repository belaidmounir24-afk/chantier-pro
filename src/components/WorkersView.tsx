import React, { useState } from 'react';
import { Site, Worker, Advance, AttendanceRecord } from '../types';
import { calculateWorkerPeriodStats } from '../utils/calculations';
import { 
  Users, 
  UserPlus, 
  Search, 
  HandCoins, 
  Phone, 
  Award, 
  Edit, 
  Sparkles, 
  Receipt,
  CheckCircle2
} from 'lucide-react';

interface WorkersViewProps {
  site: Site;
  workers: Worker[];
  advances: Advance[];
  attendance: AttendanceRecord[];
  onOpenNewWorkerModal: () => void;
  onEditWorker: (worker: Worker) => void;
  onOpenAdvanceModal: (worker: Worker) => void;
  onOpenReceiptModal: (advance: Advance, worker: Worker) => void;
  onOpenAiGenerator: () => void;
}

export const WorkersView: React.FC<WorkersViewProps> = ({
  site,
  workers,
  advances,
  attendance,
  onOpenNewWorkerModal,
  onEditWorker,
  onOpenAdvanceModal,
  onOpenReceiptModal,
  onOpenAiGenerator
}) => {
  const [search, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Tous');

  const teams = ['Tous', ...Array.from(new Set(workers.map((w) => w.team).filter(Boolean)))];

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.craft.toLowerCase().includes(search.toLowerCase()) ||
      w.phone.includes(search) ||
      w.cin.toLowerCase().includes(search.toLowerCase());

    const matchesTeam = selectedTeam === 'Tous' || w.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-4">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Personnel & Acomptes</span>
          </h2>
          <p className="text-xs text-slate-400">
            {workers.length} ouvriers enregistrés • Gestion des rémunérations et acomptes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiGenerator}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 hover:from-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Équipe par IA</span>
          </button>

          <button
            onClick={onOpenNewWorkerModal}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Ajouter Ouvrier</span>
          </button>
        </div>
      </div>

      {/* Search & Team Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, métier, téléphone ou CIN..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
          />
        </div>

        {teams.length > 2 && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTeam === team
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Worker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredWorkers.map((worker) => {
          const stats = calculateWorkerPeriodStats(worker, attendance, advances);
          const workerAdvances = advances.filter((a) => a.workerId === worker.id);
          const lastAdvance = workerAdvances[workerAdvances.length - 1];

          return (
            <div
              key={worker.id}
              className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
            >
              {/* Header Info */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{worker.name}</span>
                      {worker.active && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] font-bold text-amber-400">
                        {worker.craft}
                      </span>
                      <span className="text-[10px] text-slate-400">• {worker.team}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onEditWorker(worker)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Modifier ouvrier"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Level & Phone */}
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-300 font-medium truncate max-w-[180px]">
                    {worker.recruitmentLevel}
                  </span>
                  {worker.phone && (
                    <a
                      href={`tel:${worker.phone}`}
                      className="flex items-center gap-1 text-slate-300 hover:text-amber-400 font-mono text-[11px]"
                    >
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>{worker.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Financial Box */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-1.5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Jours Travaillés</span>
                  <span className="font-bold text-white">{stats.totalDaysWorked} j</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Acomptes Reçus</span>
                  <span className="font-bold text-rose-400">{stats.totalAdvances.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Solde Net Dû</span>
                  <span className="font-bold text-emerald-400">{stats.netDue.toLocaleString()} {site.currency}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenAdvanceModal(worker)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <HandCoins className="w-3.5 h-3.5" />
                  <span>Verser un acompte</span>
                </button>

                {lastAdvance && (
                  <button
                    onClick={() => onOpenReceiptModal(lastAdvance, worker)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                    title="Imprimer reçu d'acompte"
                  >
                    <Receipt className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reçu</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
