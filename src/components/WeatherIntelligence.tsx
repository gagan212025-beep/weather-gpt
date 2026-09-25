import React, { useState } from 'react';
import { WeatherIntelligenceData, WeatherRiskLevel } from '../types/weather';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Layers, HelpCircle, Activity } from 'lucide-react';

interface WeatherIntelligenceProps {
  data: WeatherIntelligenceData;
  language?: 'en' | 'hi' | 'kn';
  compact?: boolean;
}

export const WeatherIntelligence: React.FC<WeatherIntelligenceProps> = ({
  data,
  language = 'en',
  compact = false,
}) => {
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [showModels, setShowModels] = useState(false);

  const getRiskBadge = (level: WeatherRiskLevel) => {
    switch (level) {
      case 'Severe':
        return {
          bg: 'bg-rose-950/40 text-rose-300 border-rose-800/60',
          dot: 'bg-rose-500',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
          label: language === 'hi' ? 'गंभीर' : language === 'kn' ? 'ತೀವ್ರ' : 'Severe',
        };
      case 'High':
        return {
          bg: 'bg-amber-950/40 text-amber-300 border-amber-800/60',
          dot: 'bg-amber-500',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: language === 'hi' ? 'उच्च' : language === 'kn' ? 'ಹೆಚ್ಚು' : 'High',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-950/30 text-amber-300 border-amber-800/50',
          dot: 'bg-amber-400',
          icon: <Activity className="w-4 h-4 text-amber-400" />,
          label: language === 'hi' ? 'मध्यम' : language === 'kn' ? 'ಮಧ್ಯಮ' : 'Moderate',
        };
      default:
        return {
          bg: 'bg-emerald-950/30 text-emerald-300 border-emerald-800/50',
          dot: 'bg-emerald-400',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: language === 'hi' ? 'कम' : language === 'kn' ? 'ಕಡಿಮೆ' : 'Low',
        };
    }
  };

  const riskBadge = getRiskBadge(data.riskLevel);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden transition-all duration-200 hover:border-slate-700/80">
      {/* Subtle atmospheric glow behind */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-tight">
              {language === 'hi' ? 'मौसम बुद्धिमत्ता' : language === 'kn' ? 'ಹವಾಮಾನ ಬುದ್ಧಿಮತ್ತೆ' : 'Weather Intelligence'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'बहु-मॉडल पूर्वानुमान संश्लेषण'
                : language === 'kn'
                ? 'ಬಹು-ಮಾದರಿ ಮುನ್ಸೂಚನೆ ಸಮನ್ವಯ'
                : 'Multi-source synthesis & risk analysis'}
            </p>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            {language === 'hi' ? 'जोखिम:' : language === 'kn' ? 'ಅಪಾಯ:' : 'Risk:'}
          </span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${riskBadge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${riskBadge.dot} animate-pulse`} />
            <span>{riskBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="text-xs text-slate-400 mb-1">
            {language === 'hi' ? 'पूर्वानुमान सहमति' : language === 'kn' ? 'ಮಾದರಿ ಒಪ್ಪಂದ' : 'Forecast Agreement'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-200">{data.forecastAgreement}</span>
            <span className="text-[11px] text-slate-400">· ECMWF & GFS</span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            {data.agreementDetails}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="text-xs text-slate-400 mb-1">
            {language === 'hi' ? 'मुख्य कारक' : language === 'kn' ? 'ಮುಖ್ಯ ಅಂಶಗಳು' : 'Main Factors'}
          </div>
          <ul className="space-y-1">
            {data.mainFactors.slice(0, 2).map((factor, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span className="line-clamp-1">{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* "Why?" Collapsible Section */}
      <div className="pt-2">
        <button
          onClick={() => setIsWhyOpen(!isWhyOpen)}
          className="w-full flex items-center justify-between py-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              {language === 'hi' ? 'कारण क्या है?' : language === 'kn' ? 'ಕಾರಣ ತಿಳಿಯಿರಿ' : 'Why this assessment?'}
            </span>
          </span>
          {isWhyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isWhyOpen && (
          <div className="mt-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed animate-fadeIn">
            <p>{data.whyExplanation}</p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>{data.confidenceDisclaimer}</span>
              <button
                onClick={() => setShowModels(!showModels)}
                className="text-cyan-400 hover:underline font-medium"
              >
                {showModels ? 'Hide model breakdown' : 'Compare models'}
              </button>
            </div>

            {showModels && (
              <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/60">
                {data.modelsComparison.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-900/60">
                    <span className="font-medium text-slate-200">{m.name}</span>
                    <span className="text-slate-400">{m.temperature}°C · {m.rainProb}% rain · {m.rainfallMm}</span>
                    <span className="text-[11px] text-emerald-400 font-medium">{m.agreementLevel}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer freshness / source */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Source: Multi-model meteorological ensemble</span>
          <span className="text-slate-400">Updated: 10 min ago · Illustrative consensus</span>
        </div>
      )}
    </div>
  );
};
