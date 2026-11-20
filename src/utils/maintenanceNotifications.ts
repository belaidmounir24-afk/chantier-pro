import { Equipment, MaintenanceAlert } from '../types';

export function getEquipmentMaintenanceAlerts(equipmentList: Equipment[]): MaintenanceAlert[] {
  const alerts: MaintenanceAlert[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const eq of equipmentList) {
    const dueDateStr = eq.nextMaintenanceDate || eq.nextMaintenanceDue;
    if (!dueDateStr) continue;

    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7 || eq.status === 'breakdown' || eq.status === 'needs_maintenance') {
      const isOverdue = diffDays < 0;
      let urgency: 'low' | 'medium' | 'high' = 'low';

      if (isOverdue || eq.status === 'breakdown') {
        urgency = 'high';
      } else if (diffDays <= 3) {
        urgency = 'medium';
      }

      const msg = isOverdue
        ? `Échéance dépassée de ${Math.abs(diffDays)} jour(s)`
        : diffDays === 0
        ? "Révision prévue aujourd'hui"
        : `Révision dans ${diffDays} jour(s)`;

      alerts.push({
        id: `alert-${eq.id}`,
        equipmentId: eq.id,
        equipmentName: `${eq.name} (${eq.brand || eq.type})`,
        message: msg,
        dueDate: dueDateStr,
        isOverdue,
        daysRemaining: diffDays,
        urgency
      });
    }
  }

  return alerts;
}

export function playMaintenanceChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch {
    // Audio context not allowed or not supported
  }
}
