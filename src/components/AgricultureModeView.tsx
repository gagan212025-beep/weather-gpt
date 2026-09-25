import React, { useState } from 'react';
import { AGRO_CROPS } from '../data/mockData';
import { LocationInfo, WeatherData } from '../types/weather';
import { Wheat, Droplets, Sun, Wind, CloudRain, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface AgricultureModeViewProps {
  currentLocation: LocationInfo;
  weather: WeatherData;
}

export const AgricultureModeView: React.FC<AgricultureModeViewProps> = ({
  currentLocation,
  weather,
}) => {
  const [selectedCropKey, setSelectedCropKey] = useState<string>('tomato');
  const [customGrowthStage, setCustomGrowthStage] = useState<string>('Flowering & Early Fruit Set');

  const cropData = AGRO_CROPS[selectedCropKey] || AGRO_CROPS.tomato;

  const cropOptions = [
    { key: 'tomato', name: 'Tomato' },
    { key: 'rice', name: 'Paddy / Rice' },
    { key: 'wheat', name: 'Wheat' },
    { key: 'coffee', name: 'Coffee' },
  ];

  const stages = [
    'Sowing / Nursery',
    'Vegetative Growth',
    'Flowering & Early Fruit Set',
    'Fruit / Grain Development',
    'Maturity / Harvest',
  ];

  return (
    <div className="space-y-6">
      {/* Title & Microclimate Configuration */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Wheat className="w-6 h-6 text-amber-400" />
              <span>Agriculture Weather Intelligence</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Crop-specific microclimate analytics and risk-aware field advisories
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
            📍 {currentLocation.name}, {currentLocation.state}
          </span>
        </div>

        {/* Input Fields: Crop & Growth Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/70">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Selected Crop
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cropOptions.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setSelectedCropKey(c.key)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                    selectedCropKey === c.key
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Growth Stage
            </label>
            <select
              value={customGrowthStage}
              onChange={(e) => setCustomGrowthStage(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {stages.map((stg) => (
                <option key={stg} value={stg} className="bg-slate-900 text-slate-100">
                  {stg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Microclimate Observation Display (Temp, Rainfall, Humidity, Wind) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Temperature</span>
            </span>
            <div className="text-lg font-bold text-white mt-1">
              {weather.temperature}°C
            </div>
            <span className="text-[11px] text-slate-400">{cropData.temperatureSuitability}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>24h Rain Outlook</span>
            </span>
            <div className="text-lg font-bold text-blue-300 mt-1">
              {weather.expectedRainfallMm}
            </div>
            <span className="text-[11px] text-blue-400/80 font-medium">{weather.rainProbability}% probability</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Soil Moisture</span>
            </span>
            <div className="text-lg font-bold text-cyan-300 mt-1">
              {cropData.soilMoisturePercentage}%
            </div>
            <span className="text-[11px] text-slate-400">{cropData.moistureStatus}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-indigo-400" />
              <span>Wind Speed</span>
            </span>
            <div className="text-lg font-bold text-white mt-1">
              {weather.windSpeed} km/h
            </div>
            <span className="text-[11px] text-slate-400">{weather.windDirection} breeze</span>
          </div>
        </div>
      </div>

      {/* AI Weather Advisory (Section 16 requirement) */}
      <div className="bg-slate-900/60 border border-amber-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              AI Agricultural Weather Advisory
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-mono">
            {cropData.cropName} · {customGrowthStage}
          </span>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
              Irrigation Recommendation
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              "{cropData.irrigationRecommendation}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Disease & Pest Risk ({cropData.diseasePestRisk})
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {cropData.sprayWindowAdvice}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Harvesting & Field Work Window
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {cropData.harvestAdvisory}
              </p>
            </div>
          </div>
        </div>

        {/* Transparent Expert Advisory Disclaimer (Section 16 requirement) */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{cropData.disclaimer}</span>
        </div>
      </div>
    </div>
  );
};
