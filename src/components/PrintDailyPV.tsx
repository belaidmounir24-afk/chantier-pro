import React from 'react';
import { Site, SiteLog, Worker, AttendanceRecord, DailyExpense } from '../types';
import { X, Printer, Calendar, CloudSun, Users, CheckSquare, AlertTriangle } from 'lucide-react';

interface PrintDailyPVProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
  log: SiteLog | null;
  dateStr: string;
  workers: Worker[];
  attendance: AttendanceRecord[];
  expenses: DailyExpense[];
}

export const PrintDailyPV: React.FC<PrintDailyPVProps> = ({
  isOpen,
  onClose,
  site,
  log,
  dateStr,
  workers,
  attendance,
  expenses
}) => {
  if (!isOpen) return null;

  const todayAttendance = attendance.filter((a) => a.siteId === site.id && a.date === dateStr);
  const presentWorkers = todayAttendance
    .filter((a) => a.status === 'present' || a.status === 'half')
    .map((a) => {
      const w = workers.find((w) => w.id === a.workerId);
      return { worker: w, status: a.status, hours: a.hours };
    });

  const todayExpenses = expenses.filter((e) => e.siteId === site.id && e.date === dateStr);
  const totalExpenseToday = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col print:bg-white print:text-black print:border-none print:shadow-none print:max-h-none print:w-full print:p-0">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg">Procès-Verbal Journalier de Chantier (PV)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 my-4 space-y-4 pr-1 print:overflow-visible print:my-0">
          <div className="p-6 bg-slate-800/60 rounded-xl border border-slate-700/60 print:bg-white print:border-black print:p-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-700 pb-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE</p>
                <h2 className="text-lg font-bold text-white print:text-black mt-1">JOURNAL OFFICIEL DE CHANTIER — PV N° {dateStr.replace(/-/g, '')}</h2>
                <p className="text-xs text-slate-300 print:text-slate-700 font-semibold">{site.name} • {site.address}</p>
                <p className="text-xs text-slate-400 print:text-slate-600">Maître d'Ouvrage : {site.client}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono bg-amber-500/10 text-amber-400 px-3 py-1 rounded print:border print:border-black">
                  Date : {dateStr}
                </span>
                <p className="text-xs text-slate-400 mt-1">Météo : {log?.weather || 'Ensoleillé'} ({log?.temperature || '22°C'})</p>
              </div>
            </div>

            {/* Workforce Summary */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 print:text-black mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> 1. Effectif & Main d'Œuvre Présente ({presentWorkers.length} ouvriers)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presentWorkers.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/60 print:bg-slate-50 p-2 rounded border border-slate-700/60 print:border-slate-300 text-xs">
                    <p className="font-semibold text-white print:text-black">{item.worker?.name}</p>
                    <p className="text-slate-400 print:text-slate-600">{item.worker?.craft} ({item.status === 'half' ? '1/2 j' : '1 j'})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Works Completed */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 print:text-black mb-1 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" /> 2. Travaux Exécutés & Avancement
              </h4>
              <p className="text-xs text-slate-200 print:text-black bg-slate-900/60 print:bg-slate-50 p-3 rounded border border-slate-700/60 whitespace-pre-wrap leading-relaxed">
                {log?.tasksCompleted || 'Poursuite des travaux selon planning contractuel.'}
              </p>
            </div>

            {/* Issues or Safety */}
            {(log?.issues || log?.issuesEncountered) && (
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-rose-400 print:text-black mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> 3. Aléas, Pannes & Arrêts de Travail
                </h4>
                <p className="text-xs text-rose-200 print:text-black bg-slate-900/60 print:bg-slate-50 p-3 rounded border border-slate-700/60">
                  {log.issues || log.issuesEncountered}
                </p>
              </div>
            )}

            {/* Expenses */}
            {todayExpenses.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 print:text-black mb-1">
                  4. Dépenses Caisse du Jour ({totalExpenseToday.toLocaleString()} {site.currency})
                </h4>
                <div className="text-xs space-y-1">
                  {todayExpenses.map((exp) => (
                    <div key={exp.id} className="flex justify-between py-1 border-b border-slate-700/40 print:border-slate-300">
                      <span>{exp.description} ({exp.category})</span>
                      <span className="font-mono font-bold">{exp.amount.toLocaleString()} {site.currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signatures */}
            <div className="pt-6 grid grid-cols-2 gap-4 text-xs text-slate-400 print:text-black border-t border-slate-700 print:border-black">
              <div className="text-center">
                <p className="font-bold text-slate-200 print:text-black">Le Conducteur de Travaux / Chef de Chantier</p>
                <div className="h-14 border-b border-dashed border-slate-600 mt-2 mx-auto w-40"></div>
                <span className="text-[10px] text-slate-500">Signature & Cachet</span>
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-200 print:text-black">Le Représentant Maître d'Œuvre / Suivi</p>
                <div className="h-14 border-b border-dashed border-slate-600 mt-2 mx-auto w-40"></div>
                <span className="text-[10px] text-slate-500">Visa / Observations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-slate-800 shrink-0 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" />
            Imprimer PV Officiel
          </button>
        </div>
      </div>
    </div>
  );
};
