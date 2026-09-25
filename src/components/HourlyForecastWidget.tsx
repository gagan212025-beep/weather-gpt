import React from 'react';
import { HourlyForecastItem } from '../types/weather';
import { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, Droplets } from 'lucide-react';

interface HourlyForecastWidgetProps {
  hourly: HourlyForecastItem[];
  isFahrenheit?: boolean;
}

export const HourlyForecastWidget: React.FC<HourlyForecastWidgetProps> = ({
  hourly,
  isFahrenheit = false,
}) => {
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

  // Compute SVG chart coordinates for temperature & rain
  const minTemp = Math.min(...hourly.map((h) => h.temp)) - 1;
  const maxTemp = Math.max(...hourly.map((h) => h.temp)) + 1;
  const tempRange = Math.max(1, maxTemp - minTemp);

  const chartWidth = hourly.length * 64;
  const chartHeight = 60;

  const points = hourly.map((h, i) => {
    const x = i * 64 + 32;
    const y = chartHeight - ((h.temp - minTemp) / tempRange) * (chartHeight - 16) - 8;
    return { x, y };
  });

  const svgPath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 md:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Hourly Outlook & Rain Probability
          </h3>
          <p className="text-xs text-slate-400">
            Horizontal timeline showing thermal changes and convective cloudburst windows
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-cyan-400 rounded-full" />
            <span>Temp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-500/60 rounded-sm" />
            <span>Rain %</span>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Hourly Bar */}
      <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="flex items-stretch min-w-max pb-2">
          {hourly.map((item, index) => (
            <div
              key={index}
              className="w-16 flex flex-col items-center justify-between py-2 px-1 text-center border-r border-slate-800/50 last:border-none group hover:bg-slate-800/30 rounded-xl transition-colors"
            >
              <span className="text-xs text-slate-400 font-medium">
                {item.timeStr}
              </span>

              <div className="my-2.5 flex items-center justify-center h-8">
                {getConditionIcon(item.icon)}
              </div>

              <span className="text-sm font-bold text-slate-100 mb-1">
                {displayTemp(item.temp)}°
              </span>

              {/* Rain % indicator */}
              <div className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-400">
                <Droplets className="w-3 h-3 text-blue-400/80" />
                <span>{item.rainProbability}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Temperature Line and Rain Probability Bars Chart */}
        <div className="relative mt-2 pt-2 border-t border-slate-800/60" style={{ width: `${chartWidth}px` }}>
          <svg width={chartWidth} height={chartHeight} className="overflow-visible">
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Precipitation Bars in background */}
            {hourly.map((h, i) => {
              const barHeight = (h.rainProbability / 100) * (chartHeight - 12);
              return (
                <rect
                  key={i}
                  x={i * 64 + 18}
                  y={chartHeight - barHeight}
                  width={28}
                  height={barHeight}
                  rx={3}
                  className="fill-blue-500/25 transition-all"
                />
              );
            })}

            {/* Smooth SVG Temperature Curve */}
            <path
              d={svgPath}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Points on curve */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3}
                className="fill-[#070c18] stroke-cyan-400 stroke-2"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
