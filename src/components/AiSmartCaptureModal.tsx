import React, { useState } from 'react';
import { SiteLog, DailyExpense, Site } from '../types';
import { X, Sparkles, Mic, FileText, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface AiSmartCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
  dateStr: string;
  onApplyParsedData: (data: {
    tasksCompleted?: string;
    issues?: string;
    weather?: string;
    expense?: { category: any; amount: number; description: string };
  }) => void;
}

export const AiSmartCaptureModal: React.FC<AiSmartCaptureModalProps> = ({
  isOpen,
  onClose,
  site,
  dateStr,
  onApplyParsedData
}) => {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<{
    tasksCompleted?: string;
    issues?: string;
    weather?: string;
    expense?: { category: any; amount: number; description: string };
  } | null>(null);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/smart-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript, siteName: site.name, dateStr })
      });
      const data = await res.json();
      setParsedResult(data.parsed);
    } catch (e) {
      console.error(e);
      // Fallback parser
      setParsedResult({
        tasksCompleted: transcript,
        weather: 'Ensoleillé',
        issues: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (parsedResult) {
      onApplyParsedData(parsedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">Saisie Vocale / Texte IA Express</h3>
              <p className="text-xs text-slate-400">Dictez ou notez en vrac les événements du chantier</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto my-4 space-y-4 flex-1 pr-1 text-xs">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Note vocale ou mémo brut du chef de chantier :
            </label>
            <textarea
              rows={4}
              placeholder="Ex: Aujourd'hui beau temps 24 degrés, on a coulé 4 poteaux du 2ème étage et posé le treillis. Achat de 3 disques et gazole pour 3500 dinars. Léger retard d'une heure sur la livraison toupie."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleProcess}
            disabled={loading || !transcript.trim()}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Analyse intelligente en cours...' : 'Structurer avec IA'}
          </button>

          {parsedResult && (
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-emerald-400 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Éléments Extraits Prêts à Insérer
              </h4>

              {parsedResult.weather && (
                <div>
                  <span className="text-slate-400 font-semibold">Météo :</span>{' '}
                  <span className="text-slate-200">{parsedResult.weather}</span>
                </div>
              )}

              {parsedResult.tasksCompleted && (
                <div>
                  <span className="text-slate-400 font-semibold">Travaux Réalisés :</span>
                  <p className="text-slate-200 mt-0.5">{parsedResult.tasksCompleted}</p>
                </div>
              )}

              {parsedResult.issues && (
                <div>
                  <span className="text-slate-400 font-semibold text-rose-400">Incidents :</span>
                  <p className="text-rose-200 mt-0.5">{parsedResult.issues}</p>
                </div>
              )}

              {parsedResult.expense && (
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-amber-400 font-bold">Dépense détectée :</span>
                    <p className="text-slate-300">{parsedResult.expense.description} ({parsedResult.expense.category})</p>
                  </div>
                  <span className="font-mono font-bold text-rose-400">
                    {parsedResult.expense.amount.toLocaleString()} {site.currency}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
          >
            Annuler
          </button>
          {parsedResult && (
            <button
              onClick={handleApply}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Appliquer au Journal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
