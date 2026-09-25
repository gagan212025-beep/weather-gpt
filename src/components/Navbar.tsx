import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Globe, ChevronDown, Check, Cloud, WifiOff, Settings as SettingsIcon } from 'lucide-react';
import { LocationInfo, Language, PersonalizedMode } from '../types/weather';
import { POPULAR_LOCATIONS, UI_TRANSLATIONS } from '../data/mockData';

interface NavbarProps {
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  isFahrenheit: boolean;
  onToggleUnit: () => void;
  onOpenSettings: () => void;
  isOffline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onSelectLocation,
  language,
  onSelectLanguage,
  isFahrenheit,
  onToggleUnit,
  onOpenSettings,
  isOffline = false,
}) => {
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const myLoc: LocationInfo = {
          id: 'user-loc',
          name: 'My Current Location',
          state: 'GPS Detected',
          country: 'Local',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        onSelectLocation(myLoc);
        setIsLocDropdownOpen(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err.message);
        alert('Could not access GPS location. Using default demo location (Bengaluru).');
      },
      { timeout: 8000 }
    );
  };

  const filteredLocations = POPULAR_LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 bg-[#070b14]/85 border-b border-slate-800/80 backdrop-blur-xl px-4 md:px-8 py-3 transition-all">
      {/* Offline banner if disconnected */}
      {isOffline && (
        <div className="mb-2 py-1.5 px-3 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.offlineNotice}</span>
          </div>
          <span className="text-[11px] opacity-80">Cached Mode</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Mobile Logo Brand */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
            <Cloud className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            Weather<span className="text-cyan-400">GPT</span>
          </span>
        </div>

        {/* Location Selector (Section 5 requirements: Location selector: 📍 Bengaluru, Karnataka + Button "Use my location") */}
        <div className="relative">
          <button
            onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 transition-all font-medium focus:outline-none"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[130px] sm:max-w-[180px] truncate">
              {currentLocation.name}, {currentLocation.state}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Location Dropdown Modal */}
          {isLocDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl p-3 z-50 animate-fadeIn">
              <div className="mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city or district..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Use My Location Button */}
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 mb-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting coordinates...' : t.useMyLocation}</span>
              </button>

              <div className="text-[11px] font-semibold text-slate-400 px-1 py-1 uppercase tracking-wider">
                Popular Locations
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                {filteredLocations.map((loc) => {
                  const isSelected = loc.id === currentLocation.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        setIsLocDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{loc.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {loc.state}, {loc.country}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right side controls: Language Selector, Unit Toggle, Settings */}
        <div className="flex items-center gap-2">
          {/* Temperature Unit Toggle */}
          <button
            onClick={onToggleUnit}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            title="Toggle °C / °F"
          >
            {isFahrenheit ? '°F' : '°C'}
          </button>

          {/* Multilingual Selector (Section 18: English, हिन्दी, ಕನ್ನಡ) */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all focus:outline-none"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {language === 'hi' ? 'हिन्दी' : language === 'kn' ? 'ಕನ್ನಡ' : 'English'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-fadeIn">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'kn', label: 'ಕನ್ನಡ' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onSelectLanguage(l.code as Language);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                      language === l.code
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Settings Icon */}
          <button
            onClick={onOpenSettings}
            className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
