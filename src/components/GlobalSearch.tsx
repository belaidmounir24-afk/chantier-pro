import React, { useState, useMemo } from 'react';
import { Site, Worker, Material, DailyExpense } from '../types';
import { Search, X, Users, Boxes, Receipt, Building2, ChevronRight } from 'lucide-react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  sites: Site[];
  workers: Worker[];
  materials: Material[];
  expenses: DailyExpense[];
  onSelectSite: (siteId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  sites,
  workers,
  materials,
  expenses,
  onSelectSite,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  const filteredWorkers = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return workers.filter((w) => w.name.toLowerCase().includes(q) || w.craft.toLowerCase().includes(q));
  }, [workers, query]);

  const filteredMaterials = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return materials.filter((m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
  }, [materials, query]);

  const filteredExpenses = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return expenses.filter((e) => e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
  }, [expenses, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[75vh]">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher ouvrier, matériel, dépense, chantier..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded">
            Échap
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Tapez pour rechercher dans tout le système ChantierPro...
            </div>
          ) : (
            <>
              {filteredWorkers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" /> Ouvriers ({filteredWorkers.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredWorkers.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => {
                          onNavigateTab('team');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex justify-between items-center cursor-pointer text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{w.name}</p>
                          <p className="text-slate-400">{w.craft} • {w.team}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredMaterials.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-blue-400" /> Matériaux ({filteredMaterials.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredMaterials.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onNavigateTab('mat');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex justify-between items-center cursor-pointer text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{m.name}</p>
                          <p className="text-slate-400">Stock : {m.currentStock} {m.unit}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredExpenses.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-rose-400" /> Dépenses ({filteredExpenses.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredExpenses.map((exp) => (
                      <div
                        key={exp.id}
                        onClick={() => {
                          onNavigateTab('expenses');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex justify-between items-center cursor-pointer text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{exp.description}</p>
                          <p className="text-slate-400">{exp.date} • {exp.category}</p>
                        </div>
                        <span className="font-mono font-bold text-rose-400">{exp.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredWorkers.length === 0 && filteredMaterials.length === 0 && filteredExpenses.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  Aucun résultat trouvé pour « {query} ».
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
