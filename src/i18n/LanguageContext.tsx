import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    'app.title': 'ChantierPro',
    'app.subtitle': 'Gestion de Chantier BTP',
    'tab.dash': 'Pointage',
    'tab.team': 'Personnel',
    'tab.mat': 'Matériaux & Engins',
    'tab.expenses': 'Caisse & Dépenses',
    'tab.log': 'Journal',
    'tab.reports': 'Rapports',
    'site.active': 'Chantier Actif',
    'workers.present': 'Présents',
    'workers.absent': 'Absents',
    'workers.total': 'Effectif Total',
    'daily.wage': 'Masse Salariale Jour',
    'actions.addWorker': 'Ajouter Ouvrier',
    'actions.advance': 'Verser Acompte',
    'actions.expense': 'Ajouter Dépense',
    'actions.inflow': 'Alimenter Caisse',
    'actions.movement': 'Mouvement Stock',
    'actions.equipment': 'Ajouter Engin'
  },
  ar: {
    'app.title': 'شانتيي برو',
    'app.subtitle': 'إدارة ورشات البناء',
    'tab.dash': 'حضور العمال',
    'tab.team': 'العمال',
    'tab.mat': 'المواد والعتاد',
    'tab.expenses': 'الصندوق والمصاريف',
    'tab.log': 'دفتر الورشة',
    'tab.reports': 'التقارير',
    'site.active': 'الورشة الحالية',
    'workers.present': 'الحاضرون',
    'workers.absent': 'الغائبون',
    'workers.total': 'مجموع العمال',
    'daily.wage': 'أجور اليوم',
    'actions.addWorker': 'إضافة عامل',
    'actions.advance': 'دفع تسبيق',
    'actions.expense': 'إضافة مصروف',
    'actions.inflow': 'تغذية الصندوق',
    'actions.movement': 'حركة المخزون',
    'actions.equipment': 'إضافة آلة'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  dir: 'ltr',
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('chantier_lang') as Language) || 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('chantier_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir: language === 'ar' ? 'rtl' : 'ltr', t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  return useContext(LanguageContext);
}
