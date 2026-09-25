import React from 'react';
import { Globe, Cpu, AlertTriangle, UserCheck, ArrowRight } from 'lucide-react';
import { Language } from '../types/weather';
import { UI_TRANSLATIONS } from '../data/mockData';

interface WhyWeatherGptProps {
  language?: Language;
}

export const WhyWeatherGpt: React.FC<WhyWeatherGptProps> = ({ language = 'en' }) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const pillars = [
    {
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      title: t.multiSource,
      description: t.multiSourceDesc,
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      title: t.aiPowered,
      description: t.aiPoweredDesc,
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      title: t.riskAware,
      description: t.riskAwareDesc,
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      title: t.personalized,
      description: t.personalizedDesc,
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {t.whyWeatherGpt}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Beyond raw numbers — how intelligence differs from simple weather apps
          </p>
        </div>

        {/* Small architecture comparison badge */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>Single Sensor</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="text-cyan-400 font-semibold">Multi-Source Ensemble + AI Advice</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((p, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/70 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${p.bg}`}>
                {p.icon}
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-1.5">
                {p.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/50 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Verified flow</span>
              <span className="text-cyan-400">Step 0{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
