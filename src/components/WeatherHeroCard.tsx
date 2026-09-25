import React from 'react';
import { WeatherData } from '../types/weather';
import { CloudRain, Droplets, Wind, Sun, Compass, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface WeatherHeroCardProps {
  weather: WeatherData;
  isFahrenheit?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  language?: 'en' | 'hi' | 'kn';
}

export const WeatherHeroCard: React.FC<WeatherHeroCardProps> = ({
  weather,
  isFahrenheit = false,
  onRefresh,
  isRefreshing = false,
  language = 'en',
}) => {
  const displayTemp = (celsius: number) => {
    if (isFahrenheit) {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const unit = isFahrenheit ? '°F' : '°C';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0d1629]/95 to-slate-950 border border-slate-800/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl transition-all">
      {/* Subtle atmospheric light effect */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Top row: Location & Freshness */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-semibold text-slate-200">
            {weather.location.name}, {weather.location.state}
          </span>
          <span className="text-xs text-slate-400">({weather.location.country})</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {weather.isMockData ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium">
              Demo data
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium">
              Live feed
            </span>
          )}

          <span>·</span>
          <span>{weather.updatedTimeAgo}</span>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              title="Refresh meteorological observation"
              aria-label="Refresh weather data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Hero Temperature & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative z-10">
        <div className="md:col-span-7">
          <div className="flex items-baseline gap-4">
            <span className="text-6xl md:text-7xl font-bold tracking-tight text-white font-sans">
              {displayTemp(weather.temperature)}{unit}
            </span>
            <div className="pb-2">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-100">
                {weather.condition}
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                {language === 'hi' ? 'महसूस होता है' : language === 'kn' ? 'ಅನುಭವವಾಗುತ್ತದೆ' : 'Feels like'}{' '}
                <span className="text-slate-200">{displayTemp(weather.feelsLike)}{unit}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 flex md:justify-end">
          <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-3.5 py-2 rounded-xl backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="leading-snug">
              {weather.rainProbability > 50
                ? 'Convective moisture peak expected late afternoon'
                : 'Stable atmospheric profile throughout the daytime'}
            </span>
          </div>
        </div>
      </div>

      {/* Compact Metrics Row (Section 5 requirements: Rain, Humidity, Wind, UV) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/70 relative z-10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/60 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              {language === 'hi' ? 'बारिश' : language === 'kn' ? 'ಮಳೆ' : 'Rain'}
            </div>
            <div className="text-sm font-semibold text-slate-100 mt-0.5">
              {weather.rainProbability}%
            </div>
            <div className="text-[11px] text-slate-400">{weather.expectedRainfallMm}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/60 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              {language === 'hi' ? 'आर्द्रता' : language === 'kn' ? 'ಆರ್ದ್ರತೆ' : 'Humidity'}
            </div>
            <div className="text-sm font-semibold text-slate-100 mt-0.5">
              {weather.humidity}%
            </div>
            <div className="text-[11px] text-slate-400">Dew {displayTemp(weather.dewPoint)}{unit}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/60 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              {language === 'hi' ? 'हवा' : language === 'kn' ? 'ಗಾಳಿ' : 'Wind'}
            </div>
            <div className="text-sm font-semibold text-slate-100 mt-0.5">
              {weather.windSpeed} km/h
            </div>
            <div className="text-[11px] text-slate-400">{weather.windDirection} gusts {weather.windGusts || Math.round(weather.windSpeed * 1.3)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/60 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              {language === 'hi' ? 'यूवी इंडेक्स' : language === 'kn' ? 'ಯುವಿ ಸೂಚ್ಯಂಕ' : 'UV Index'}
            </div>
            <div className="text-sm font-semibold text-slate-100 mt-0.5">
              {weather.uvIndex} <span className="text-xs text-amber-400 font-normal">Moderate</span>
            </div>
            <div className="text-[11px] text-slate-400">Sun 6:09A - 6:21P</div>
          </div>
        </div>
      </div>
    </div>
  );
};
