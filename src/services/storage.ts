import { 
  ChantierDb, 
  Site, 
  Worker, 
  AttendanceRecord, 
  Advance, 
  DailyExpense, 
  CashInflow, 
  CashAudit, 
  Material, 
  StockMovement, 
  Equipment, 
  MaintenanceRecord, 
  SiteLog, 
  SiteTask,
  AppLicense 
} from '../types';

const STORAGE_KEY = 'chantierpro_db_v5';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_SITES: Site[] = [
  {
    id: 'site-bouroyeh',
    name: 'Chantier Bouroyeh — Promotion BTP',
    client: 'Nouveau Client BTP',
    address: 'Bouroyeh',
    budget: 48000000,
    currency: 'DZD',
    status: 'active',
    startDate: '2026-01-15',
    managerName: 'Belaid Mounir',
    radiusMeters: 200,
    notes: 'Coulage dalle R+3 et ferraillage voiles ascenseurs'
  },
  {
    id: 'site-oliviers',
    name: 'Résidence Les Oliviers — Bâtiment B',
    client: 'Promotion Immobilière Al-Djazair',
    address: 'Chéraga, Alger',
    budget: 45000000,
    currency: 'DZD',
    status: 'active',
    startDate: '2025-01-10',
    managerName: 'Belaid Mounir',
    radiusMeters: 200,
    notes: 'Travaux de gros œuvre en cours'
  }
];

const DEFAULT_WORKERS: Worker[] = [
  {
    id: 'w-1',
    name: 'Youcef Benali',
    craft: 'Chef d\'équipe / Coffrage',
    team: 'Équipe Gros Œuvre',
    recruitmentLevel: 'Niveau 4 — Maître Ouvrier / Chef d\'Équipe',
    experienceYears: 14,
    phone: '0550 12 34 56',
    cin: '16-049821',
    rate: 4500,
    rateType: 'jour',
    evaluationScore: 4.9,
    aiEvaluationSummary: 'Excellente maîtrise du calepinage de coffrage.',
    active: true
  },
  {
    id: 'w-2',
    name: 'Karim Mansouri',
    craft: 'Maçon Coffreur (OP2)',
    team: 'Équipe Gros Œuvre',
    recruitmentLevel: 'Niveau 3 — Compagnon Professionnel (OP2)',
    experienceYears: 8,
    phone: '0661 23 45 67',
    cin: '16-081234',
    rate: 3500,
    rateType: 'jour',
    evaluationScore: 4.6,
    active: true
  },
  {
    id: 'w-3',
    name: 'Mourad Slimani',
    craft: 'Ferrailleur Monteur',
    team: 'Équipe Ferraillage',
    recruitmentLevel: 'Niveau 3 — Compagnon Professionnel (OP2)',
    experienceYears: 7,
    phone: '0770 34 56 78',
    cin: '16-015678',
    rate: 3400,
    rateType: 'jour',
    evaluationScore: 4.7,
    active: true
  },
  {
    id: 'w-4',
    name: 'Samir Khelifi',
    craft: 'Électricien Bâtiment',
    team: 'Corps d\'État Secondaire',
    recruitmentLevel: 'Niveau 2 — Ouvrier Professionnel (OP1)',
    experienceYears: 5,
    phone: '0555 45 67 89',
    cin: '16-092345',
    rate: 3200,
    rateType: 'jour',
    evaluationScore: 4.4,
    active: true
  },
  {
    id: 'w-5',
    name: 'Abdelkader Brahimi',
    craft: 'Plombier Sanitaire',
    team: 'Corps d\'État Secondaire',
    recruitmentLevel: 'Niveau 2 — Ouvrier Professionnel (OP1)',
    experienceYears: 5,
    phone: '0662 56 78 90',
    cin: '16-034567',
    rate: 3200,
    rateType: 'jour',
    evaluationScore: 4.3,
    active: true
  },
  {
    id: 'w-6',
    name: 'Tarek Meziane',
    craft: 'Manœuvre Spécialisé',
    team: 'Équipe Gros Œuvre',
    recruitmentLevel: 'Niveau 1 — Manœuvre / Débutant',
    experienceYears: 2,
    phone: '0771 67 89 01',
    cin: '16-078901',
    rate: 2200,
    rateType: 'jour',
    evaluationScore: 4.1,
    active: true
  },
  {
    id: 'w-7',
    name: 'Rachid Belkacem',
    craft: 'Maçon Finisseur (OP2)',
    team: 'Équipe Gros Œuvre',
    recruitmentLevel: 'Niveau 3 — Compagnon Professionnel (OP2)',
    experienceYears: 9,
    phone: '0552 78 90 12',
    cin: '16-089123',
    rate: 3600,
    rateType: 'jour',
    evaluationScore: 4.8,
    active: true
  },
  {
    id: 'w-8',
    name: 'Farid Djebbar',
    craft: 'Ferrailleur Façonneur',
    team: 'Équipe Ferraillage',
    recruitmentLevel: 'Niveau 2 — Ouvrier Professionnel (OP1)',
    experienceYears: 4,
    phone: '0664 89 01 23',
    cin: '16-090234',
    rate: 3000,
    rateType: 'jour',
    evaluationScore: 4.3,
    active: true
  },
  {
    id: 'w-9',
    name: 'Lyes Hamidi',
    craft: 'Conducteur d\'Engins / Grutier',
    team: 'Équipe Matériel',
    recruitmentLevel: 'Niveau 4 — Maître Ouvrier / Chef d\'Équipe',
    experienceYears: 11,
    phone: '0773 90 12 34',
    cin: '16-011345',
    rate: 4200,
    rateType: 'jour',
    evaluationScore: 4.9,
    active: true
  },
  {
    id: 'w-10',
    name: 'Nadir Bouzid',
    craft: 'Plâtrier Staffeur',
    team: 'Finitions',
    recruitmentLevel: 'Niveau 3 — Compagnon Professionnel (OP2)',
    experienceYears: 6,
    phone: '0554 01 23 45',
    cin: '16-022456',
    rate: 3400,
    rateType: 'jour',
    evaluationScore: 4.5,
    active: true
  },
  {
    id: 'w-11',
    name: 'Hocine Cherif',
    craft: 'Carreleur Mosaïste',
    team: 'Finitions',
    recruitmentLevel: 'Niveau 3 — Compagnon Professionnel (OP2)',
    experienceYears: 8,
    phone: '0665 12 34 56',
    cin: '16-033567',
    rate: 3500,
    rateType: 'jour',
    evaluationScore: 4.6,
    active: true
  },
  {
    id: 'w-12',
    name: 'Bilal Saidi',
    craft: 'Manœuvre Polyvalent',
    team: 'Équipe Gros Œuvre',
    recruitmentLevel: 'Niveau 1 — Manœuvre / Débutant',
    experienceYears: 1,
    phone: '0776 23 45 67',
    cin: '16-044678',
    rate: 2200,
    rateType: 'jour',
    evaluationScore: 4.0,
    active: true
  },
  {
    id: 'w-13',
    name: 'Ali Kaddour',
    craft: 'Peintre Bâtiment',
    team: 'Finitions',
    recruitmentLevel: 'Niveau 2 — Ouvrier Professionnel (OP1)',
    experienceYears: 4,
    phone: '0557 34 56 78',
    cin: '16-055789',
    rate: 2900,
    rateType: 'jour',
    evaluationScore: 4.2,
    active: true
  },
  {
    id: 'w-14',
    name: 'Sofiane Mebarki',
    craft: 'Étanchéiste Terrasses',
    team: 'Corps d\'État Secondaire',
    recruitmentLevel: 'Niveau 3 — Compagnon Professionnel (OP2)',
    experienceYears: 7,
    phone: '0668 45 67 89',
    cin: '16-066890',
    rate: 3400,
    rateType: 'jour',
    evaluationScore: 4.5,
    active: true
  },
  {
    id: 'w-15',
    name: 'Khaled Amrani',
    craft: 'Manœuvre Approvisionnement',
    team: 'Équipe Gros Œuvre',
    recruitmentLevel: 'Niveau 1 — Manœuvre / Débutant',
    experienceYears: 2,
    phone: '0779 56 78 90',
    cin: '16-077901',
    rate: 2200,
    rateType: 'jour',
    evaluationScore: 4.1,
    active: true
  }
];

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    name: 'Ciment Portland CPJ 42.5 (Sacs 50kg)',
    category: 'Liants & Poudres',
    unit: 'sacs',
    currentStock: 220,
    minStock: 60,
    unitPrice: 850,
    siteId: 'site-bouroyeh'
  },
  {
    id: 'mat-2',
    name: 'Rond à béton Crénelé Ø12mm (FeE500)',
    category: 'Ferraillage',
    unit: 'barres (12m)',
    currentStock: 110,
    minStock: 40,
    unitPrice: 1650,
    siteId: 'site-bouroyeh'
  },
  {
    id: 'mat-3',
    name: 'Sable d\'Oued Lavé 0/4',
    category: 'Agrégats',
    unit: 'm³',
    currentStock: 25,
    minStock: 15,
    unitPrice: 2800,
    siteId: 'site-bouroyeh'
  },
  {
    id: 'mat-4',
    name: 'Gravier Concasseur 8/15',
    category: 'Agrégats',
    unit: 'm³',
    currentStock: 30,
    minStock: 15,
    unitPrice: 3200,
    siteId: 'site-bouroyeh'
  },
  {
    id: 'mat-5',
    name: 'Briques 8 trous (10x20x30)',
    category: 'Maçonnerie',
    unit: 'palettes',
    currentStock: 24,
    minStock: 10,
    unitPrice: 12500,
    siteId: 'site-bouroyeh'
  }
];

const DEFAULT_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Mini-Pelle Chenilles Caterpillar 303.5',
    type: 'Terrassement',
    brand: 'Caterpillar',
    serialNumber: 'CAT-3035-2023',
    status: 'operational',
    lastMaintenanceDate: '2026-09-15',
    nextMaintenanceDate: '2026-11-15',
    siteId: 'site-bouroyeh',
    hoursUsed: 520,
    assignedDriver: 'Lyes Hamidi'
  },
  {
    id: 'eq-2',
    name: 'Bétonnière Tractable 350L Thermique',
    type: 'Matériel de malaxage',
    brand: 'Altrad / Guy Noel',
    serialNumber: 'BET-350-044',
    status: 'operational',
    lastMaintenanceDate: '2026-10-01',
    nextMaintenanceDate: '2026-11-05',
    siteId: 'site-bouroyeh',
    hoursUsed: 410
  },
  {
    id: 'eq-3',
    name: 'Groupe électrogène insonorisé 50 kVA',
    type: 'Source d\'énergie',
    brand: 'Cummins',
    serialNumber: 'CUM-50-2024',
    status: 'operational',
    lastMaintenanceDate: '2026-09-20',
    nextMaintenanceDate: '2026-11-20',
    siteId: 'site-bouroyeh',
    hoursUsed: 980
  }
];

const DEFAULT_TASKS: SiteTask[] = [
  {
    id: 'task-1',
    siteId: 'site-bouroyeh',
    title: 'Ferraillage et coffrage de la dalle R+3',
    description: 'Pose des treillis soudés, aciers chapeaux et cales à béton.',
    assignedTo: 'Youcef Benali',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-10-28'
  },
  {
    id: 'task-2',
    siteId: 'site-bouroyeh',
    title: 'Coulage béton prêt à l\'emploi B25 (32m³)',
    description: 'Arrivée de 4 toupies à partir de 09h00. Vibrage soigné.',
    assignedTo: 'Youcef Benali',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-10-29'
  },
  {
    id: 'task-3',
    siteId: 'site-bouroyeh',
    title: 'Passage des gaines électriques et évacuations sanitaires',
    description: 'Réservations colonnes montantes R+3.',
    assignedTo: 'Samir Khelifi',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2026-10-28'
  },
  {
    id: 'task-4',
    siteId: 'site-bouroyeh',
    title: 'Élévation cloisons briques R+2',
    description: 'Achèvement du couloir central.',
    assignedTo: 'Karim Mansouri',
    priority: 'medium',
    status: 'done',
    dueDate: '2026-10-26'
  }
];

export const StorageService = {
  load(): ChantierDb {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load ChantierPro DB:', e);
    }

    const today = getTodayDateString();

    // 15 workers:
    // 12 Présents (P) -> 80%
    // 0 Retards (R)
    // 3 Absents (A) -> workers 13, 14, 15
    // Overtime (+14h total): 7 workers with 2h overtime = 14h!
    const initialAttendance: AttendanceRecord[] = DEFAULT_WORKERS.map((w, idx) => {
      const isAbsent = idx >= 12; // 3 absents (indices 12, 13, 14)
      const overtime = (!isAbsent && idx < 7) ? 2 : 0; // 7 workers with 2h overtime = +14h total
      return {
        id: `att-${today}-${w.id}`,
        date: today,
        workerId: w.id,
        siteId: 'site-bouroyeh',
        status: isAbsent ? 'absent' : 'present',
        hours: isAbsent ? 0 : 8,
        overtimeHours: overtime,
        lateMinutes: 0
      };
    });

    const initialAdvances: Advance[] = [
      {
        id: 'adv-1',
        workerId: 'w-2',
        siteId: 'site-bouroyeh',
        amount: 5000,
        date: today,
        receiptNumber: 'ACP-2026-001',
        notes: 'Avance sur salaire quinzaine'
      },
      {
        id: 'adv-2',
        workerId: 'w-4',
        siteId: 'site-bouroyeh',
        amount: 3000,
        date: today,
        receiptNumber: 'ACP-2026-002',
        notes: 'Dépannage transport'
      }
    ];

    const initialExpenses: DailyExpense[] = [
      {
        id: 'exp-1',
        date: today,
        siteId: 'site-bouroyeh',
        category: 'carburant',
        amount: 4500,
        description: 'Gasoil pour la pelleteuse CAT et groupe électrogène',
        supplier: 'Naftal'
      },
      {
        id: 'exp-2',
        date: today,
        siteId: 'site-bouroyeh',
        category: 'outillage',
        amount: 2800,
        description: 'Disques à tronçonner béton et fil à ligaturer',
        supplier: 'Quincaillerie Centrale'
      },
      {
        id: 'exp-3',
        date: today,
        siteId: 'site-bouroyeh',
        category: 'repas',
        amount: 4200,
        description: 'Déjeuner équipe coulage dalle (12 personnes)',
        supplier: 'Restauration Chantier'
      }
    ];

    const initialCashInflow: CashInflow[] = [
      {
        id: 'in-1',
        date: today,
        siteId: 'site-bouroyeh',
        amount: 150000,
        source: 'Alimentation de petite caisse par la Direction',
        notes: 'Bon de caisse N° 84/2026'
      }
    ];

    const initialLogs: SiteLog[] = [
      {
        id: `log-${today}`,
        date: today,
        siteId: 'site-bouroyeh',
        weather: 'Ensoleillé',
        temperature: '22°C',
        tasksCompleted: 'Finition du coffrage de la dalle R+3. Pose des aciers supérieurs et réservations gaines électriques.',
        safetyNotes: 'Port des casques et harnais de sécurité vérifié sur le plancher haut.',
        issuesEncountered: 'Aucun incident à signaler. Conforme au planning.'
      }
    ];

    const db: ChantierDb = {
      sites: DEFAULT_SITES,
      currentSiteId: 'site-bouroyeh',
      workers: DEFAULT_WORKERS,
      attendance: initialAttendance,
      advances: initialAdvances,
      expenses: initialExpenses,
      cashInflows: initialCashInflow,
      cashAudits: [],
      materials: DEFAULT_MATERIALS,
      movements: [],
      equipment: DEFAULT_EQUIPMENT,
      maintenanceRecords: [],
      logs: initialLogs,
      tasks: DEFAULT_TASKS,
      license: {
        isActivated: true,
        type: 'lifetime',
        clientName: 'Belaid Mounir — BTP Pro',
        activatedAt: '2026-01-01'
      }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {}

    return db;
  },

  loadDb(): ChantierDb {
    return this.load();
  },

  save(db: ChantierDb): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save ChantierPro DB:', e);
    }
  },

  reset(): ChantierDb {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return this.load();
  },

  resetToDefaults(): ChantierDb {
    return this.reset();
  },

  exportBackupJson(): string {
    const db = this.load();
    return JSON.stringify(db, null, 2);
  },

  importBackupJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data && data.sites && Array.isArray(data.sites)) {
        this.save(data);
        return true;
      }
    } catch (e) {
      console.error('Failed to import backup:', e);
    }
    return false;
  },

  // CRUD helpers
  saveWorker(worker: Worker): void {
    const db = this.load();
    const idx = db.workers.findIndex((w) => w.id === worker.id);
    if (idx >= 0) {
      db.workers[idx] = worker;
    } else {
      db.workers.push(worker);
    }
    this.save(db);
  },

  deleteWorker(workerId: string): void {
    const db = this.load();
    db.workers = db.workers.filter((w) => w.id !== workerId);
    this.save(db);
  },

  saveAttendance(record: AttendanceRecord): void {
    const db = this.load();
    const idx = db.attendance.findIndex((a) => a.id === record.id);
    if (idx >= 0) {
      db.attendance[idx] = record;
    } else {
      db.attendance.push(record);
    }
    this.save(db);
  },

  saveTask(task: SiteTask): void {
    const db = this.load();
    if (!db.tasks) db.tasks = [];
    const idx = db.tasks.findIndex((t) => t.id === task.id);
    if (idx >= 0) {
      db.tasks[idx] = task;
    } else {
      db.tasks.push(task);
    }
    this.save(db);
  },

  deleteTask(taskId: string): void {
    const db = this.load();
    if (db.tasks) {
      db.tasks = db.tasks.filter((t) => t.id !== taskId);
      this.save(db);
    }
  },

  saveAdvance(advance: Advance): void {
    const db = this.load();
    db.advances.push(advance);
    this.save(db);
  },

  saveExpense(expense: DailyExpense): void {
    const db = this.load();
    db.expenses.push(expense);
    this.save(db);
  },

  deleteExpense(expenseId: string): void {
    const db = this.load();
    db.expenses = db.expenses.filter((e) => e.id !== expenseId);
    this.save(db);
  },

  saveCashInflow(inflow: CashInflow): void {
    const db = this.load();
    db.cashInflows.push(inflow);
    this.save(db);
  },

  saveCashAudit(audit: CashAudit): void {
    const db = this.load();
    db.cashAudits.push(audit);
    this.save(db);
  },

  saveMaterial(material: Material): void {
    const db = this.load();
    const idx = db.materials.findIndex((m) => m.id === material.id);
    if (idx >= 0) {
      db.materials[idx] = material;
    } else {
      db.materials.push(material);
    }
    this.save(db);
  },

  deleteMaterial(materialId: string): void {
    const db = this.load();
    db.materials = db.materials.filter((m) => m.id !== materialId);
    this.save(db);
  },

  saveStockMovement(movement: StockMovement): void {
    const db = this.load();
    db.movements.push(movement);
    const mat = db.materials.find((m) => m.id === movement.materialId);
    if (mat) {
      if (movement.type === 'reception' || movement.type === 'in') {
        mat.currentStock += movement.quantity;
      } else {
        mat.currentStock = Math.max(0, mat.currentStock - movement.quantity);
      }
    }
    this.save(db);
  },

  saveEquipment(equipment: Equipment): void {
    const db = this.load();
    const idx = db.equipment.findIndex((e) => e.id === equipment.id);
    if (idx >= 0) {
      db.equipment[idx] = equipment;
    } else {
      db.equipment.push(equipment);
    }
    this.save(db);
  },

  deleteEquipment(equipmentId: string): void {
    const db = this.load();
    db.equipment = db.equipment.filter((e) => e.id !== equipmentId);
    this.save(db);
  },

  saveMaintenanceRecord(record: MaintenanceRecord, nextDueDate: string): void {
    const db = this.load();
    db.maintenanceRecords.push(record);
    const eq = db.equipment.find((e) => e.id === record.equipmentId);
    if (eq) {
      eq.lastMaintenanceDate = record.date;
      eq.nextMaintenanceDate = nextDueDate;
      eq.status = 'operational';
    }
    this.save(db);
  },

  saveSiteLog(log: SiteLog): void {
    const db = this.load();
    const idx = db.logs.findIndex((l) => l.siteId === log.siteId && l.date === log.date);
    if (idx >= 0) {
      db.logs[idx] = log;
    } else {
      db.logs.push(log);
    }
    this.save(db);
  },

  saveSite(site: Site): void {
    const db = this.load();
    const idx = db.sites.findIndex((s) => s.id === site.id);
    if (idx >= 0) {
      db.sites[idx] = site;
    } else {
      db.sites.push(site);
    }
    this.save(db);
  },

  saveLicense(license: AppLicense): void {
    const db = this.load();
    db.license = license;
    this.save(db);
  }
};
