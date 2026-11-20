import { Worker, AttendanceRecord, Advance, DailyExpense, CashInflow } from '../types';

export function calculateWorkerDailyWage(worker: Worker): number {
  return worker.rate || 0;
}

export function calculateWorkerPeriodStats(
  worker: Worker,
  attendanceRecords: AttendanceRecord[],
  advances: Advance[],
  startDate?: string,
  endDate?: string
) {
  const filteredAttendance = attendanceRecords.filter((att) => {
    if (att.workerId !== worker.id) return false;
    if (startDate && att.date < startDate) return false;
    if (endDate && att.date > endDate) return false;
    return true;
  });

  const presentDays = filteredAttendance.filter((a) => a.status === 'present').length;
  const halfDays = filteredAttendance.filter((a) => a.status === 'half').length;
  const totalDaysWorked = presentDays + halfDays * 0.5;

  const totalEarned = totalDaysWorked * worker.rate;

  const filteredAdvances = advances.filter((adv) => {
    if (adv.workerId !== worker.id) return false;
    if (startDate && adv.date < startDate) return false;
    if (endDate && adv.date > endDate) return false;
    return true;
  });

  const totalAdvances = filteredAdvances.reduce((sum, a) => sum + a.amount, 0);
  const netDue = Math.max(0, totalEarned - totalAdvances);

  return {
    totalDaysWorked,
    presentDays,
    halfDays,
    totalEarned,
    totalAdvances,
    netDue
  };
}

export function calculateSiteCashBalance(
  inflows: CashInflow[],
  expenses: DailyExpense[],
  advances: Advance[],
  siteId: string
) {
  const siteInflows = inflows.filter((i) => i.siteId === siteId);
  const siteExpenses = expenses.filter((e) => e.siteId === siteId);
  const siteAdvances = advances.filter((a) => a.siteId === siteId);

  const totalIn = siteInflows.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = siteExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalAdvances = siteAdvances.reduce((sum, a) => sum + a.amount, 0);

  const totalOut = totalExpenses + totalAdvances;
  const currentBalance = totalIn - totalOut;

  return {
    totalIn,
    totalExpenses,
    totalAdvances,
    totalOut,
    currentBalance
  };
}
