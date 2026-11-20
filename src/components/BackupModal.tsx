import React, { useRef, useState } from 'react';
import { ChantierDb } from '../types';
import { StorageService } from '../services/storage';
import { X, Database, Download, Upload, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreData: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  onRestoreData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const json = StorageService.exportBackupJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ChantierPro_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage('Sauvegarde exportée avec succès !');
    } catch (e) {
      setStatusMessage("Erreur lors de l'export de la sauvegarde.");
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importBackupJson(content);
        if (success) {
          setStatusMessage('Base de données restaurée avec succès !');
          setTimeout(() => {
            onRestoreData();
            onClose();
          }, 1200);
        } else {
          setStatusMessage('Format de fichier de sauvegarde invalide.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données aux valeurs par défaut de démonstration ?')) {
      StorageService.resetToDefaults();
      setStatusMessage('Données réinitialisées aux valeurs initiales !');
      setTimeout(() => {
        onRestoreData();
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 text-amber-400 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Sauvegarde & Restauration</h3>
              <p className="text-xs text-slate-400">Sécurité et pérennité des données chantiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left transition-colors"
          >
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-200">Exporter la sauvegarde JSON</p>
              <p className="text-xs text-slate-400">Télécharger une copie complète de tous vos chantiers</p>
            </div>
          </button>

          {/* Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 text-left transition-colors"
          >
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-200">Restaurer un fichier de sauvegarde</p>
              <p className="text-xs text-slate-400">Importer un fichier JSON préalablement exporté</p>
            </div>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full p-4 rounded-xl bg-slate-800/40 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 flex items-center gap-3 text-left transition-colors text-slate-400 hover:text-rose-300"
          >
            <div className="p-2.5 bg-slate-800 rounded-lg text-slate-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Réinitialiser aux données de démo</p>
              <p className="text-xs opacity-80">Rétablir les chantiers et ouvriers initiaux</p>
            </div>
          </button>
        </div>

        <div className="pt-4 mt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
