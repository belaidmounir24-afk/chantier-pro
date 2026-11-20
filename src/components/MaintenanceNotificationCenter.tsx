import React from 'react';
import { MaintenanceAlert, Equipment } from '../types';
import { X, Bell, AlertTriangle, AlertCircle, Calendar, CheckCircle2, Wrench } from 'lucide-react';

interface MaintenanceNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MaintenanceAlert[];
  equipments: Equipment[];
  onOpenMaintenanceModal: (equipment: Equipment) => void;
}

export const MaintenanceNotificationCenter: React.FC<MaintenanceNotificationCenterProps> = ({
  isOpen,
  onClose,
  alerts,
  equipments,
  onOpenMaintenanceModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Centre d'Alertes Entretien Engins</h3>
              <p className="text-xs text-slate-400">Échéances de maintenance et prévention des pannes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto my-4 space-y-3 flex-1 pr-1">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-white">Tous les engins sont à jour !</p>
              <p className="text-xs text-slate-500 mt-1">Aucune révision urgente requise sur ce chantier.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const eq = equipments.find((e) => e.id === alert.equipmentId);
              const isUrgent = alert.urgency === 'high';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border flex flex-col gap-2 ${
                    isUrgent
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {isUrgent ? (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-white">{alert.equipmentName}</h4>
                        <p className="text-xs opacity-90">{alert.message}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isUrgent ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isUrgent ? 'Urgent' : 'À planifier'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                    <span className="flex items-center gap-1 opacity-75">
                      <Calendar className="w-3.5 h-3.5" />
                      Échéance : {alert.dueDate}
                    </span>
                    {eq && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenMaintenanceModal(eq);
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        Effectuer révision
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
