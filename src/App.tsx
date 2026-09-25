import React, { useState, useEffect } from 'react';
import {
  LocationInfo,
  WeatherData,
  HourlyForecastItem,
  DailyForecastItem,
  WeatherIntelligenceData,
  PersonalizedMode,
  Language,
} from './types/weather';
import {
  DEFAULT_WEATHER,
  HOURLY_FORECAST,
  SEVEN_DAY_FORECAST,
  DEFAULT_INTELLIGENCE,
  POPULAR_LOCATIONS,
  UI_TRANSLATIONS,
} from './data/mockData';
import { weatherService } from './services/weatherService';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { WeatherHeroCard } from './components/WeatherHeroCard';
import { AskInputPrompt } from './components/AskInputPrompt';
import { WeatherIntelligence } from './components/WeatherIntelligence';
import { WhyWeatherGpt } from './components/WhyWeatherGpt';
import { PersonaSelector } from './components/PersonaSelector';
import { HourlyForecastWidget } from './components/HourlyForecastWidget';
import { DailyForecastCard } from './components/DailyForecastCard';
import { ChatView } from './components/ChatView';
import { WeatherMapView } from './components/WeatherMapView';
import { AlertCenterView } from './components/AlertCenterView';
import { ClimateExplorerView } from './components/ClimateExplorerView';
import { AgricultureModeView } from './components/AgricultureModeView';
import { SettingsModal } from './components/SettingsModal';
import { WeatherHeroSkeleton, ForecastSkeleton } from './components/SkeletonLoader';

import { ShieldAlert, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(POPULAR_LOCATIONS[0]);
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [hourly, setHourly] = useState<HourlyForecastItem[]>(HOURLY_FORECAST);
  const [daily, setDaily] = useState<DailyForecastItem[]>(SEVEN_DAY_FORECAST);
  const [intelligence, setIntelligence] = useState<WeatherIntelligenceData>(DEFAULT_INTELLIGENCE);

  const [persona, setPersona] = useState<PersonalizedMode>('general');
  const [language, setLanguage] = useState<Language>('en');
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Transition query from Overview Ask prompt into Chat page
  const [initialChatQuery, setInitialChatQuery] = useState<string>('');

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch weather data whenever location changes
  const loadWeatherData = async (loc: LocationInfo, showFullLoading = true) => {
    if (showFullLoading) setIsLoading(true);
    else setIsRefreshing(true);
    setHasError(false);

    try {
      const [currentW, hourlyF, dailyF] = await Promise.all([
        weatherService.getCurrentWeather(loc),
        weatherService.getHourlyForecast(loc),
        weatherService.getDailyForecast(loc),
      ]);

      const intel = await weatherService.getWeatherIntelligence(currentW);

      setWeather(currentW);
      setHourly(hourlyF);
      setDaily(dailyF);
      setIntelligence(intel);
    } catch (err) {
      console.error('Failed to load weather:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeatherData(currentLocation, false);
  }, [currentLocation]);

  // Handle user typing or clicking suggested question from Overview
  const handleAskFromOverview = (question: string) => {
    setInitialChatQuery(question);
    setCurrentTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Desktop Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onOpenSettings={() => setIsSettingsOpen(true)}
        alertsCount={3}
      />

      {/* Main Content Area (shifted on desktop for sidebar) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          currentLocation={currentLocation}
          onSelectLocation={(loc) => setCurrentLocation(loc)}
          language={language}
          onSelectLanguage={setLanguage}
          isFahrenheit={isFahrenheit}
          onToggleUnit={() => setIsFahrenheit(!isFahrenheit)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isOffline={isOffline}
        />

        {/* Main Body View */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12 space-y-8">
          {/* Error Banner with Recovery (Section 22 requirement) */}
          {hasError && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span className="text-xs font-semibold">{t.errorNotice}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadWeatherData(currentLocation, true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  {t.tryAgain}
                </button>
                <button
                  onClick={() => {
                    setWeather({ ...DEFAULT_WEATHER, location: currentLocation });
                    setHasError(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  {t.useLastData}
                </button>
              </div>
            </div>
          )}

          {/* OVERVIEW / HOMEPAGE SCREEN */}
          {currentTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Tagline & Supporting Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Weather Data → AI Understanding → Risk Analysis → Action</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight pt-1">
                  {t.tagline}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              {/* LEVEL 1: Current Weather + Ask WeatherGPT */}
              <div className="space-y-6">
                {isLoading ? (
                  <WeatherHeroSkeleton />
                ) : (
                  <WeatherHeroCard
                    weather={weather}
                    isFahrenheit={isFahrenheit}
                    onRefresh={() => loadWeatherData(currentLocation, false)}
                    isRefreshing={isRefreshing}
                    language={language}
                  />
                )}

                {/* THE MAIN FEATURE: ASK WEATHERGPT (Prominent Conversational Input right under current weather) */}
                <AskInputPrompt
                  onAsk={handleAskFromOverview}
                  language={language}
                  disabled={isLoading}
                />
              </div>

              {/* Personalized Weather Mode Selector & Advisory */}
              <PersonaSelector
                currentMode={persona}
                onSelectMode={setPersona}
                showAdviceCard={true}
              />

              {/* LEVEL 2 & 3: Weather Intelligence & Forecast Peek */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 space-y-6">
                  <WeatherIntelligence
                    data={intelligence}
                    language={language}
                  />

                  {/* Active Alert Peek banner */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Heavy Rain Warning</span>
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Bengaluru Rural · Valid 4:00 PM – 10:00 PM
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentTab('alerts')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>View alerts</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  {isLoading ? (
                    <ForecastSkeleton />
                  ) : (
                    <HourlyForecastWidget
                      hourly={hourly}
                      isFahrenheit={isFahrenheit}
                    />
                  )}
                </div>
              </div>

              {/* LEVEL 4: Visual Section "Why WeatherGPT?" (Section 29 requirement) */}
              <WhyWeatherGpt language={language} />

              {/* Quick links to deeper views */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <button
                  onClick={() => setCurrentTab('forecast')}
                  className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                    <span>Full 7-Day Synoptic Forecast</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Morning, afternoon, and night micro-period breakdown
                  </p>
                </button>

                <button
                  onClick={() => setCurrentTab('map')}
                  className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                    <span>Weather Map & Rain Radar</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Simulate cloudburst tracks and wind velocity vectors
                  </p>
                </button>

                <button
                  onClick={() => setCurrentTab('agriculture')}
                  className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 flex items-center justify-between">
                    <span>Agriculture Intelligence</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Irrigation, disease risk, and spray windows for growers
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {currentTab === 'chat' && (
            <div className="animate-fadeIn">
              <ChatView
                weather={weather}
                intelligence={intelligence}
                persona={persona}
                language={language}
                onNavigateTab={setCurrentTab}
                initialQuery={initialChatQuery}
                onClearInitialQuery={() => setInitialChatQuery('')}
              />
            </div>
          )}

          {/* FORECAST TAB */}
          {currentTab === 'forecast' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    Meteorological Forecast Center
                  </h2>
                  <p className="text-xs text-slate-400">
                    High-resolution hourly transitions and 7-day multi-model consensus
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  Location: <span className="text-slate-200 font-semibold">{currentLocation.name}</span>
                </div>
              </div>

              <HourlyForecastWidget
                hourly={hourly}
                isFahrenheit={isFahrenheit}
              />

              <DailyForecastCard
                days={daily}
                isFahrenheit={isFahrenheit}
              />

              <WeatherIntelligence
                data={intelligence}
                language={language}
              />
            </div>
          )}

          {/* WEATHER MAP TAB */}
          {currentTab === 'map' && (
            <div className="animate-fadeIn">
              <WeatherMapView
                currentLocation={currentLocation}
                onSelectLocation={(loc) => setCurrentLocation(loc)}
              />
            </div>
          )}

          {/* ALERTS TAB */}
          {currentTab === 'alerts' && (
            <div className="animate-fadeIn">
              <AlertCenterView />
            </div>
          )}

          {/* CLIMATE TAB */}
          {currentTab === 'climate' && (
            <div className="animate-fadeIn">
              <ClimateExplorerView />
            </div>
          )}

          {/* AGRICULTURE TAB */}
          {currentTab === 'agriculture' && (
            <div className="animate-fadeIn">
              <AgricultureModeView
                currentLocation={currentLocation}
                weather={weather}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        alertsCount={3}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isFahrenheit={isFahrenheit}
        onToggleUnit={() => setIsFahrenheit(!isFahrenheit)}
        language={language}
        onSelectLanguage={setLanguage}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
      />
    </div>
  );
}
