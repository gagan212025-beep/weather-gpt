import React from 'react';
import { PersonalizedMode } from '../types/weather';
import { GraduationCap, Car, Wheat, Activity, Calendar, User } from 'lucide-react';
import { PERSONALIZED_ADVICE } from '../data/mockData';

interface PersonaSelectorProps {
  currentMode: PersonalizedMode;
  onSelectMode: (mode: PersonalizedMode) => void;
  showAdviceCard?: boolean;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  currentMode,
  onSelectMode,
  showAdviceCard = true,
}) => {
  const modes: { mode: PersonalizedMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'general', label: 'General', icon: <User className="w-3.5 h-3.5" /> },
    { mode: 'commuter', label: 'Commuter', icon: <Car className="w-3.5 h-3.5" /> },
    { mode: 'student', label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { mode: 'farmer', label: 'Farmer', icon: <Wheat className="w-3.5 h-3.5" /> },
    { mode: 'outdoor', label: 'Outdoor', icon: <Activity className="w-3.5 h-3.5" /> },
    { mode: 'event_planner', label: 'Event Planner', icon: <Calendar className="w-3.5 h-3.5" /> },
  ];

  const currentAdvice = PERSONALIZED_ADVICE[currentMode];

  return (
    <div className="space-y-3">
      {/* Mode Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-1">
          Persona Mode:
        </span>
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl">
          {modes.map((m) => {
            const isActive = currentMode === m.mode;
            return (
              <button
                key={m.mode}
                onClick={() => onSelectMode(m.mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisory card tailored to active persona */}
      {showAdviceCard && currentAdvice && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {currentAdvice.label} Perspective
              </span>
              <span className="text-[11px] text-slate-400">· Tailored Decision Guidance</span>
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Risk: {currentAdvice.riskLevel}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            "{currentAdvice.advice}"
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap gap-2">
            {currentAdvice.actionChecklist.map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] text-slate-300 bg-slate-950/60 border border-slate-800/80 px-2.5 py-1 rounded-md flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
