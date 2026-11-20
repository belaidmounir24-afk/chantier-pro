import React, { useState } from 'react';
import { AppLicense } from '../types';
import { StorageService } from '../services/storage';
import { X, ShieldCheck, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: AppLicense;
  onUpdateLicense: (license: AppLicense) => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({
  isOpen,
  onClose,
  license,
  onUpdateLicense
}) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) return;

    if (licenseKeyInput.trim().toUpperCase().startsWith('PRO-')) {
      const updatedLicense: AppLicense = {
        isValid: true,
        type: 'pro',
        deviceId: license.deviceId,
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
        licenseKey: licenseKeyInput.trim().toUpperCase()
      };
      StorageService.saveLicense(updatedLicense);
      onUpdateLicense(updatedLicense);
      setSuccessMsg('Licence ChantierPro Entreprise activée avec succès !');
      setErrorMsg(null);
    } else {
      setErrorMsg('Clé de licence non reconnue. Format attendu : PRO-XXXX-XXXX');
      setSuccessMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Licence ChantierPro</h3>
              <p className="text-xs text-slate-400">Statut de la licence Android BTP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Statut actuel :</span>
              <span className={`font-bold px-2 py-0.5 rounded ${license.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {license.isValid ? 'Licence Pro Activée' : 'Version Démo / Essai'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Identifiant Appareil :</span>
              <span className="font-mono text-slate-300">{license.deviceId}</span>
            </div>
            {license.expiresAt && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Expiration :</span>
                <span className="text-slate-300">{new Date(license.expiresAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleActivate} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Activer une clé de licence</label>
              <input
                type="text"
                placeholder="PRO-BTP-2026-XXXX"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500 uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md transition-colors"
            >
              Activer la licence
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
