import React, { useState } from 'react';
import { CLIMATE_DATA, POPULAR_LOCATIONS } from '../data/mockData';
import { BarChart3, TrendingUp, AlertTriangle, Info, Calendar, Sparkles } from 'lucide-react';

export const ClimateExplorerView: React.FC = () => {
  const [selectedLoc, setSelectedLoc] = useState('Bengaluru Region');
  const climate = CLIMATE_DATA;

  // Max anomaly for scaling chart
  const maxAnomaly = Math.max(...climate.annualTempAnomalies.map((a) => Math.abs(a.anomaly)));

  return (
    <div className="space-y-6">
      {/* Title & Educational Explainer */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <span>Climate Explorer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Long-term multi-decadal atmospheric trends and extreme variability baseline
            </p>
          </div>

          <span className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3 py-1 rounded-full">
            {climate.datasetNotice}
          </span>
        </div>

        {/* Foundational Distinction Note (Section 15 requirement) */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block mb-0.5">Core Principle: Weather vs. Climate</strong>
            {climate.educationalNote}
          </div>
        </div>
      </div>

      {/* Chart 1: Annual Temperature Anomalies (1995 - 2026) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Mean Surface Temperature Anomaly (°C Relative to 1980–2010 Baseline)
            </h3>
            <p className="text-xs text-slate-400">
              Steadily warming summer maximums with +1.28°C shift recorded in 2026
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" />
            <span className="text-slate-300">Warm Anomaly</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/80 ml-2" />
            <span className="text-slate-300">Cool Anomaly</span>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-800/70">
          {climate.annualTempAnomalies.map((item) => {
            const isPositive = item.anomaly >= 0;
            const heightPercent = Math.min(100, Math.round((Math.abs(item.anomaly) / (maxAnomaly + 0.2)) * 80));

            return (
              <div key={item.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {isPositive ? `+${item.anomaly}` : item.anomaly}°
                </span>
                <div
                  className={`w-full max-w-[28px] rounded-t-md transition-all group-hover:scale-105 ${
                    isPositive ? 'bg-gradient-to-t from-rose-600 to-amber-500' : 'bg-gradient-to-t from-blue-600 to-cyan-400'
                  }`}
                  style={{ height: `${Math.max(8, heightPercent)}%` }}
                />
                <span className="text-[11px] text-slate-400 font-medium mt-2">
                  {item.year.toString().slice(-2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 2: Monthly Rainfall Normals vs Recent Year */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Monthly Precipitation Profile (mm): Historical Normal vs. Recent Year
            </h3>
            <p className="text-xs text-slate-400">
              Shifting monsoon peaks with intensified post-monsoon deluges in Sep–Oct
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
              <span>Historical Norm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
              <span>Recent Year</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center">
          {climate.monthlyRainfallComparison.map((m) => (
            <div key={m.month} className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between h-32">
              <span className="text-xs font-semibold text-slate-300">{m.month}</span>
              <div className="flex items-end justify-center gap-1 h-16 my-1">
                <div
                  className="w-2 bg-slate-600 rounded-t"
                  style={{ height: `${Math.min(100, (m.historicalNorm / 240) * 100)}%` }}
                  title={`Normal: ${m.historicalNorm}mm`}
                />
                <div
                  className="w-2 bg-cyan-400 rounded-t shadow-sm shadow-cyan-400/40"
                  style={{ height: `${Math.min(100, (m.recentYear / 240) * 100)}%` }}
                  title={`Recent: ${m.recentYear}mm`}
                />
              </div>
              <span className="text-[10px] text-cyan-300 font-mono font-medium">{m.recentYear}mm</span>
            </div>
          ))}
        </div>
      </div>

      {/* Extreme Weather Events Timeline */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-slate-100 mb-4">
          Decadal High-Impact Weather Chronology
        </h3>
        <div className="space-y-3">
          {climate.extremeWeatherEvents.map((evt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400 font-mono">{evt.year}</span>
                  <span className="text-sm font-semibold text-white">{evt.eventName}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {evt.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{evt.impact}</p>
              </div>

              <div className="text-xs text-slate-400 md:text-right max-w-sm border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-4">
                <span className="text-[11px] text-cyan-400/80 font-medium block">Long-term Trend:</span>
                <span>{evt.trendNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
