import React, { useState } from 'react';
import { Site, Worker, AttendanceRecord, AttendanceStatus, TabType } from '../types';
import { triggerHaptic } from '../utils/android';
import { generateWeeklyPlanningPdf } from '../services/weeklyPlanningPdfService';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  CheckCircle2, 
  Clock, 
  UserX, 
  TrendingUp, 
  Camera, 
  Sparkles, 
  BarChart3, 
  ClipboardCheck, 
  MapPin, 
  Plus, 
  Search, 
  UserPlus, 
  HandCoins, 
  Printer, 
  CheckCheck,
  Award
} from 'lucide-react';

interface AttendanceViewProps {
  site: Site;
  workers: Worker[];
  attendance: AttendanceRecord[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onUpdateAttendance: (workerId: string, status: AttendanceStatus, hours?: number, overtime?: number) => void;
  onMarkAllPresent: () => void;
  onOpenNewWorkerModal: () => void;
  onOpenAdvanceModal: (worker?: Worker) => void;
  onOpenPrintPV: () => void;
  onOpenScanIa: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  site,
  workers,
  attendance,
  selectedDate,
  onSelectDate,
  onUpdateAttendance,
  onMarkAllPresent,
  onOpenNewWorkerModal,
  onOpenAdvanceModal,
  onOpenPrintPV,
  onOpenScanIa,
  onNavigateTab
}) => {
  const [activeMode, setActiveMode] = useState<'presence' | 'stats'>('presence');
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(true);

  const activeWorkers = workers.filter((w) => w.active);
  const totalEnrolled = activeWorkers.length;

  const getWorkerRecord = (workerId: string) => {
    return attendance.find(
      (a) => a.siteId === site.id && a.date === selectedDate && a.workerId === workerId
    );
  };

  // Metrics computation for selectedDate
  const todayRecords = activeWorkers.map((w) => getWorkerRecord(w.id));
  const presentCount = todayRecords.filter((r) => r?.status === 'present').length;
  const lateCount = todayRecords.filter((r) => r?.status === 'late').length;
  const halfCount = todayRecords.filter((r) => r?.status === 'half').length;
  const absentCount = todayRecords.filter((r) => r?.status === 'absent' || !r).length;
  
  // Total hours of overtime today
  const totalOvertime = todayRecords.reduce((sum, r) => sum + (r?.overtimeHours || 0), 0);

  const presentPercentage = totalEnrolled > 0 ? Math.round(((presentCount + halfCount * 0.5) / totalEnrolled) * 100) : 0;

  // Date formatting DD/MM/YYYY
  const formatDateDisplay = (dateIso: string) => {
    const parts = dateIso.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateIso;
  };

  const handlePrevDay = () => {
    triggerHaptic('light');
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    triggerHaptic('light');
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleDownloadWeeklyPdf = () => {
    triggerHaptic('medium');
    generateWeeklyPlanningPdf(site, workers, attendance, selectedDate);
  };

  const teams = Array.from(new Set(activeWorkers.map((w) => w.team))).filter(Boolean);

  const filteredWorkers = activeWorkers.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.craft.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = filterTeam === 'all' || w.team === filterTeam;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="max-w-md sm:max-w-lg mx-auto w-full pt-3 pb-28 px-3 space-y-3">
      {/* 1. TOP VIEW SWITCHER CARD (Pointage & Présences vs Graphiques & Statistiques + Scan IA) */}
      <div className="bg-white rounded-3xl p-3 shadow-md border border-slate-200/80 space-y-2.5">
        {/* Segmented Pill Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveMode('presence');
            }}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeMode === 'presence'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Pointage & Présences</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveMode('stats');
            }}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeMode === 'stats'
                ? 'bg-[#F59E0B] text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Graphiques & Statistiques</span>
          </button>
        </div>

        {/* Scan IA Button (Matches screenshot vibrant orange full-width banner) */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenScanIa();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#EA580C] hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
        >
          <Camera className="w-5 h-5 text-slate-950" />
          <span>Scan IA (Caméra / Photos / Doc)</span>
          <Sparkles className="w-4 h-4 text-slate-950" />
        </button>
      </div>

      {/* 2. DATE & PLANNING CARD (Matches screenshot) */}
      <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-200/80 space-y-3">
        {/* Date Selector Pill */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/70 rounded-2xl px-3 py-2">
          <button 
            onClick={handlePrevDay} 
            className="p-1 text-slate-600 hover:text-slate-900 active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative flex items-center gap-2 cursor-pointer font-bold text-base text-slate-900">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>{formatDateDisplay(selectedDate)}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </div>

          <button 
            onClick={handleNextDay} 
            className="p-1 text-slate-600 hover:text-slate-900 active:scale-90 transition-transform"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Row: Planning Hebdo PDF + Rayon GPS */}
        <div className="flex items-center gap-2">
          {/* Planning Hebdo PDF Button */}
          <button
            onClick={handleDownloadWeeklyPdf}
            className="flex-1 py-2 px-3 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Planning Hebdo PDF</span>
          </button>

          {/* Rayon GPS Badge */}
          <button
            onClick={() => setGpsVerified(!gpsVerified)}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#E0F2FE] border border-sky-200 text-[#0369A1] font-bold text-xs shadow-sm hover:bg-sky-100 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Rayon GPS : {site.radiusMeters || 200}m</span>
          </button>
        </div>

        {/* Worker count label */}
        <p className="text-xs font-semibold text-slate-500 pl-1">
          {totalEnrolled} ouvriers inscrits
        </p>
      </div>

      {/* 3. FOUR STATUS METRIC CARDS GRID (Green, Orange, Red, Blue) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: PRÉSENTS (P) - Green */}
        <div className="bg-[#059669] text-white rounded-3xl p-4 shadow-md flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider">PRÉSENTS (P)</span>
            <CheckCircle2 className="w-4 h-4 text-white/90" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight">{presentCount}</span>
              <span className="text-xs font-bold text-white/90">/ {totalEnrolled} ({presentPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Card 2: RETARDS (R) - Orange */}
        <div className="bg-[#F59E0B] text-slate-950 rounded-3xl p-4 shadow-md flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider">RETARDS (R)</span>
            <Clock className="w-4 h-4 text-slate-950/80" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight">{lateCount}</span>
              <span className="text-xs font-bold text-slate-900/90">signalés</span>
            </div>
          </div>
        </div>

        {/* Card 3: ABSENTS (A) - Red */}
        <div className="bg-[#EF4444] text-white rounded-3xl p-4 shadow-md flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider">ABSENTS (A)</span>
            <UserX className="w-4 h-4 text-white/90" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight">{absentCount}</span>
              <span className="text-xs font-bold text-white/90">ouvriers</span>
            </div>
          </div>
        </div>

        {/* Card 4: HEURES SUP (HS) - Blue */}
        <div className="bg-[#2563EB] text-white rounded-3xl p-4 shadow-md flex flex-col justify-between min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider">HEURES SUP (HS)</span>
            <TrendingUp className="w-4 h-4 text-white/90" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight">+{totalOvertime}h</span>
              <span className="text-xs font-bold text-white/90">cumulées</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CONTENT ACCORDING TO ACTIVE MODE */}
      {activeMode === 'presence' ? (
        /* PRESENCE & WORKERS LIST */
        <div className="space-y-3 pt-1">
          {/* Controls row: Search + Bulk Mark Present + Add Worker */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher ouvrier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
              />
            </div>

            <button
              onClick={() => {
                triggerHaptic('success');
                onMarkAllPresent();
              }}
              title="Pointer tous les ouvriers comme présents"
              className="px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95 transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tout pointer</span>
            </button>

            <button
              onClick={onOpenNewWorkerModal}
              title="Ajouter un nouvel ouvrier"
              className="p-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm shrink-0 active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          {/* Team filter chips */}
          {teams.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setFilterTeam('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  filterTeam === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tous ({totalEnrolled})
              </button>
              {teams.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTeam(t)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${
                    filterTeam === t
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Workers Attendance Cards */}
          <div className="space-y-2">
            {filteredWorkers.map((worker) => {
              const rec = getWorkerRecord(worker.id);
              const status: AttendanceStatus = rec?.status || 'absent';
              const overtime = rec?.overtimeHours || 0;

              return (
                <div
                  key={worker.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex flex-col gap-2.5 transition-all"
                >
                  {/* Top: Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{worker.name}</h4>
                      <p className="text-xs text-slate-500">{worker.craft} • {worker.team}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {worker.rate.toLocaleString()} {site.currency}/{worker.rateType}
                      </span>
                      <p className="text-[10px] text-slate-400">{worker.recruitmentLevel.split('—')[0].trim()}</p>
                    </div>
                  </div>

                  {/* Bottom: Fast Status Toggles */}
                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 flex-1">
                      {/* P (Présent) */}
                      <button
                        onClick={() => onUpdateAttendance(worker.id, 'present', 8, overtime)}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          status === 'present'
                            ? 'bg-[#059669] text-white shadow'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        P
                      </button>

                      {/* R (Retard) */}
                      <button
                        onClick={() => onUpdateAttendance(worker.id, 'late', 8, overtime)}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          status === 'late'
                            ? 'bg-[#F59E0B] text-slate-950 shadow'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        R
                      </button>

                      {/* A (Absent) */}
                      <button
                        onClick={() => onUpdateAttendance(worker.id, 'absent', 0, 0)}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          status === 'absent'
                            ? 'bg-[#EF4444] text-white shadow'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        A
                      </button>

                      {/* 1/2 (Demi-journée) */}
                      <button
                        onClick={() => onUpdateAttendance(worker.id, 'half', 4, overtime)}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          status === 'half'
                            ? 'bg-amber-400 text-slate-950 shadow'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        1/2
                      </button>
                    </div>

                    {/* Overtime Stepper */}
                    <div className="flex items-center gap-1 pl-1 shrink-0">
                      <button
                        onClick={() => {
                          const nextOt = Math.max(0, overtime - 1);
                          onUpdateAttendance(worker.id, status, status === 'half' ? 4 : status === 'absent' ? 0 : 8, nextOt);
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-lg ${
                        overtime > 0 ? 'bg-blue-100 text-blue-700' : 'text-slate-400'
                      }`}>
                        +{overtime}h
                      </span>
                      <button
                        onClick={() => {
                          const nextOt = overtime + 1;
                          onUpdateAttendance(worker.id, status === 'absent' ? 'present' : status, 8, nextOt);
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Verser Acompte Button */}
                    <button
                      onClick={() => onOpenAdvanceModal(worker)}
                      title="Verser acompte"
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-500/20 text-amber-600 transition-colors shrink-0"
                    >
                      <HandCoins className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* GRAPHIQUES & STATISTIQUES VIEW */
        <div className="space-y-3 pt-1">
          {/* Summary Box */}
          <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              Synthèse d'Assiduité Hebdomadaire
            </h3>

            {/* Big Indicator Row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Taux de Présence</p>
                <p className="text-xl font-black text-emerald-600 mt-0.5">{presentPercentage}%</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Heures Sup Semaine</p>
                <p className="text-xl font-black text-blue-600 mt-0.5">+{totalOvertime}h</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Masse Salariale Jour</p>
                <p className="text-sm font-black text-slate-800 mt-1">
                  {(presentCount * 3200).toLocaleString()} {site.currency}
                </p>
              </div>
            </div>

            {/* Bars simulation */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Présences des 6 derniers jours ouvrés
              </p>
              <div className="grid grid-cols-6 gap-2 items-end h-28 pt-4 pb-2 border-b border-slate-200">
                {[
                  { day: 'Lun', rate: 85 },
                  { day: 'Mar', rate: 80 },
                  { day: 'Mer', rate: 92 },
                  { day: 'Jeu', rate: 88 },
                  { day: 'Ven', rate: 0 },
                  { day: 'Sam', rate: 80 }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[9px] font-bold text-slate-600">{item.rate > 0 ? `${item.rate}%` : 'Repos'}</span>
                    <div 
                      className={`w-full rounded-t-lg transition-all ${
                        item.rate > 0 ? 'bg-[#F59E0B]' : 'bg-slate-200'
                      }`}
                      style={{ height: `${Math.max(item.rate, 6)}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-500 mt-1">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown by Craft */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Répartition par Qualification
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Chefs d'équipe / Maîtres Ouvriers</span>
                  <span className="font-bold text-slate-900">2 ouvriers</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Compagnons Professionnels (OP2)</span>
                  <span className="font-bold text-slate-900">7 ouvriers</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Ouvriers Professionnels (OP1)</span>
                  <span className="font-bold text-slate-900">3 ouvriers</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Manœuvres</span>
                  <span className="font-bold text-slate-900">3 ouvriers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING ACTION BUTTON (FAB) - Vibrant Orange with + */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => {
            triggerHaptic('medium');
            setShowFabMenu(!showFabMenu);
          }}
          aria-label="Actions rapides"
          className="w-14 h-14 rounded-full bg-[#F59E0B] hover:bg-amber-400 active:scale-95 text-slate-950 font-black shadow-2xl flex items-center justify-center transition-all"
        >
          <Plus className={`w-8 h-8 transition-transform duration-200 ${showFabMenu ? 'rotate-45' : ''}`} />
        </button>

        {/* FAB Quick Menu */}
        {showFabMenu && (
          <div className="absolute bottom-16 right-0 bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl flex flex-col gap-2 min-w-[200px] animate-in slide-in-from-bottom-2 duration-200 text-white text-xs">
            <button
              onClick={() => {
                setShowFabMenu(false);
                onOpenScanIa();
              }}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 font-semibold"
            >
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Camera className="w-4 h-4" />
              </div>
              <span>Scan IA Pointage</span>
            </button>

            <button
              onClick={() => {
                setShowFabMenu(false);
                onOpenNewWorkerModal();
              }}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 font-semibold"
            >
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <UserPlus className="w-4 h-4" />
              </div>
              <span>Ajouter Ouvrier</span>
            </button>

            <button
              onClick={() => {
                setShowFabMenu(false);
                onMarkAllPresent();
              }}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 font-semibold"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCheck className="w-4 h-4" />
              </div>
              <span>Tout Pointer Présent</span>
            </button>

            <button
              onClick={() => {
                setShowFabMenu(false);
                handleDownloadWeeklyPdf();
              }}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 font-semibold"
            >
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
              <span>Planning Hebdo PDF</span>
            </button>

            <button
              onClick={() => {
                setShowFabMenu(false);
                onOpenPrintPV();
              }}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 font-semibold"
            >
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <Printer className="w-4 h-4" />
              </div>
              <span>Imprimer PV du Jour</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
