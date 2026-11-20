import React, { useState } from 'react';
import { Site, Worker, Advance, AttendanceRecord, DailyExpense, SiteLog } from '../types';
import { calculateWorkerPeriodStats } from '../utils/calculations';
import { 
  BarChart3, 
  FileDown, 
  Wallet, 
  Users, 
  Receipt, 
  TrendingUp, 
  Calendar,
  PieChart
} from 'lucide-react';

interface ReportsViewProps {
  site: Site;
  workers: Worker[];
  advances: Advance[];
  attendance: AttendanceRecord[];
  expenses: DailyExpense[];
  logs: SiteLog[];
  onOpenPeriodReport: (startDate?: string, endDate?: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  site,
  workers,
  advances,
  attendance,
  expenses,
  onOpenPeriodReport
}) => {
  const [dateFilter, setDateFilter] = useState<'all' | 'month' | 'week'>('all');

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const filteredAttendance = attendance.filter((a) => {
    if (a.siteId !== site.id) return false;
    if (dateFilter === 'month') return a.date.startsWith(currentMonthStr);
    return true;
  });

  const filteredExpenses = expenses.filter((e) => {
    if (e.siteId !== site.id) return false;
    if (dateFilter === 'month') return e.date.startsWith(currentMonthStr);
    return true;
  });

  const filteredAdvances = advances.filter((a) => {
    if (a.siteId !== site.id) return false;
    if (dateFilter === 'month') return a.date.startsWith(currentMonthStr);
    return true;
  });

  // Calculate totals
  let totalSalaries = 0;
  for (const w of workers) {
    const stats = calculateWorkerPeriodStats(w, filteredAttendance, filteredAdvances);
    totalSalaries += stats.totalEarned;
  }

  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const totalAdvances = filteredAdvances.reduce((s, a) => s + a.amount, 0);
  const totalSiteCost = totalSalaries + totalExpenses;

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  for (const exp of filteredExpenses) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <span>Rapports & Synthèse Financière</span>
          </h2>
          <p className="text-xs text-slate-400">
            Bilan des coûts de main d'œuvre, acomptes, achats et exportations PDF
          </p>
        </div>

        <button
          onClick={() => onOpenPeriodReport()}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Générer Rapport PDF Complet</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setDateFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            dateFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Depuis le Début
        </button>
        <button
          onClick={() => setDateFilter('month')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            dateFilter === 'month'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Ce Mois-ci
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Masse Salariale</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-black text-white">{totalSalaries.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500">{site.currency} dus aux ouvriers</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Acomptes Versés</span>
            <Wallet className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-lg font-black text-rose-400">{totalAdvances.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500">{site.currency} déjà décaissés</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Dépenses Chantier</span>
            <Receipt className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-black text-amber-400">{totalExpenses.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500">{site.currency} achats & carburant</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Coût Global Chantier</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-lg font-black text-cyan-400">{totalSiteCost.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500">{site.currency} engagés</span>
        </div>
      </div>

      {/* Category Expenses Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <PieChart className="w-4 h-4 text-amber-400" />
          <span>Répartition des Dépenses par Catégorie</span>
        </h3>

        {Object.keys(categoryTotals).length === 0 ? (
          <p className="text-xs text-slate-400">Aucune dépense sur cette période.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 uppercase text-[11px]">{cat}</span>
                    <span className="font-mono text-white">
                      {amount.toLocaleString()} {site.currency} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Worker Period Payroll Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>État Nominatif des Salaires & Acomptes</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2 px-2">Ouvrier</th>
                <th className="py-2 px-2 text-center">Jours</th>
                <th className="py-2 px-2 text-right">Salaire Dû</th>
                <th className="py-2 px-2 text-right">Acomptes</th>
                <th className="py-2 px-2 text-right font-bold text-amber-400">Net à Payer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {workers.map((w) => {
                const stats = calculateWorkerPeriodStats(w, filteredAttendance, filteredAdvances);
                return (
                  <tr key={w.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-2 font-medium text-white">
                      {w.name}
                      <span className="text-[10px] text-slate-400 block">{w.craft}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-300 font-mono">
                      {stats.totalDaysWorked} j
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-200">
                      {stats.totalEarned.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-rose-400">
                      {stats.totalAdvances.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-400">
                      {stats.netDue.toLocaleString()} {site.currency}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
