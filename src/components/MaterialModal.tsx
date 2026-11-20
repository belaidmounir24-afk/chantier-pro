import React, { useState } from 'react';
import { Material, StockMovement, Site } from '../types';
import { X, Boxes, ArrowDownRight, ArrowUpRight, AlertTriangle } from 'lucide-react';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSite: Site;
  onSaveMaterial: (material: Material) => void;
  initialMaterial?: Material | null;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  currentSite,
  onSaveMaterial,
  initialMaterial
}) => {
  const [name, setName] = useState(initialMaterial?.name || '');
  const [category, setCategory] = useState(initialMaterial?.category || 'Gros Œuvre');
  const [unit, setUnit] = useState(initialMaterial?.unit || 'Sacs');
  const [currentStock, setCurrentStock] = useState(initialMaterial?.currentStock || 100);
  const [minThreshold, setMinThreshold] = useState(initialMaterial?.minThreshold || 20);
  const [unitCost, setUnitCost] = useState(initialMaterial?.unitCost || 850);
  const [supplier, setSupplier] = useState(initialMaterial?.supplier || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const material: Material = {
      id: initialMaterial?.id || `mat-${Date.now()}`,
      siteId: currentSite.id,
      name: name.trim(),
      category: category.trim(),
      unit: unit.trim(),
      currentStock: Number(currentStock),
      minThreshold: Number(minThreshold),
      unitCost: Number(unitCost),
      supplier: supplier.trim() || undefined
    };

    onSaveMaterial(material);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">
                {initialMaterial ? 'Modifier Matériau' : 'Nouveau Matériau'}
              </h3>
              <p className="text-xs text-slate-400">Gestion du stock et seuil d'alerte</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nom du matériau</label>
            <input
              type="text"
              placeholder="Ex: Ciment CPJ 42.5, Rond à béton Ø12, Sable d'Oued..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Catégorie</label>
              <input
                type="text"
                placeholder="Ex: Maçonnerie, Électricité..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Unité</label>
              <input
                type="text"
                placeholder="Ex: Sacs, m³, Tonnes, Unités..."
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Stock Initial</label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Seuil Alerte Min</label>
              <input
                type="number"
                min="0"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Coût Unitaire ({currentSite.currency})
              </label>
              <input
                type="number"
                min="0"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Fournisseur</label>
              <input
                type="text"
                placeholder="Ex: Cimenterie Lafarge"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-colors"
            >
              {initialMaterial ? 'Mettre à jour' : 'Enregistrer Matériau'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  preselectedMaterialId?: string | null;
  onSaveMovement: (movement: StockMovement) => void;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  onClose,
  materials,
  preselectedMaterialId,
  onSaveMovement
}) => {
  const [materialId, setMaterialId] = useState(preselectedMaterialId || materials[0]?.id || '');
  const [type, setType] = useState<'in' | 'out'>('out');
  const [quantity, setQuantity] = useState<number>(10);
  const [reason, setReason] = useState('Coulage radier / dalles');
  const [recipient, setRecipient] = useState("Chef d'équipe BTP");

  if (!isOpen) return null;

  const selectedMaterial = materials.find((m) => m.id === materialId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialId || quantity <= 0) return;

    const movement: StockMovement = {
      id: `mvt-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      materialId,
      type,
      quantity: Number(quantity),
      reason: reason.trim(),
      recipient: recipient.trim() || undefined
    };

    onSaveMovement(movement);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${type === 'in' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {type === 'in' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-100">
                {type === 'in' ? 'Réception Matériaux (Entrée)' : 'Sortie / Consommation Matériau'}
              </h3>
              <p className="text-xs text-slate-400">Mouvement de stock temps réel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex gap-2 p-1 bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType('out')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                type === 'out' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sortie / Consommation
            </button>
            <button
              type="button"
              onClick={() => setType('in')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                type === 'in' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrée / Livraison
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Matériau concerné</label>
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              required
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (Dispo : {m.currentStock} {m.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Quantité ({selectedMaterial?.unit || 'unités'})
            </label>
            <input
              type="number"
              min="0.5"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Motif / Destination</label>
            <input
              type="text"
              placeholder="Ex: Poteaux RDC, Ferraillage voile 3..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Bénéficiaire / Équipe</label>
            <input
              type="text"
              placeholder="Ex: Équipe Maçons, Électricien sous-traitant..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-colors ${
                type === 'in' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              Valider le mouvement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
