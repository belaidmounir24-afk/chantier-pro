import React, { useState } from 'react';
import { Site, Material, StockMovement, Equipment, MaintenanceRecord } from '../types';
import { 
  Boxes, 
  Wrench, 
  Plus, 
  ArrowDownRight, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Truck
} from 'lucide-react';

interface MaterialsViewProps {
  site: Site;
  materials: Material[];
  movements: StockMovement[];
  equipment: Equipment[];
  maintenanceRecords: MaintenanceRecord[];
  onOpenNewMaterialModal: () => void;
  onOpenMovementModal: (material: Material, type: 'reception' | 'consommation') => void;
  onOpenNewEquipmentModal: () => void;
  onOpenMaintenanceModal: (equipment: Equipment) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  site,
  materials,
  equipment,
  onOpenNewMaterialModal,
  onOpenMovementModal,
  onOpenNewEquipmentModal,
  onOpenMaintenanceModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'materials' | 'equipment'>('materials');

  const siteMaterials = materials.filter((m) => m.siteId === site.id);
  const siteEquipment = equipment.filter((e) => e.siteId === site.id);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-28 space-y-4">
      {/* Sub-Tab Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1 flex-1">
          <button
            onClick={() => setActiveSubTab('materials')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'materials'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Stocks Matériaux ({siteMaterials.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('equipment')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'equipment'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Engins & Matériel ({siteEquipment.length})</span>
          </button>
        </div>

        {activeSubTab === 'materials' ? (
          <button
            onClick={onOpenNewMaterialModal}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs font-bold flex items-center gap-1 transition-all border border-slate-700 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter Matériau</span>
          </button>
        ) : (
          <button
            onClick={onOpenNewEquipmentModal}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs font-bold flex items-center gap-1 transition-all border border-slate-700 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter Engin</span>
          </button>
        )}
      </div>

      {/* 1. MATERIALS SECTION */}
      {activeSubTab === 'materials' && (
        <div className="space-y-3">
          {siteMaterials.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-3">
              <Boxes className="w-10 h-10 mx-auto text-amber-400/50" />
              <p className="text-sm font-bold text-white">Aucun matériau enregistré pour ce chantier</p>
              <button
                onClick={onOpenNewMaterialModal}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Ajouter un premier matériau
              </button>
            </div>
          ) : (
            siteMaterials.map((mat) => {
              const isLowStock = mat.currentStock <= mat.minStock;

              return (
                <div
                  key={mat.id}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-white truncate">{mat.name}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {mat.category}
                      </span>
                      {isLowStock && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Seuil bas atteint</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span>Stock Actuel : <strong className={`text-sm ${isLowStock ? 'text-rose-400' : 'text-white'}`}>{mat.currentStock} {mat.unit}</strong></span>
                      <span>•</span>
                      <span>Seuil Min : <strong>{mat.minStock} {mat.unit}</strong></span>
                      {mat.unitPrice > 0 && (
                        <>
                          <span>•</span>
                          <span>Prix unitaire : ~{mat.unitPrice} {site.currency}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stock Movement Quick Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onOpenMovementModal(mat, 'reception')}
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                      title="Enregistrer une livraison fournisseur"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span>Réception</span>
                    </button>

                    <button
                      onClick={() => onOpenMovementModal(mat, 'consommation')}
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Enregistrer la consommation sur le chantier"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                      <span>Consommation</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2. EQUIPMENT SECTION */}
      {activeSubTab === 'equipment' && (
        <div className="space-y-3">
          {siteEquipment.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-3">
              <Truck className="w-10 h-10 mx-auto text-amber-400/50" />
              <p className="text-sm font-bold text-white">Aucun engin affecté à ce chantier</p>
              <button
                onClick={onOpenNewEquipmentModal}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Ajouter un engin de chantier
              </button>
            </div>
          ) : (
            siteEquipment.map((eq) => {
              const nextDate = new Date(eq.nextMaintenanceDate);
              const diffDays = Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isUrgent = diffDays <= 7 || eq.status === 'breakdown';

              return (
                <div
                  key={eq.id}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-white">{eq.name}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                        {eq.brand || eq.type}
                      </span>
                      {eq.status === 'operational' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Opérationnel</span>
                        </span>
                      ) : eq.status === 'maintenance' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Wrench className="w-3 h-3" />
                          <span>En maintenance</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>En panne</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
                      <span>N° Série : <strong className="text-slate-300 font-mono">{eq.serialNumber || 'N/A'}</strong></span>
                      <span>•</span>
                      <span>Heures : <strong className="text-slate-300">{eq.hoursUsed} h</strong></span>
                      <span>•</span>
                      <span className={isUrgent ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        Prochaine maintenance : {eq.nextMaintenanceDate} ({diffDays < 0 ? 'En retard !' : `J-${diffDays}`})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenMaintenanceModal(eq)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Enregistrer Révision</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
