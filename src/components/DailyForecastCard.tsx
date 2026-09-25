import React, { useState } from 'react';
import { DailyForecastItem } from '../types/weather';
import { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, ChevronDown, ChevronUp, Droplets, Wind } from 'lucide-react';

interface DailyForecastCardProps {
  days: DailyForecastItem[];
  isFahrenheit?: boolean;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  days,
  isFahrenheit = false,
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(days[0]?.id || null);

  const displayTemp = (celsius: number) => {
    if (isFahrenheit) {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const getConditionIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-5 h-5 text-purple-400" />;
      case 'cloud-drizzle':
        return <CloudDrizzle className="w-5 h-5 text-cyan-400" />;
      default:
        return <Cloud className="w-5 h-5 text-slate-300" />;
    }
  };

  const selectedDay = days.find((d) => d.id === selectedDayId) || days[0];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 md:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            7-Day Synoptic Forecast
          </h3>
          <p className="text-xs text-slate-400">
            Multi-day outlook with expandable diurnal breakdown
          </p>
        </div>
        <span className="text-xs text-slate-400">
          Click any day for period details
        </span>
      </div>

      <div className="space-y-2">
        {days.map((day) => {
          const isSelected = day.id === selectedDayId;
          return (
            <div
              key={day.id}
              className={`rounded-2xl transition-all border ${
                isSelected
                  ? 'bg-slate-950/80 border-cyan-500/40 shadow-lg'
                  : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/40'
              }`}
            >
              {/* Day summary row */}
              <button
                type="button"
                onClick={() => setSelectedDayId(isSelected ? null : day.id)}
                className="w-full p-3.5 flex items-center justify-between gap-3 text-left focus:outline-none"
              >
                <div className="w-24 sm:w-28 flex-shrink-0">
                  <div className="text-sm font-semibold text-slate-100">
                    {day.dayName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {day.dateStr}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getConditionIcon(day.icon)}
                  <span className="text-xs text-slate-300 font-medium truncate hidden sm:inline">
                    {day.condition}
                  </span>
                </div>

                {/* Rain chance */}
                <div className="flex items-center gap-1.5 w-16 text-right justify-end">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-300">
                    {day.rainProbability}%
                  </span>
                </div>

                {/* Temp range */}
                <div className="w-24 text-right flex items-center justify-end gap-2 font-mono text-xs">
                  <span className="font-bold text-slate-100">
                    {displayTemp(day.maxTemp)}°
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="text-slate-400 font-medium">
                    {displayTemp(day.minTemp)}°
                  </span>
                </div>

                <div className="pl-1 text-slate-400">
                  {isSelected ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded details */}
              {isSelected && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 text-xs text-slate-300 animate-fadeIn">
                  <p className="mb-3 text-slate-300 leading-relaxed font-medium">
                    {day.summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 font-medium">Morning</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{displayTemp(day.details.morning.temp)}°</div>
                      <div className="text-[11px] text-blue-400 font-medium">{day.details.morning.rain}% rain</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 font-medium">Afternoon</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{displayTemp(day.details.afternoon.temp)}°</div>
                      <div className="text-[11px] text-blue-400 font-medium">{day.details.afternoon.rain}% rain</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 font-medium">Evening</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{displayTemp(day.details.evening.temp)}°</div>
                      <div className="text-[11px] text-blue-400 font-medium">{day.details.evening.rain}% rain</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 font-medium">Night</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{displayTemp(day.details.night.temp)}°</div>
                      <div className="text-[11px] text-blue-400 font-medium">{day.details.night.rain}% rain</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/50 flex flex-wrap gap-4 text-[11px] text-slate-400">
                    <span>Est. Rainfall: <strong className="text-slate-200">{day.rainfallMm}</strong></span>
                    <span>Max Wind: <strong className="text-slate-200">{day.windSpeed} km/h</strong></span>
                    <span>UV Index: <strong className="text-slate-200">{day.uvIndex}</strong></span>
                    <span>Humidity: <strong className="text-slate-200">{day.humidity}%</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
