import React from 'react';

export const WeatherHeroSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 backdrop-blur-xl animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-4 w-48 bg-slate-800 rounded-md" />
        <div className="h-4 w-28 bg-slate-800 rounded-md" />
      </div>

      <div className="flex items-baseline gap-4">
        <div className="h-16 w-32 bg-slate-800 rounded-xl" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-slate-800 rounded-md" />
          <div className="h-4 w-24 bg-slate-800 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/60">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-slate-950/60 rounded-xl border border-slate-800/60" />
        ))}
      </div>
    </div>
  );
};

export const ForecastSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 backdrop-blur-xl animate-pulse space-y-4">
      <div className="h-5 w-40 bg-slate-800 rounded-md mb-4" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 bg-slate-950/60 rounded-2xl border border-slate-800/50" />
      ))}
    </div>
  );
};
