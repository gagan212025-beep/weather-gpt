import React, { useState } from 'react';
import { WeatherAlert } from '../types/weather';
import { ACTIVE_ALERTS } from '../data/mockData';
import { ShieldAlert, AlertTriangle, Info, Bell, Check, Sliders, ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react';

export const AlertCenterView: React.FC = () => {
  const [alerts] = useState<WeatherAlert[]>(ACTIVE_ALERTS);
  const [openWhyId, setOpenWhyId] = useState<string | null>(null);

  // Alert Settings state (Section 14)
  const [subscribedTypes, setSubscribedTypes] = useState<string[]>([
    'Heavy rain',
    'Thunderstorm',
    'Flood',
    'Strong wind',
  ]);
  const [alertRadius, setAlertRadius] = useState<'10 km' | '25 km' | '50 km'>('25 km');
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const alertTypesList = [
    'Heavy rain',
    'Thunderstorm',
    'Flood',
    'Cyclone',
    'Heatwave',
    'Strong wind',
  ];

  const toggleAlertType = (type: string) => {
    setSubscribedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSaveSettings = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const getSeverityStyle = (sev: 'Red' | 'Orange' | 'Yellow') => {
    switch (sev) {
      case 'Red':
        return {
          border: 'border-rose-800/80',
          bg: 'bg-rose-950/20',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-500',
          icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
        };
      case 'Orange':
        return {
          border: 'border-amber-800/80',
          bg: 'bg-amber-950/20',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        };
      case 'Yellow':
        return {
          border: 'border-yellow-800/70',
          bg: 'bg-yellow-950/15',
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          dot: 'bg-yellow-400',
          icon: <Info className="w-5 h-5 text-yellow-400" />,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Active Alerts Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Active Meteorological Alerts</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified weather advisories and warning watches for your monitoring radius
            </p>
          </div>
          <span className="text-[11px] text-amber-300 bg-amber-950/50 border border-amber-800/60 px-3 py-1 rounded-full">
            All alert feeds are illustrative demo data
          </span>
        </div>

        <div className="space-y-4">
          {alerts.map((alt) => {
            const style = getSeverityStyle(alt.severity);
            const isWhyOpen = openWhyId === alt.id;

            return (
              <div
                key={alt.id}
                className={`rounded-3xl border ${style.border} ${style.bg} p-5 md:p-6 backdrop-blur-md transition-all shadow-xl`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
                  <div className="flex items-center gap-3">
                    {style.icon}
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {alt.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{alt.area}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.badge}`}>
                      {alt.severityText}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alt.validTime}</span>
                    </div>
                  </div>
                </div>

                {/* Reason & Recommended Action */}
                <div className="my-4 space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Reason
                    </span>
                    <p className="text-sm text-slate-200 mt-0.5 font-medium leading-relaxed">
                      {alt.reason}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold">
                      Recommended Action
                    </span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {alt.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* "Why this alert?" Trigger & Drawer */}
                <div className="pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => setOpenWhyId(isWhyOpen ? null : alt.id)}
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    <span>Why this alert?</span>
                    {isWhyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isWhyOpen && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-fadeIn">
                      <p className="font-sans">{alt.whyThisAlert}</p>
                      <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Source: {alt.source}</span>
                        <span className="text-amber-400">Demo dataset</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Settings Panel (Section 14) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Alert Preferences & Radius</h3>
              <p className="text-xs text-slate-400">Customize threshold triggers and notification channels</p>
            </div>
          </div>
          {saveToast && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-fadeIn">
              <Check className="w-4 h-4" /> Preferences updated
            </span>
          )}
        </div>

        {/* Hazard Types Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Trigger Categories
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {alertTypesList.map((type) => {
              const isChecked = subscribedTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleAlertType(type)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{type}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isChecked
                        ? 'bg-cyan-500 border-cyan-500 text-slate-950'
                        : 'border-slate-700'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Radius & Delivery Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Warning Radius
            </label>
            <div className="flex gap-2">
              {(['10 km', '25 km', '50 km'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAlertRadius(r)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                    alertRadius === r
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Monitors approaching storm cells and atmospheric drops within {alertRadius}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Notification Channels (Prototype)
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer text-xs text-slate-300">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  checked={notifyPush}
                  onChange={(e) => setNotifyPush(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer text-xs text-slate-300">
                <span>SMS Alerts (Crucial emergencies)</span>
                <input
                  type="checkbox"
                  checked={notifySMS}
                  onChange={(e) => setNotifySMS(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer text-xs text-slate-300">
                <span>Email Briefings</span>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            Save Alert Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
