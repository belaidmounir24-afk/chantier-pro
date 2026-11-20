import React from 'react';
import { TabType } from '../types';
import { 
  ClipboardCheck, 
  CheckSquare, 
  Users, 
  Wallet, 
  Boxes, 
  BookOpen, 
  BarChart3, 
  Sparkles 
} from 'lucide-react';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab
}) => {
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    {
      id: 'pointage',
      label: 'Pointage',
      icon: ClipboardCheck
    },
    {
      id: 'taches',
      label: 'Tâches',
      icon: CheckSquare
    },
    {
      id: 'paie',
      label: 'Paie',
      icon: Users
    },
    {
      id: 'caisse',
      label: 'Caisse',
      icon: Wallet
    },
    {
      id: 'stock',
      label: 'Stock',
      icon: Boxes
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: BookOpen
    },
    {
      id: 'rapports',
      label: 'Rapports',
      icon: BarChart3
    },
    {
      id: 'ia',
      label: 'IA Chantier',
      icon: Sparkles
    }
  ];

  // Helper to map legacy tab IDs if needed
  const normalizeTab = (tab: TabType): TabType => {
    if (tab === 'dash') return 'pointage';
    if (tab === 'team') return 'paie';
    if (tab === 'mat') return 'stock';
    if (tab === 'expenses') return 'caisse';
    if (tab === 'log') return 'journal';
    if (tab === 'reports') return 'rapports';
    return tab;
  };

  const activeNormalized = normalizeTab(currentTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B132B] border-t border-slate-800 shadow-2xl safe-bottom">
      <div className="max-w-screen-md mx-auto flex items-center justify-between h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNormalized === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
                isActive
                  ? 'text-[#F59E0B] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-1 truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
