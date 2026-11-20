export type TabType = 
  | 'pointage' 
  | 'taches' 
  | 'paie' 
  | 'caisse' 
  | 'stock' 
  | 'journal' 
  | 'rapports' 
  | 'ia'
  | 'dash' 
  | 'team' 
  | 'mat' 
  | 'expenses' 
  | 'log' 
  | 'reports';

export type RateType = 'jour' | 'heure' | 'mois';

export type RecruitmentLevel = 
  | "Niveau 1 — Manœuvre / Débutant"
  | "Niveau 2 — Ouvrier Professionnel (OP1)"
  | "Niveau 3 — Compagnon Professionnel (OP2)"
  | "Niveau 4 — Maître Ouvrier / Chef d'Équipe";

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'half' | 'holiday';

export type ExpenseCategory = 'carburant' | 'materiaux' | 'outillage' | 'repas' | 'transport' | 'divers';

export interface Site {
  id: string;
  name: string;
  client: string;
  address: string;
  budget: number;
  currency: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  notes?: string;
  managerName?: string;
  radiusMeters?: number;
}

export interface Worker {
  id: string;
  name: string;
  craft: string;
  team: string;
  recruitmentLevel: RecruitmentLevel;
  experienceYears: number;
  phone: string;
  cin: string;
  rate: number;
  rateType: RateType;
  evaluationScore?: number;
  aiEvaluationSummary?: string;
  notes?: string;
  active: boolean;
}

export interface Advance {
  id: string;
  workerId: string;
  siteId: string;
  amount: number;
  date: string;
  receiptNumber: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  workerId: string;
  siteId: string;
  status: AttendanceStatus;
  hours: number;
  overtimeHours?: number;
  lateMinutes?: number;
  notes?: string;
}

export interface SiteTask {
  id: string;
  siteId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
}

export interface DailyExpense {
  id: string;
  date: string;
  siteId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  supplier?: string;
  invoiceNumber?: string;
}

export interface CashInflow {
  id: string;
  date: string;
  siteId: string;
  amount: number;
  source: string;
  notes?: string;
}

export interface CashAudit {
  id: string;
  date: string;
  siteId: string;
  theoreticalBalance: number;
  actualBalance: number;
  discrepancy: number;
  auditorName?: string;
  notes?: string;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock?: number;
  minThreshold?: number;
  unitPrice?: number;
  unitCost?: number;
  category: string;
  supplier?: string;
  siteId: string;
}

export interface StockMovement {
  id: string;
  materialId: string;
  siteId?: string;
  type: 'reception' | 'consommation' | 'in' | 'out';
  quantity: number;
  date: string;
  supplier?: string;
  reason?: string;
  recipient?: string;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  brand?: string;
  serialNumber?: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'needs_maintenance';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  nextMaintenanceDue?: string;
  siteId: string;
  hoursUsed?: number;
  hoursRun?: number;
  maintenanceIntervalHours?: number;
  assignedDriver?: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: string;
  type?: string;
  description?: string;
  cost: number;
  performedBy: string;
  hoursAtMaintenance?: number;
  notes?: string;
  nextDueDate: string;
}

export interface MaintenanceAlert {
  id?: string;
  equipmentId: string;
  equipmentName: string;
  message?: string;
  dueDate: string;
  isOverdue: boolean;
  daysRemaining: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface SiteLog {
  id: string;
  date: string;
  siteId: string;
  weather: string;
  temperature: string;
  tasksCompleted: string;
  issues?: string;
  issuesEncountered?: string;
  safetyNotes?: string;
  inspections?: string;
  validatedBy?: string;
  photos?: string[];
}

export interface AppLicense {
  isActivated?: boolean;
  isValid?: boolean;
  key?: string;
  licenseKey?: string;
  type?: 'annual' | 'lifetime' | 'pro';
  clientName?: string;
  deviceId?: string;
  expiryDate?: string;
  expiresAt?: string;
  activatedAt?: string;
}

export interface ChantierDb {
  sites: Site[];
  currentSiteId: string;
  workers: Worker[];
  attendance: AttendanceRecord[];
  advances: Advance[];
  expenses: DailyExpense[];
  cashInflows: CashInflow[];
  cashAudits: CashAudit[];
  materials: Material[];
  movements: StockMovement[];
  equipment: Equipment[];
  maintenanceRecords: MaintenanceRecord[];
  logs: SiteLog[];
  tasks: SiteTask[];
  license?: AppLicense;
}
