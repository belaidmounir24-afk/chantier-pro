import React from 'react';
import { Advance, Worker, Site } from '../types';
import { X, Printer, CheckCircle2, Building, User, Calendar, Receipt } from 'lucide-react';

interface AdvanceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  advance: Advance | null;
  worker: Worker | null;
  site: Site | null;
}

export const AdvanceReceiptModal: React.FC<AdvanceReceiptModalProps> = ({
  isOpen,
  onClose,
  advance,
  worker,
  site
}) => {
  if (!isOpen || !advance || !worker || !site) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg">Reçu de versement d'acompte</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="mt-4 p-5 bg-slate-800/60 rounded-xl border border-slate-700/60 print:border-black print:bg-white space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">ChantierPro BTP</p>
              <h4 className="font-bold text-base text-slate-100 print:text-black">{site.name}</h4>
              <p className="text-xs text-slate-400 print:text-slate-600">{site.address}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-1 rounded print:border print:border-black">
                {advance.receiptNumber}
              </span>
              <p className="text-xs text-slate-400 mt-1">{advance.date}</p>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-700 pt-3">
            <p className="text-xs text-slate-400">Bénéficiaire :</p>
            <p className="text-sm font-bold text-white print:text-black">{worker.name}</p>
            <p className="text-xs text-slate-400">{worker.craft} • CIN: {worker.cin || 'N/A'}</p>
          </div>

          <div className="bg-slate-900/80 print:bg-slate-100 p-3 rounded-lg text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Montant Perçu</p>
            <p className="text-2xl font-bold font-mono text-amber-400 print:text-black">
              {advance.amount.toLocaleString()} {site.currency}
            </p>
            {advance.notes && (
              <p className="text-xs text-slate-400 mt-1 italic">« {advance.notes} »</p>
            )}
          </div>

          <div className="pt-4 flex justify-between text-xs text-slate-400 print:text-black border-t border-slate-700">
            <div className="text-center">
              <p className="font-medium">Le Responsable Chantier</p>
              <div className="h-10 border-b border-dashed border-slate-600 mt-1 w-28"></div>
              <span className="text-[10px] text-slate-500">Signature / Cachet</span>
            </div>
            <div className="text-center">
              <p className="font-medium">L'Ouvrier Émargement</p>
              <div className="h-10 border-b border-dashed border-slate-600 mt-1 w-28"></div>
              <span className="text-[10px] text-slate-500">Bon pour accord</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-5 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer reçu
          </button>
        </div>
      </div>
    </div>
  );
};
