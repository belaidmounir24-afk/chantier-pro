import { jsPDF } from 'jspdf';
import { Site, Worker, AttendanceRecord, DailyExpense, Advance, SiteLog } from '../types';

export interface ReportPdfData {
  site: Site;
  startDate: string;
  endDate: string;
  workers: Worker[];
  attendance: AttendanceRecord[];
  expenses: DailyExpense[];
  advances: Advance[];
  logs: SiteLog[];
}

export function generatePeriodReportPdf(data: ReportPdfData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Box
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(245, 158, 11); // amber-500
  doc.text("CHANTIERPRO BTP — RAPPORT DE SYNTHÈSE", 15, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(241, 245, 249);
  doc.text(`Chantier : ${data.site.name} • Client : ${data.site.client}`, 15, 22);
  doc.text(`Période du ${data.startDate} au ${data.endDate} • Devise : ${data.site.currency || 'DZD'}`, 15, 27);

  // Stats Summary
  let y = 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. BILAN FINANCIER & MAIN D'ŒUVRE", 15, y);

  y += 7;
  const filteredAttendance = data.attendance.filter(
    (a) => a.siteId === data.site.id && a.date >= data.startDate && a.date <= data.endDate
  );
  const filteredExpenses = data.expenses.filter(
    (e) => e.siteId === data.site.id && e.date >= data.startDate && e.date <= data.endDate
  );
  const filteredAdvances = data.advances.filter(
    (a) => a.siteId === data.site.id && a.date >= data.startDate && a.date <= data.endDate
  );

  let totalSalaries = 0;
  for (const w of data.workers) {
    const present = filteredAttendance.filter((a) => a.workerId === w.id && a.status === 'present').length;
    const half = filteredAttendance.filter((a) => a.workerId === w.id && a.status === 'half').length;
    totalSalaries += (present + half * 0.5) * w.rate;
  }

  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const totalAdvances = filteredAdvances.reduce((s, a) => s + a.amount, 0);
  const totalSiteCost = totalSalaries + totalExpenses;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`• Total Salaires & Main d'œuvre dus : ${totalSalaries.toLocaleString()} ${data.site.currency}`, 18, y);
  y += 5;
  doc.text(`• Total Acomptes versés aux ouvriers : ${totalAdvances.toLocaleString()} ${data.site.currency}`, 18, y);
  y += 5;
  doc.text(`• Total Dépenses de chantier (achats/carburant) : ${totalExpenses.toLocaleString()} ${data.site.currency}`, 18, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`• Coût Global Périodique du Chantier : ${totalSiteCost.toLocaleString()} ${data.site.currency}`, 18, y);

  // Worker detail section
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text("2. DÉTAIL PAR OUVRIER (POINTAGE & ACOMPTES)", 15, y);
  y += 6;

  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 180, 7, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Ouvrier / Métier", 18, y + 5);
  doc.text("Jours", 90, y + 5);
  doc.text("Gagné", 115, y + 5);
  doc.text("Acomptes", 145, y + 5);
  doc.text("Net à payer", 175, y + 5);
  y += 8;

  doc.setFont('helvetica', 'normal');
  for (const w of data.workers) {
    const present = filteredAttendance.filter((a) => a.workerId === w.id && a.status === 'present').length;
    const half = filteredAttendance.filter((a) => a.workerId === w.id && a.status === 'half').length;
    const days = present + half * 0.5;
    const earned = days * w.rate;
    const adv = filteredAdvances.filter((a) => a.workerId === w.id).reduce((s, a) => s + a.amount, 0);
    const net = Math.max(0, earned - adv);

    doc.setTextColor(15, 23, 42);
    doc.text(`${w.name} (${w.craft})`, 18, y);
    doc.text(`${days} j`, 90, y);
    doc.text(`${earned.toLocaleString()}`, 115, y);
    doc.text(`${adv.toLocaleString()}`, 145, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${net.toLocaleString()}`, 175, y);
    doc.setFont('helvetica', 'normal');

    y += 5.5;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }

  // Signature box
  y = Math.max(y + 10, 240);
  doc.setDrawColor(203, 213, 225);
  doc.rect(120, y, 75, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("LE CONDUCTEUR DE TRAVAUX / CHEF DE CHANTIER", 157.5, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Signature et visa du responsable", 157.5, y + 12, { align: 'center' });

  doc.save(`Rapport_ChantierPro_${data.site.name.replace(/[^a-zA-Z0-9]/g, '_')}_${data.startDate}.pdf`);
}
