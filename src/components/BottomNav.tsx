import React from 'react';
import { Cloud, Bot, CloudSun, Map, ShieldAlert } from 'lucide-react';
import { Language } from '../types/weather';
import { UI_TRANSLATIONS } from '../data/mockData';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  alertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  alertsCount = 3,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const items = [
    { id: 'overview', label: t.overview, icon: <Cloud className="w-5 h-5" /> },
    { id: 'chat', label: 'WeatherGPT', icon: <Bot className="w-5 h-5" /> },
    { id: 'forecast', label: t.forecast, icon: <CloudSun className="w-5 h-5" /> },
    { id: 'map', label: t.weatherMap, icon: <Map className="w-5 h-5" /> },
    {
      id: 'alerts',
      label: t.alerts,
      icon: <ShieldAlert className="w-5 h-5" />,
      count: alertsCount,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080d19]/95 border-t border-slate-800/80 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
