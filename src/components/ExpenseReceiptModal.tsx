import React from 'react';
import { DailyExpense, Site } from '../types';
import { X, Receipt, Printer, Building2, Calendar, FileText } from 'lucide-react';

interface ExpenseReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: DailyExpense | null;
  site: Site | null;
}

export const ExpenseReceiptModal: React.FC<ExpenseReceiptModalProps> = ({
  isOpen,
  onClose,
  expense,
  site
}) => {
  if (!isOpen || !expense || !site) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 print:bg-white print:text-black">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-rose-400" />
            <h3 className="font-semibold text-lg">Justificatif de dépense</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-5 bg-slate-800/60 rounded-xl border border-slate-700/60 print:border-black print:bg-white space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">ChantierPro BTP</p>
              <h4 className="font-bold text-base text-slate-100 print:text-black">{site.name}</h4>
              <p className="text-xs text-slate-400 print:text-slate-600">{site.address}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono font-bold bg-rose-500/10 text-rose-400 px-2 py-1 rounded">
                DEP-{expense.id.slice(-6)}
              </span>
              <p className="text-xs text-slate-400 mt-1">{expense.date}</p>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-700 pt-3 space-y-2">
            <div>
              <p className="text-xs text-slate-400">Désignation :</p>
              <p className="text-sm font-semibold text-white print:text-black">{expense.description}</p>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Catégorie : <strong className="text-slate-200 capitalize">{expense.category}</strong></span>
              {expense.supplier && <span>Fournisseur : <strong className="text-slate-200">{expense.supplier}</strong></span>}
            </div>
            {expense.invoiceNumber && (
              <p className="text-xs text-slate-400">Réf. Facture / BL : <strong className="text-slate-200">{expense.invoiceNumber}</strong></p>
            )}
          </div>

          <div className="bg-slate-900/80 print:bg-slate-100 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Montant Décaissé</p>
            <p className="text-2xl font-bold font-mono text-rose-400 print:text-black">
              {expense.amount.toLocaleString()} {site.currency}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-5 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};
