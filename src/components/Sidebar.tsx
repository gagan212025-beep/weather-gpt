import React from 'react';
import { Cloud, Bot, CloudSun, Map, ShieldAlert, BarChart3, Wheat, Settings, Sparkles } from 'lucide-react';
import { Language } from '../types/weather';
import { UI_TRANSLATIONS } from '../data/mockData';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onOpenSettings: () => void;
  alertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onOpenSettings,
  alertsCount = 3,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const navItems = [
    { id: 'overview', label: t.overview, icon: <Cloud className="w-4 h-4" /> },
    {
      id: 'chat',
      label: t.weatherGpt,
      icon: <Bot className="w-4 h-4" />,
      badge: 'AI',
    },
    { id: 'forecast', label: t.forecast, icon: <CloudSun className="w-4 h-4" /> },
    { id: 'map', label: t.weatherMap, icon: <Map className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: t.alerts,
      icon: <ShieldAlert className="w-4 h-4" />,
      count: alertsCount,
    },
    { id: 'climate', label: t.climate, icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'agriculture', label: t.agriculture, icon: <Wheat className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 hidden lg:flex flex-col justify-between bg-[#080d19]/90 border-r border-slate-800/80 p-5 backdrop-blur-xl z-30">
      {/* Brand & Logo */}
      <div>
        <div
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3 cursor-pointer group mb-8 px-2"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cloud className="w-6 h-6 text-slate-950 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-white tracking-tight font-sans">
                Weather<span className="text-cyan-400">GPT</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Meteorological AI
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Button */}
      <div className="pt-4 border-t border-slate-800/60">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>{t.settings}</span>
        </button>

        <div className="mt-4 px-2 text-[10px] text-slate-400 leading-snug">
          <span>WeatherGPT v2.4</span>
          <br />
          <span className="text-slate-400">ECMWF · GFS · IMD Multi-Ensemble</span>
        </div>
      </div>
    </aside>
  );
};
