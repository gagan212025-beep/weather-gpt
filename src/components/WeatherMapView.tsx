import React, { useState, useEffect } from 'react';
import { CloudRain, Thermometer, Wind, Cloud, ShieldAlert, Play, Pause, Search, MapPin, ZoomIn, ZoomOut, Layers, RefreshCw } from 'lucide-react';
import { LocationInfo } from '../types/weather';
import { POPULAR_LOCATIONS } from '../data/mockData';

interface WeatherMapViewProps {
  currentLocation: LocationInfo;
  onSelectLocation?: (loc: LocationInfo) => void;
}

type MapLayer = 'rain' | 'temperature' | 'wind' | 'clouds' | 'alerts';

export const WeatherMapView: React.FC<WeatherMapViewProps> = ({
  currentLocation,
  onSelectLocation,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('rain');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(6);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeStep, setTimeStep] = useState(0); // 0 = now, 1 = +30m, 2 = +60m, 3 = +90m

  // Radar timeline animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeStep((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const timeLabels = ['Now (Live)', '+30 min', '+60 min', '+90 min'];

  const layers: { id: MapLayer; label: string; icon: React.ReactNode }[] = [
    { id: 'rain', label: 'Rain Radar', icon: <CloudRain className="w-4 h-4" /> },
    { id: 'temperature', label: 'Temperature', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'wind', label: 'Wind Streams', icon: <Wind className="w-4 h-4" /> },
    { id: 'clouds', label: 'Clouds', icon: <Cloud className="w-4 h-4" /> },
    { id: 'alerts', label: 'Active Alerts', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  const filteredLocations = POPULAR_LOCATIONS.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 backdrop-blur-md">
        {/* Layer Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 pl-1 mr-1">Layer:</span>
          {layers.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                activeLayer === l.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {l.icon}
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Search location on map */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search map location..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-1.5 pl-8 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    if (onSelectLocation) onSelectLocation(loc);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>{loc.name}, {loc.state}</span>
                  <span className="text-[10px] text-slate-400">{loc.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Map Canvas Container */}
      <div className="relative h-[480px] md:h-[540px] rounded-3xl overflow-hidden border border-slate-800/90 bg-[#080e1d] shadow-2xl">
        {/* Map Grid / Topographic Background Graphic */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Stylized Landmass & Water Silhouette */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          {/* Simulated Geographic contours */}
          <svg viewBox="0 0 1000 600" className="w-full h-full object-cover">
            <path
              d="M 150 50 Q 300 120 400 250 T 600 450 Q 750 500 850 350 T 950 150 L 1000 0 L 0 0 Z"
              fill="rgba(15, 23, 42, 0.8)"
            />
            <path
              d="M 220 300 C 350 380, 500 320, 620 480 C 700 520, 800 460, 880 550 L 1000 600 L 0 600 Z"
              fill="rgba(15, 23, 42, 0.7)"
            />
          </svg>
        </div>

        {/* Dynamic Radar/Thermal Overlays according to activeLayer */}
        {activeLayer === 'rain' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Animated Convective Precipitation Blobs */}
            <div
              className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full transition-all duration-1000 ${
                timeStep === 0
                  ? 'bg-blue-500/25 blur-2xl scale-95 translate-x-[-20px]'
                  : timeStep === 1
                  ? 'bg-cyan-500/35 blur-3xl scale-105 translate-x-[0px]'
                  : timeStep === 2
                  ? 'bg-blue-600/40 blur-3xl scale-120 translate-x-[25px]'
                  : 'bg-indigo-600/30 blur-2xl scale-110 translate-x-[45px]'
              }`}
            />
            <div className="absolute top-[42%] left-[52%] w-32 h-32 rounded-full bg-emerald-400/30 blur-xl animate-pulse" />
            <div className="absolute top-[40%] left-[50%] w-16 h-16 rounded-full bg-yellow-400/40 blur-md" />
            <div className="absolute top-[39%] left-[49%] w-8 h-8 rounded-full bg-rose-500/50 blur-sm" />
          </div>
        )}

        {activeLayer === 'temperature' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/15 via-cyan-600/15 to-emerald-600/15 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl" />
          </div>
        )}

        {activeLayer === 'wind' && (
          <div className="absolute inset-0 pointer-events-none opacity-60">
            {/* Simulated wind particle vectors */}
            <svg className="w-full h-full">
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d={`M ${100 + i * 70} ${120 + (i % 3) * 60} Q ${250 + i * 60} ${160 + (i % 4) * 40} ${450 + i * 50} ${280 + (i % 3) * 50}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                  style={{ animationDuration: `${2 + (i % 3)}s` }}
                />
              ))}
            </svg>
          </div>
        )}

        {activeLayer === 'alerts' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Warning zone circles */}
            <div className="absolute top-[38%] left-[48%] w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-rose-500/70 bg-rose-500/15 animate-pulse" />
            <div className="absolute top-[28%] left-[42%] w-36 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-amber-500/70 bg-amber-500/10" />
          </div>
        )}

        {/* Location Markers */}
        <div className="absolute top-[44%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer group">
          <div className="relative">
            <span className="w-4 h-4 rounded-full bg-cyan-400 absolute -inset-0.5 animate-ping opacity-60" />
            <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-white shadow-lg relative z-10" />
          </div>
          <div className="mt-1.5 px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-md text-xs font-semibold text-slate-100 shadow-xl flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentLocation.name}</span>
            <span className="text-cyan-400 font-mono">29°C</span>
          </div>
        </div>

        {/* Other City Markers */}
        <div className="absolute top-[32%] left-[42%] z-10 flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
          <span className="text-[10px] text-slate-300 bg-slate-950/70 px-1.5 py-0.5 rounded mt-0.5">Tumakuru · 27°C</span>
        </div>

        <div className="absolute top-[60%] left-[56%] z-10 flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-white" />
          <span className="text-[10px] text-slate-300 bg-slate-950/70 px-1.5 py-0.5 rounded mt-0.5">Hosur · 28°C</span>
        </div>

        {/* Floating Zoom & Reset Controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl p-1 backdrop-blur-md">
          <button
            onClick={() => setZoom((z) => Math.min(10, z + 1))}
            className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(3, z - 1))}
            className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/90 border border-slate-800/90 rounded-2xl p-3 backdrop-blur-md text-xs shadow-xl">
          <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between gap-4">
            <span className="capitalize">{activeLayer} Intensity</span>
            <span className="text-[10px] text-amber-400">Illustrative demo layer</span>
          </div>

          {activeLayer === 'rain' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Light</span>
              <div className="w-28 h-2 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-rose-500" />
              <span className="text-[10px] text-slate-400">Heavy</span>
            </div>
          )}

          {activeLayer === 'temperature' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">18°C</span>
              <div className="w-28 h-2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 via-amber-400 to-rose-600" />
              <span className="text-[10px] text-slate-400">38°C</span>
            </div>
          )}

          {activeLayer === 'wind' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">5 km/h</span>
              <div className="w-28 h-2 rounded-full bg-gradient-to-r from-cyan-900 via-cyan-400 to-indigo-300" />
              <span className="text-[10px] text-slate-400">45 km/h</span>
            </div>
          )}

          {activeLayer === 'alerts' && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-[10px] text-slate-300">Warning</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[10px] text-slate-300">Watch</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /><span className="text-[10px] text-slate-300">Advisory</span></div>
            </div>
          )}
        </div>

        {/* Timeline Scrubber & Playback Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5 bg-slate-950/90 border border-slate-800/90 rounded-2xl px-3 py-2 backdrop-blur-md text-xs shadow-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1">
            {timeLabels.map((lbl, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTimeStep(idx);
                  setIsPlaying(false);
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  timeStep === idx
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
