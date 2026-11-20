import React from 'react';
import { Site, DailyExpense, CashInflow, Advance } from '../types';
import { calculateSiteCashBalance } from '../utils/calculations';
import { 
  Receipt, 
  Plus, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Scale, 
  Fuel, 
  ShoppingBag, 
  Utensils, 
  Truck, 
  FileText 
} from 'lucide-react';

interface ExpensesViewProps {
  site: Site;
  expenses: DailyExpense[];
  inflows: CashInflow[];
  advances: Advance[];
  onOpenNewExpenseModal: () => void;
  onOpenInflowModal: () => void;
  onOpenAuditModal: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  site,
  expenses,
  inflows,
  advances,
  onOpenNewExpenseModal,
  onOpenInflowModal,
  onOpenAuditModal
}) => {
  const siteExpenses = expenses.filter((e) => e.siteId === site.id);
  const siteInflows = inflows.filter((i) => i.siteId === site.id);
  const cashBalance = calculateSiteCashBalance(inflows, expenses, advances, site.id);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'carburant':
        return <Fuel className="w-4 h-4 text-amber-400" />;
      case 'repas':
        return <Utensils className="w-4 h-4 text-orange-400" />;
      case 'transport':
        return <Truck className="w-4 h-4 text-cyan-400" />;
      case 'outillage':
      case 'materiaux':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-4">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-amber-400" />
            <span>Petite Caisse & Dépenses de Chantier</span>
          </h2>
          <p className="text-xs text-slate-400">
            Trésorerie, achats immédiats, carburant et ravitaillement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenInflowModal}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Alimenter Caisse</span>
          </button>

          <button
            onClick={onOpenNewExpenseModal}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Dépense</span>
          </button>
        </div>
      </div>

      {/* Cash Register Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Solde Théorique en Caisse
              </span>
            </div>
            <p className="text-3xl font-black text-white mt-1">
              {cashBalance.currentBalance.toLocaleString()} <span className="text-sm font-bold text-amber-400">{site.currency}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Disponible pour les décaissements de journée
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAuditModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Audit / Inventaire Caisse</span>
            </button>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs text-center">
          <div>
            <span className="text-[10px] text-slate-500 block">Total Entrées</span>
            <span className="font-bold text-emerald-400">+{cashBalance.totalIn.toLocaleString()} {site.currency}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Achats Chantier</span>
            <span className="font-bold text-slate-300">-{cashBalance.totalExpenses.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Acomptes Sortis</span>
            <span className="font-bold text-rose-400">-{cashBalance.totalAdvances.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Historique des Dépenses Récentes</span>
          <span className="text-xs text-slate-400 font-normal">{siteExpenses.length} opérations</span>
        </h3>

        {siteExpenses.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-3">
            <Receipt className="w-10 h-10 mx-auto text-amber-400/50" />
            <p className="text-sm font-bold text-white">Aucune dépense enregistrée pour ce chantier</p>
            <button
              onClick={onOpenNewExpenseModal}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Enregistrer une dépense
            </button>
          </div>
        ) : (
          siteExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3.5 shadow-sm hover:border-slate-700 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  {getCategoryIcon(expense.category)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xs text-white truncate">{expense.description}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                      {expense.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{expense.date}</span>
                    {expense.supplier && (
                      <>
                        <span>•</span>
                        <span className="truncate">Fournisseur : {expense.supplier}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-black text-rose-400 block font-mono">
                  -{expense.amount.toLocaleString()} {site.currency}
                </span>
                <span className="text-[10px] text-slate-500">Espèces / Caisse</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
