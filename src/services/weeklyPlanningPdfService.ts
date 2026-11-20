import { jsPDF } from 'jspdf';
import { Site, Worker, AttendanceRecord } from '../types';

export function generateWeeklyPlanningPdf(site: Site, workers: Worker[], attendance: AttendanceRecord[], targetDateStr: string): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const targetDate = new Date(targetDateStr);
  // Get Monday of this week
  const day = targetDate.getDay();
  const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(targetDate.setDate(diff));

  const weekDays: { dateStr: string; label: string }[] = [];
  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const parts = dateStr.split('-');
    weekDays.push({
      dateStr,
      label: `${dayNames[i]} ${parts[2]}/${parts[1]}`
    });
  }

  // Header Box
  doc.setFillColor(11, 19, 43); // Dark navy #0B132B
  doc.rect(0, 0, 297, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(245, 158, 11); // Amber #F59E0B
  doc.text("CHANTIERPRO BTP — PLANNING HEBDOMADAIRE DU PERSONNEL", 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Chantier : ${site.name} • Client : ${site.client} • Wilaya : ${site.address}`, 14, 18);
  doc.text(`Semaine du ${weekDays[0].dateStr} au ${weekDays[5].dateStr} • Chef de Chantier : ${site.managerName || 'Belaid Mounir'}`, 14, 23);

  // Table Header
  let y = 36;
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(14, y, 269, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(245, 158, 11);
  doc.text("N°", 16, y + 5.5);
  doc.text("NOM & PRÉNOM", 24, y + 5.5);
  doc.text("CORPS D'ÉTAT", 68, y + 5.5);
  doc.text("TARIF", 100, y + 5.5);

  let xDay = 120;
  weekDays.forEach((wd) => {
    doc.text(wd.label, xDay, y + 5.5);
    xDay += 23;
  });
  doc.text("TOTAL", 260, y + 5.5);

  // Rows
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  const activeWorkers = workers.filter((w) => w.active);

  activeWorkers.forEach((w, idx) => {
    if (y > 185) {
      doc.addPage();
      y = 20;
    }

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 269, 7, 'F');
    }

    doc.rect(14, y, 269, 7, 'S');

    doc.text(String(idx + 1), 16, y + 5);
    doc.text(w.name, 24, y + 5);
    doc.text(w.craft, 68, y + 5);
    doc.text(`${w.rate} ${site.currency || 'DZD'}`, 100, y + 5);

    let workerTotalDays = 0;
    let xD = 120;
    weekDays.forEach((wd) => {
      const rec = attendance.find((a) => a.workerId === w.id && a.date === wd.dateStr && a.siteId === site.id);
      let cellText = '—';
      if (rec) {
        if (rec.status === 'present') {
          cellText = 'P (8h)';
          workerTotalDays += 1;
        } else if (rec.status === 'late') {
          cellText = 'R (8h)';
          workerTotalDays += 1;
        } else if (rec.status === 'half') {
          cellText = '1/2 (4h)';
          workerTotalDays += 0.5;
        } else if (rec.status === 'absent') {
          cellText = 'ABS';
        }
        if (rec.overtimeHours && rec.overtimeHours > 0) {
          cellText += ` +${rec.overtimeHours}h`;
        }
      }
      doc.text(cellText, xD, y + 5);
      xD += 23;
    });

    doc.setFont('helvetica', 'bold');
    doc.text(`${workerTotalDays} j`, 260, y + 5);
    doc.setFont('helvetica', 'normal');

    y += 7;
  });

  // Footer Signatures
  y = Math.min(y + 12, 190);
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Document officiel généré par ChantierPro BTP • ${new Date().toLocaleDateString('fr-FR')}`, 14, y);

  doc.text("Visa Chef de Chantier (Belaid Mounir) :", 180, y);
  doc.rect(180, y + 2, 70, 15, 'S');

  doc.save(`Planning_Hebdo_${site.name.replace(/\s+/g, '_')}_${weekDays[0].dateStr}.pdf`);
}
