import React, { useState, useEffect, useMemo } from 'react';
import {
  ChantierDb,
  Site,
  Worker,
  Advance,
  DailyExpense,
  CashInflow,
  CashAudit,
  Material,
  StockMovement,
  Equipment,
  SiteLog,
  SiteTask,
  AttendanceRecord,
  AttendanceStatus,
  TabType,
  MaintenanceRecord,
  MaintenanceAlert,
  AppLicense
} from './types';
import { StorageService, getTodayDateString } from './services/storage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AttendanceView } from './components/AttendanceView';
import { TasksView } from './components/TasksView';
import { WorkersView } from './components/WorkersView';
import { ExpensesView } from './components/ExpensesView';
import { MaterialsView } from './components/MaterialsView';
import { DailyLogView } from './components/DailyLogView';
import { ReportsView } from './components/ReportsView';
import { ScanIaModal } from './components/ScanIaModal';
import { SiteModal } from './components/SiteModal';
import { WorkerModal } from './components/WorkerModal';
import { AdvanceModal } from './components/AdvanceModal';
import { AdvanceReceiptModal } from './components/AdvanceReceiptModal';
import { ExpenseModal } from './components/ExpenseModal';
import { ExpenseReceiptModal } from './components/ExpenseReceiptModal';
import { CashInflowModal } from './components/CashInflowModal';
import { CashAuditModal } from './components/CashAuditModal';
import { MaterialModal, StockMovementModal } from './components/MaterialModal';
import { EquipmentModal } from './components/EquipmentModal';
import { MaintenanceLogModal } from './components/MaintenanceLogModal';
import { MaintenanceNotificationCenter } from './components/MaintenanceNotificationCenter';
import { MaintenanceToast } from './components/MaintenanceToast';
import { BackupModal } from './components/BackupModal';
import { PrintDailyPV } from './components/PrintDailyPV';
import { PeriodReportModal } from './components/PeriodReportModal';
import { GlobalSearch } from './components/GlobalSearch';
import { LicenseModal } from './components/LicenseModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { PrivacyModal } from './components/PrivacyModal';
import { ShareAppModal } from './components/ShareAppModal';
import { PermissionsModal } from './components/PermissionsModal';
import { UpdateModal } from './components/UpdateModal';
import { UpdateBanner } from './components/UpdateBanner';
import { AiPerformanceHub } from './components/AiPerformanceHub';
import { AiRecruitmentGeneratorModal } from './components/AiRecruitmentGeneratorModal';
import { AiWorkforceAuditModal } from './components/AiWorkforceAuditModal';
import { AiSmartCaptureModal } from './components/AiSmartCaptureModal';
import { calculateSiteCashBalance } from './utils/calculations';
import { getEquipmentMaintenanceAlerts, playMaintenanceChime } from './utils/maintenanceNotifications';
import { triggerHaptic } from './utils/android';

export default function App() {
  // Database state
  const [db, setDb] = useState<ChantierDb>(() => StorageService.load());
  const [currentSiteId, setCurrentSiteId] = useState<string>(() => {
    return db.sites[0]?.id || 'site-bouroyeh';
  });
  const [currentTab, setCurrentTab] = useState<TabType>('pointage');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Modals state
  const [scanIaModalOpen, setScanIaModalOpen] = useState(false);
  const [siteModalOpen, setSiteModalOpen] = useState(false);
  const [workerModalOpen, setWorkerModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [preselectedWorkerIdForAdvance, setPreselectedWorkerIdForAdvance] = useState<string | null>(null);
  const [advanceReceiptModalOpen, setAdvanceReceiptModalOpen] = useState(false);
  const [receiptAdvance, setReceiptAdvance] = useState<Advance | null>(null);
  const [receiptWorker, setReceiptWorker] = useState<Worker | null>(null);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expenseReceiptModalOpen, setExpenseReceiptModalOpen] = useState(false);
  const [receiptExpense, setReceiptExpense] = useState<DailyExpense | null>(null);

  const [cashInflowModalOpen, setCashInflowModalOpen] = useState(false);
  const [cashAuditModalOpen, setCashAuditModalOpen] = useState(false);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [stockMovementModalOpen, setStockMovementModalOpen] = useState(false);
  const [preselectedMaterialIdForMvt, setPreselectedMaterialIdForMvt] = useState<string | null>(null);

  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [maintenanceLogModalOpen, setMaintenanceLogModalOpen] = useState(false);
  const [selectedEquipmentForMaintenance, setSelectedEquipmentForMaintenance] = useState<Equipment | null>(null);
  const [maintenanceCenterOpen, setMaintenanceCenterOpen] = useState(false);
  const [toastAlertsDismissed, setToastAlertsDismissed] = useState(false);

  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [dailyPVModalOpen, setDailyPVModalOpen] = useState(false);
  const [periodReportModalOpen, setPeriodReportModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [androidInstallModalOpen, setAndroidInstallModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [shareAppModalOpen, setShareAppModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  // AI Hub modals
  const [aiHubOpen, setAiHubOpen] = useState(false);
  const [aiRecruitmentOpen, setAiRecruitmentOpen] = useState(false);
  const [aiAuditOpen, setAiAuditOpen] = useState(false);
  const [aiSmartCaptureOpen, setAiSmartCaptureOpen] = useState(false);

  // Reload DB handler
  const handleReloadDb = () => {
    setDb(StorageService.load());
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active site
  const currentSite = useMemo(() => {
    return db.sites.find((s) => s.id === currentSiteId) || db.sites[0];
  }, [db.sites, currentSiteId]);

  // Maintenance alerts for current site equipments
  const currentSiteEquipments = useMemo(() => {
    return db.equipment.filter((e) => e.siteId === currentSite?.id);
  }, [db.equipment, currentSite?.id]);

  const maintenanceAlerts = useMemo(() => {
    return getEquipmentMaintenanceAlerts(currentSiteEquipments);
  }, [currentSiteEquipments]);

  // Site cash balance
  const cashBalance = useMemo(() => {
    if (!currentSite) return 0;
    const balanceObj = calculateSiteCashBalance(db.cashInflows, db.expenses, db.advances, currentSite.id);
    return typeof balanceObj === 'number' ? balanceObj : balanceObj.currentBalance;
  }, [currentSite, db.cashInflows, db.expenses, db.advances]);

  // Current site log
  const currentSiteLog = useMemo(() => {
    if (!currentSite) return null;
    return (
      db.logs.find((l) => l.siteId === currentSite.id && l.date === selectedDate) || {
        id: `log-${currentSite.id}-${selectedDate}`,
        date: selectedDate,
        siteId: currentSite.id,
        weather: 'Ensoleillé',
        temperature: '22°C',
        tasksCompleted: '',
        issuesEncountered: '',
        safetyNotes: 'Port des casques et chaussures de sécurité vérifié sur le chantier.'
      }
    );
  }, [db.logs, currentSite, selectedDate]);

  // --- Handlers ---
  const handleSelectTab = (tab: TabType) => {
    triggerHaptic('light');
    if (tab === 'ia') {
      setAiHubOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  const handleUpdateAttendance = (workerId: string, status: AttendanceStatus, hours?: number, overtime?: number) => {
    triggerHaptic('medium');
    const existingIndex = db.attendance.findIndex(
      (a) => a.siteId === currentSite.id && a.date === selectedDate && a.workerId === workerId
    );

    const record: AttendanceRecord = {
      id: existingIndex >= 0 ? db.attendance[existingIndex].id : `att-${selectedDate}-${workerId}`,
      siteId: currentSite.id,
      date: selectedDate,
      workerId,
      status,
      hours: hours !== undefined ? hours : status === 'half' ? 4 : status === 'absent' ? 0 : 8,
      overtimeHours: overtime !== undefined ? overtime : existingIndex >= 0 ? db.attendance[existingIndex].overtimeHours : 0,
      lateMinutes: status === 'late' ? 30 : 0
    };

    StorageService.saveAttendance(record);
    handleReloadDb();
  };

  const handleMarkAllPresent = () => {
    triggerHaptic('success');
    db.workers.forEach((worker) => {
      const record: AttendanceRecord = {
        id: `att-${selectedDate}-${worker.id}`,
        siteId: currentSite.id,
        date: selectedDate,
        workerId: worker.id,
        status: 'present',
        hours: 8,
        overtimeHours: 0,
        lateMinutes: 0
      };
      StorageService.saveAttendance(record);
    });
    handleReloadDb();
  };

  const handleApplyScanAttendance = (records: { workerId: string; status: AttendanceStatus; overtimeHours?: number }[]) => {
    records.forEach((r) => {
      handleUpdateAttendance(r.workerId, r.status, r.status === 'absent' ? 0 : 8, r.overtimeHours || 0);
    });
  };

  const handleSaveWorker = (worker: Worker) => {
    StorageService.saveWorker(worker);
    handleReloadDb();
    setWorkerModalOpen(false);
  };

  const handleOpenAdvanceModalForWorker = (worker?: Worker) => {
    setPreselectedWorkerIdForAdvance(worker?.id || null);
    setAdvanceModalOpen(true);
  };

  const handleSaveAdvance = (advance: Advance) => {
    StorageService.saveAdvance(advance);
    handleReloadDb();
    const w = db.workers.find((worker) => worker.id === advance.workerId) || null;
    setReceiptAdvance(advance);
    setReceiptWorker(w);
    setAdvanceReceiptModalOpen(true);
  };

  const handleSaveExpense = (expense: DailyExpense) => {
    StorageService.saveExpense(expense);
    handleReloadDb();
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Supprimer cette dépense de caisse ?')) {
      StorageService.deleteExpense(expenseId);
      handleReloadDb();
    }
  };

  const handleSaveInflow = (inflow: CashInflow) => {
    StorageService.saveCashInflow(inflow);
    handleReloadDb();
  };

  const handleSaveAudit = (audit: CashAudit) => {
    StorageService.saveCashAudit(audit);
    handleReloadDb();
  };

  const handleSaveMaterial = (material: Material) => {
    StorageService.saveMaterial(material);
    handleReloadDb();
  };

  const handleOpenMovementModal = (material: Material, type: 'reception' | 'consommation') => {
    setPreselectedMaterialIdForMvt(material.id);
    setStockMovementModalOpen(true);
  };

  const handleSaveMovement = (movement: StockMovement) => {
    StorageService.saveStockMovement(movement);
    handleReloadDb();
  };

  const handleSaveEquipment = (equipment: Equipment) => {
    StorageService.saveEquipment(equipment);
    handleReloadDb();
  };

  const handleOpenMaintenanceLogModal = (equipment: Equipment) => {
    setSelectedEquipmentForMaintenance(equipment);
    setMaintenanceLogModalOpen(true);
  };

  const handleSaveMaintenanceLog = (log: MaintenanceRecord, nextDueDate: string) => {
    StorageService.saveMaintenanceRecord(log, nextDueDate);
    handleReloadDb();
  };

  const handleSaveSiteLog = (log: SiteLog) => {
    StorageService.saveSiteLog(log);
    handleReloadDb();
  };

  const handleSaveSite = (site: Site) => {
    StorageService.saveSite(site);
    setCurrentSiteId(site.id);
    handleReloadDb();
  };

  const handleSaveTask = (task: SiteTask) => {
    StorageService.saveTask(task);
    handleReloadDb();
  };

  const handleDeleteTask = (taskId: string) => {
    StorageService.deleteTask(taskId);
    handleReloadDb();
  };

  const handleAddMultipleWorkers = (newWorkers: Worker[]) => {
    newWorkers.forEach((w) => StorageService.saveWorker(w));
    handleReloadDb();
  };

  const handleApplySmartCapture = (data: {
    tasksCompleted?: string;
    issues?: string;
    weather?: string;
    expense?: { category: any; amount: number; description: string };
  }) => {
    if (!currentSite) return;

    const updatedLog: SiteLog = {
      ...currentSiteLog!,
      tasksCompleted: data.tasksCompleted
        ? `${currentSiteLog?.tasksCompleted ? currentSiteLog.tasksCompleted + '\n' : ''}${data.tasksCompleted}`
        : currentSiteLog?.tasksCompleted || '',
      issuesEncountered: data.issues
        ? `${currentSiteLog?.issuesEncountered ? currentSiteLog.issuesEncountered + '\n' : ''}${data.issues}`
        : currentSiteLog?.issuesEncountered || '',
      weather: data.weather || currentSiteLog?.weather || 'Ensoleillé'
    };

    StorageService.saveSiteLog(updatedLog);

    if (data.expense && data.expense.amount > 0) {
      const exp: DailyExpense = {
        id: `exp-${Date.now()}`,
        date: selectedDate,
        siteId: currentSite.id,
        category: data.expense.category || 'materiaux',
        amount: data.expense.amount,
        description: data.expense.description || 'Achat mémo IA'
      };
      StorageService.saveExpense(exp);
    }

    handleReloadDb();
  };

  if (!currentSite) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-sans">
        Chargement de ChantierPro...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none sm:select-auto">
      {/* Optional Update Banner */}
      {showUpdateBanner && (
        <UpdateBanner
          onOpenUpdate={() => setUpdateModalOpen(true)}
          onDismiss={() => setShowUpdateBanner(false)}
        />
      )}

      {/* Top Header matching exact screenshot */}
      <Header
        sites={db.sites}
        currentSite={currentSite}
        onSelectSite={(id) => setCurrentSiteId(id)}
        onOpenNewSiteModal={() => setSiteModalOpen(true)}
        workers={db.workers}
        attendance={db.attendance}
        todayStr={selectedDate}
        maintenanceAlerts={maintenanceAlerts}
        onOpenMaintenanceCenter={() => setMaintenanceCenterOpen(true)}
        onOpenAiHub={() => setAiHubOpen(true)}
        onOpenScanIa={() => setScanIaModalOpen(true)}
        onOpenSearch={() => setGlobalSearchOpen(true)}
        onOpenBackup={() => setBackupModalOpen(true)}
        onOpenLicense={() => setLicenseModalOpen(true)}
        onOpenWorkersModal={() => setCurrentTab('paie')}
      />

      {/* Floating Maintenance Toast */}
      {!toastAlertsDismissed && maintenanceAlerts.length > 0 && (
        <MaintenanceToast
          alerts={maintenanceAlerts}
          onOpenCenter={() => setMaintenanceCenterOpen(true)}
          onDismiss={() => setToastAlertsDismissed(true)}
        />
      )}

      {/* Main Tab Views */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {(currentTab === 'pointage' || currentTab === 'dash') && (
          <AttendanceView
            site={currentSite}
            workers={db.workers}
            attendance={db.attendance}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            onUpdateAttendance={handleUpdateAttendance}
            onMarkAllPresent={handleMarkAllPresent}
            onOpenNewWorkerModal={() => {
              setEditingWorker(null);
              setWorkerModalOpen(true);
            }}
            onOpenAdvanceModal={handleOpenAdvanceModalForWorker}
            onOpenPrintPV={() => setDailyPVModalOpen(true)}
            onOpenScanIa={() => setScanIaModalOpen(true)}
            onNavigateTab={handleSelectTab}
          />
        )}

        {currentTab === 'taches' && (
          <TasksView
            site={currentSite}
            tasks={db.tasks || []}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {(currentTab === 'paie' || currentTab === 'team') && (
          <WorkersView
            site={currentSite}
            workers={db.workers}
            advances={db.advances}
            attendance={db.attendance}
            onOpenNewWorkerModal={() => {
              setEditingWorker(null);
              setWorkerModalOpen(true);
            }}
            onEditWorker={(worker) => {
              setEditingWorker(worker);
              setWorkerModalOpen(true);
            }}
            onOpenAdvanceModal={handleOpenAdvanceModalForWorker}
            onOpenReceiptModal={(adv, worker) => {
              setReceiptAdvance(adv);
              setReceiptWorker(worker);
              setAdvanceReceiptModalOpen(true);
            }}
            onOpenAiGenerator={() => setAiRecruitmentOpen(true)}
          />
        )}

        {(currentTab === 'stock' || currentTab === 'mat') && (
          <MaterialsView
            site={currentSite}
            materials={db.materials}
            movements={db.movements}
            equipment={db.equipment}
            maintenanceRecords={db.maintenanceRecords}
            onOpenNewMaterialModal={() => {
              setEditingMaterial(null);
              setMaterialModalOpen(true);
            }}
            onOpenMovementModal={handleOpenMovementModal}
            onOpenNewEquipmentModal={() => {
              setEditingEquipment(null);
              setEquipmentModalOpen(true);
            }}
            onOpenMaintenanceModal={handleOpenMaintenanceLogModal}
          />
        )}

        {(currentTab === 'caisse' || currentTab === 'expenses') && (
          <ExpensesView
            site={currentSite}
            expenses={db.expenses}
            inflows={db.cashInflows}
            advances={db.advances}
            onOpenNewExpenseModal={() => setExpenseModalOpen(true)}
            onOpenInflowModal={() => setCashInflowModalOpen(true)}
            onOpenAuditModal={() => setCashAuditModalOpen(true)}
          />
        )}

        {(currentTab === 'journal' || currentTab === 'log') && (
          <DailyLogView
            site={currentSite}
            logs={db.logs}
            workers={db.workers}
            attendance={db.attendance}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            onSaveLog={handleSaveSiteLog}
            onOpenPrintPV={() => setDailyPVModalOpen(true)}
          />
        )}

        {(currentTab === 'rapports' || currentTab === 'reports') && (
          <ReportsView
            site={currentSite}
            workers={db.workers}
            advances={db.advances}
            attendance={db.attendance}
            expenses={db.expenses}
            logs={db.logs}
            onOpenPeriodReport={() => setPeriodReportModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation matching screenshot */}
      <Navigation currentTab={currentTab} onSelectTab={handleSelectTab} />

      {/* Scan IA Modal */}
      <ScanIaModal
        isOpen={scanIaModalOpen}
        onClose={() => setScanIaModalOpen(false)}
        site={currentSite}
        dateStr={selectedDate}
        workers={db.workers}
        onApplyAttendance={handleApplyScanAttendance}
      />

      {/* Modals & Dialogs */}
      <WorkerModal
        isOpen={workerModalOpen}
        onClose={() => setWorkerModalOpen(false)}
        onSaveWorker={handleSaveWorker}
        initialWorker={editingWorker}
        currency={currentSite.currency}
      />

      <AdvanceModal
        isOpen={advanceModalOpen}
        onClose={() => setAdvanceModalOpen(false)}
        workers={db.workers}
        currentSite={currentSite}
        preselectedWorkerId={preselectedWorkerIdForAdvance}
        onSaveAdvance={handleSaveAdvance}
      />

      <AdvanceReceiptModal
        isOpen={advanceReceiptModalOpen}
        onClose={() => setAdvanceReceiptModalOpen(false)}
        advance={receiptAdvance}
        worker={receiptWorker}
        site={currentSite}
      />

      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        currentSite={currentSite}
        onSaveExpense={handleSaveExpense}
      />

      <ExpenseReceiptModal
        isOpen={expenseReceiptModalOpen}
        onClose={() => setExpenseReceiptModalOpen(false)}
        expense={receiptExpense}
        site={currentSite}
      />

      <CashInflowModal
        isOpen={cashInflowModalOpen}
        onClose={() => setCashInflowModalOpen(false)}
        currentSite={currentSite}
        onSaveInflow={handleSaveInflow}
      />

      <CashAuditModal
        isOpen={cashAuditModalOpen}
        onClose={() => setCashAuditModalOpen(false)}
        currentSite={currentSite}
        theoreticalBalance={cashBalance}
        onSaveAudit={handleSaveAudit}
      />

      <MaterialModal
        isOpen={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        currentSite={currentSite}
        onSaveMaterial={handleSaveMaterial}
        initialMaterial={editingMaterial}
      />

      <StockMovementModal
        isOpen={stockMovementModalOpen}
        onClose={() => setStockMovementModalOpen(false)}
        materials={db.materials.filter((m) => m.siteId === currentSite.id)}
        preselectedMaterialId={preselectedMaterialIdForMvt}
        onSaveMovement={handleSaveMovement}
      />

      <EquipmentModal
        isOpen={equipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        currentSite={currentSite}
        onSaveEquipment={handleSaveEquipment}
        initialEquipment={editingEquipment}
      />

      <MaintenanceLogModal
        isOpen={maintenanceLogModalOpen}
        onClose={() => setMaintenanceLogModalOpen(false)}
        equipment={selectedEquipmentForMaintenance}
        currentSite={currentSite}
        onSaveLog={handleSaveMaintenanceLog}
      />

      <MaintenanceNotificationCenter
        isOpen={maintenanceCenterOpen}
        onClose={() => setMaintenanceCenterOpen(false)}
        alerts={maintenanceAlerts}
        equipments={db.equipment}
        onOpenMaintenanceModal={handleOpenMaintenanceLogModal}
      />

      <SiteModal
        isOpen={siteModalOpen}
        onClose={() => setSiteModalOpen(false)}
        onSaveSite={handleSaveSite}
        initialSite={null}
      />

      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        onRestoreData={handleReloadDb}
      />

      <PrintDailyPV
        isOpen={dailyPVModalOpen}
        onClose={() => setDailyPVModalOpen(false)}
        site={currentSite}
        log={currentSiteLog}
        dateStr={selectedDate}
        workers={db.workers}
        attendance={db.attendance}
        expenses={db.expenses}
      />

      <PeriodReportModal
        isOpen={periodReportModalOpen}
        onClose={() => setPeriodReportModalOpen(false)}
        site={currentSite}
        workers={db.workers}
        attendance={db.attendance}
        advances={db.advances}
        expenses={db.expenses}
        logs={db.logs}
      />

      <GlobalSearch
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        sites={db.sites}
        workers={db.workers}
        materials={db.materials}
        expenses={db.expenses}
        onSelectSite={(id) => setCurrentSiteId(id)}
        onNavigateTab={handleSelectTab}
      />

      <LicenseModal
        isOpen={licenseModalOpen}
        onClose={() => setLicenseModalOpen(false)}
        license={db.license || { isActivated: false }}
        onUpdateLicense={(lic) => {
          setDb((prev) => ({ ...prev, license: lic }));
        }}
      />

      <AndroidInstallModal
        isOpen={androidInstallModalOpen}
        onClose={() => setAndroidInstallModalOpen(false)}
      />

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <ShareAppModal
        isOpen={shareAppModalOpen}
        onClose={() => setShareAppModalOpen(false)}
      />

      <PermissionsModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
      />

      <UpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onUpdate={() => {
          window.location.reload();
        }}
      />

      {/* AI Hub & Features */}
      <AiPerformanceHub
        isOpen={aiHubOpen}
        onClose={() => setAiHubOpen(false)}
        site={currentSite}
        workers={db.workers}
        attendance={db.attendance}
        expenses={db.expenses}
        onOpenRecruitmentGenerator={() => setAiRecruitmentOpen(true)}
        onOpenWorkforceAudit={() => setAiAuditOpen(true)}
        onOpenSmartCapture={() => setAiSmartCaptureOpen(true)}
      />

      <AiRecruitmentGeneratorModal
        isOpen={aiRecruitmentOpen}
        onClose={() => setAiRecruitmentOpen(false)}
        onAddWorkers={handleAddMultipleWorkers}
        currency={currentSite.currency}
      />

      <AiWorkforceAuditModal
        isOpen={aiAuditOpen}
        onClose={() => setAiAuditOpen(false)}
        workers={db.workers}
        site={currentSite}
      />

      <AiSmartCaptureModal
        isOpen={aiSmartCaptureOpen}
        onClose={() => setAiSmartCaptureOpen(false)}
        site={currentSite}
        dateStr={selectedDate}
        onApplyParsedData={handleApplySmartCapture}
      />
    </div>
  );
}
