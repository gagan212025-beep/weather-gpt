import React from 'react';
import { X, Check, MapPin, Globe, Database, Sliders, ShieldCheck } from 'lucide-react';
import { LocationInfo, Language } from '../types/weather';
import { POPULAR_LOCATIONS } from '../data/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFahrenheit: boolean;
  onToggleUnit: () => void;
  language: Language;
  onSelectLanguage: (l: Language) => void;
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isFahrenheit,
  onToggleUnit,
  language,
  onSelectLanguage,
  currentLocation,
  onSelectLocation,
}) => {
  if (!isOpen) return null;

  const savedLocations = [
    { label: '📍 Home', loc: POPULAR_LOCATIONS[0] }, // Bengaluru
    { label: '📍 College / Tech Park', loc: POPULAR_LOCATIONS[1] }, // Mumbai
    { label: '📍 Farm / Orchard', loc: POPULAR_LOCATIONS[4] }, // Hyderabad
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">WeatherGPT Settings</h3>
            <p className="text-xs text-slate-400">Configure units, shortcuts, and meteorological data sources</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Units Section */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Temperature & Units
          </label>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-sm font-semibold text-slate-200">Temperature Scale</div>
              <div className="text-xs text-slate-400">Toggle between Celsius and Fahrenheit</div>
            </div>
            <button
              onClick={onToggleUnit}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all"
            >
              Current: {isFahrenheit ? '°F (Fahrenheit)' : '°C (Celsius)'}
            </button>
          </div>
        </div>

        {/* Saved Shortcut Locations (Section 20 requirement: Home, College, Farm) */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Preset Shortcuts (Home · College · Farm)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {savedLocations.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectLocation(item.loc);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  currentLocation.id === item.loc.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold">{item.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{item.loc.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Sources & Transparency (Section 30 requirement) */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Data Sources & Verification Architecture
          </label>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-200">Meteorological Models:</span>
              <span className="text-cyan-400 font-mono">ECMWF IFS / NOAA GFS / IMD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-200">Observation Feed:</span>
              <span className="text-slate-400">Open-Meteo & Ground Stations</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-200">Intelligence & Natural Language:</span>
              <span className="text-cyan-400 font-mono">Gemini 3.8 Flash (Server-Side)</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
              Transparent multi-source synthesis prevents hallucinated numbers. The LLM interprets verified physical datasets.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
