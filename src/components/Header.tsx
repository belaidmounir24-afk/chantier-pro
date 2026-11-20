import React, { useState } from 'react';
import { Site, Worker, AttendanceRecord, MaintenanceAlert } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Building2, 
  MapPin, 
  HardHat, 
  Camera, 
  Sparkles, 
  Users, 
  Search, 
  Bell, 
  Cloud, 
  ChevronDown, 
  Plus, 
  Globe
} from 'lucide-react';

interface HeaderProps {
  sites: Site[];
  currentSite: Site;
  onSelectSite: (siteId: string) => void;
  onOpenNewSiteModal: () => void;
  workers: Worker[];
  attendance: AttendanceRecord[];
  todayStr: string;
  maintenanceAlerts: MaintenanceAlert[];
  onOpenMaintenanceCenter: () => void;
  onOpenAiHub: () => void;
  onOpenScanIa?: () => void;
  onOpenSearch: () => void;
  onOpenBackup: () => void;
  onOpenLicense: () => void;
  onOpenWorkersModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sites,
  currentSite,
  onSelectSite,
  onOpenNewSiteModal,
  maintenanceAlerts,
  onOpenMaintenanceCenter,
  onOpenAiHub,
  onOpenScanIa,
  onOpenSearch,
  onOpenBackup,
  onOpenWorkersModal
}) => {
  const { language, setLanguage } = useLanguage();
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);

  const urgentMaintenanceCount = maintenanceAlerts.filter((a) => a.urgency === 'high').length;

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B] text-white border-b border-slate-800 shadow-lg">
      {/* Top Row: Logo + App Name + Quick Actions */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Left: App Logo & Name */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 bg-slate-900 shadow-md flex items-center justify-center shrink-0">
            <img 
              src="/src/assets/images/chantierpro_app_icon_1788371082408.jpg" 
              alt="ChantierPro"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to stylized C badge
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-amber-400 text-lg pointer-events-none -z-10">
              C
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-1.5">
              ChantierPro
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Local + Synchro</span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons matching Screenshot */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Cloud Sécurisé Badge */}
          <button
            onClick={onOpenBackup}
            title="Statut sauvegarde cloud & synchronisation"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-emerald-500/60 bg-emerald-950/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/50 transition-colors shadow-sm"
          >
            <span>Cloud Sécurisé</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>

          {/* Scan IA shortcut button */}
          <button
            onClick={onOpenScanIa || onOpenAiHub}
            title="Scan IA (Caméra / Photos / Doc)"
            className="flex items-center justify-center gap-1 p-2 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 rounded-xl font-bold shadow-md transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Workers / Team button */}
          <button
            onClick={onOpenWorkersModal || onOpenAiHub}
            title="Équipe & Ouvriers"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
          >
            <Users className="w-4 h-4" />
          </button>

          {/* Search button */}
          <button
            onClick={onOpenSearch}
            title="Rechercher (Ctrl+K)"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications / Alerts button */}
          <button
            onClick={onOpenMaintenanceCenter}
            title="Alertes maintenance & notifications"
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {urgentMaintenanceCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0B132B]"></span>
            )}
          </button>

          {/* Language Toggle (French Flag / Globe) */}
          <button
            onClick={toggleLanguage}
            title="Changer de langue"
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-colors"
          >
            <span>{language === 'fr' ? '🇫🇷' : '🇩🇿'}</span>
            <Globe className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Sub-Header Bar: Site & Client & Manager info */}
      <div className="bg-[#070D1E] px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800/60 overflow-x-auto no-scrollbar gap-3">
        <div 
          onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
          className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors min-w-0"
        >
          {/* Client info */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400">Client :</span>
            <strong className="text-white font-semibold truncate">
              {currentSite.client || 'Nouveau Client BTP'}
            </strong>
          </div>

          <span className="text-slate-600">•</span>

          {/* Location */}
          <div className="flex items-center gap-1 shrink-0 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate">{currentSite.address || 'Bouroyeh'}</span>
          </div>

          <span className="text-slate-600">•</span>

          {/* Site Manager (Belaid Mounir) */}
          <div className="flex items-center gap-1 shrink-0 text-slate-300">
            <HardHat className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">{currentSite.managerName || 'Belaid mounir'}</span>
          </div>

          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>

        {/* Change Site Quick Link */}
        <button
          onClick={onOpenNewSiteModal}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3 h-3" />
          Nouveau chantier
        </button>
      </div>

      {/* Dropdown Menu for Sites */}
      {siteDropdownOpen && (
        <div className="bg-slate-900 border-b border-slate-800 p-3 shadow-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Chantiers Actifs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sites.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  onSelectSite(s.id);
                  setSiteDropdownOpen(false);
                }}
                className={`p-2.5 rounded-xl border cursor-pointer flex justify-between items-center transition-colors ${
                  s.id === currentSite.id
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div>
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.client} • {s.address}</p>
                </div>
                {s.id === currentSite.id && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                    Actuel
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
