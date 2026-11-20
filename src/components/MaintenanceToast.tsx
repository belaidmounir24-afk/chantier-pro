import React from 'react';
import { MaintenanceAlert } from '../types';
import { AlertCircle, X, ChevronRight } from 'lucide-react';

interface MaintenanceToastProps {
  alerts: MaintenanceAlert[];
  onOpenCenter: () => void;
  onDismiss: () => void;
}

export const MaintenanceToast: React.FC<MaintenanceToastProps> = ({
  alerts,
  onOpenCenter,
  onDismiss
}) => {
  if (alerts.length === 0) return null;

  const urgentCount = alerts.filter((a) => a.urgency === 'high').length;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900 border border-rose-500/40 rounded-xl p-3 shadow-2xl animate-in slide-in-from-top duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">
            {urgentCount > 0 ? `${urgentCount} révision(s) en retard !` : `${alerts.length} entretien(s) à prévoir`}
          </h4>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {alerts[0].equipmentName}: {alerts[0].message}
          </p>
          <button
            onClick={onOpenCenter}
            className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            Voir les alertes engins <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
