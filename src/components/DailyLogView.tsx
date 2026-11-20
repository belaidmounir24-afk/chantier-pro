import React, { useState, useEffect } from 'react';
import { Site, SiteLog, Worker, AttendanceRecord } from '../types';
import { 
  BookOpen, 
  Calendar, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  CheckSquare, 
  AlertCircle, 
  ShieldAlert, 
  Printer, 
  Save,
  Users
} from 'lucide-react';

interface DailyLogViewProps {
  site: Site;
  logs: SiteLog[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onSaveLog: (log: SiteLog) => void;
  onOpenPrintPV: () => void;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({
  site,
  logs,
  workers,
  attendance,
  selectedDate,
  onSelectDate,
  onSaveLog,
  onOpenPrintPV
}) => {
  const currentLog = logs.find((l) => l.siteId === site.id && l.date === selectedDate);

  const [weather, setWeather] = useState(currentLog?.weather || 'Ensoleillé');
  const [temperature, setTemperature] = useState(currentLog?.temperature || '22°C');
  const [tasksCompleted, setTasksCompleted] = useState(currentLog?.tasksCompleted || '');
  const [issuesEncountered, setIssuesEncountered] = useState(currentLog?.issuesEncountered || '');
  const [safetyNotes, setSafetyNotes] = useState(currentLog?.safetyNotes || '');
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setWeather(currentLog?.weather || 'Ensoleillé');
    setTemperature(currentLog?.temperature || '22°C');
    setTasksCompleted(currentLog?.tasksCompleted || '');
    setIssuesEncountered(currentLog?.issuesEncountered || '');
    setSafetyNotes(currentLog?.safetyNotes || '');
  }, [selectedDate, currentLog]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLog: SiteLog = {
      id: currentLog?.id || `log-${selectedDate}`,
      date: selectedDate,
      siteId: site.id,
      weather,
      temperature,
      tasksCompleted,
      issuesEncountered,
      safetyNotes
    };
    onSaveLog(updatedLog);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const todayAttendance = attendance.filter((a) => a.siteId === site.id && a.date === selectedDate);
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const halfCount = todayAttendance.filter((a) => a.status === 'half').length;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Journal Quotidien de Chantier</span>
          </h2>
          <p className="text-xs text-slate-400">
            Rapport officiel des activités, météo, incidents et avancement des travaux
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPrintPV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Imprimer PV Journalier</span>
          </button>
        </div>
      </div>

      {/* Date Picker Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400 font-semibold">Date du Journal :</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none focus:border-amber-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Effectif pointé : <strong className="text-white">{presentCount + halfCount * 0.5}</strong> ouvriers</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        {/* Weather & Temp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Conditions Météo</span>
            </label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="Ensoleillé">☀️ Ensoleillé / Dégagé</option>
              <option value="Nuageux">⛅ Nuageux / Couvert</option>
              <option value="Pluvieux">🌧️ Pluvieux / Averse</option>
              <option value="Vent fort">💨 Vent fort / Poussière</option>
              <option value="Chaleur intense">🔥 Forte Chaleur / Canicule</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>Température Relevée</span>
            </label>
            <input
              type="text"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Ex: 24°C"
              className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Tasks Completed */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>Travaux & Tâches Réalisés dans la Journée</span>
          </label>
          <textarea
            rows={4}
            value={tasksCompleted}
            onChange={(e) => setTasksCompleted(e.target.value)}
            placeholder="Détaillez les ouvrages exécutés : coulage béton, pose armatures, maçonnerie, plomberie..."
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        {/* Issues & Blockages */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Difficultés, Arrêts de Travail ou Retards</span>
          </label>
          <textarea
            rows={2}
            value={issuesEncountered}
            onChange={(e) => setIssuesEncountered(e.target.value)}
            placeholder="Panne de matériel, retard approvisionnement, intempéries..."
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        {/* Safety Notes */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Consignes de Sécurité, EPI & Visites de Chantier</span>
          </label>
          <input
            type="text"
            value={safetyNotes}
            onChange={(e) => setSafetyNotes(e.target.value)}
            placeholder="Contrôle port des casques, présence bureau de contrôle CTC, visite architecte..."
            className="w-full h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-emerald-400 font-semibold">
            {savedToast ? '✅ Journal sauvegardé avec succès !' : ''}
          </span>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le Journal</span>
          </button>
        </div>
      </form>
    </div>
  );
};
