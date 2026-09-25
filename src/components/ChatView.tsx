import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, WeatherData, WeatherIntelligenceData, PersonalizedMode, Language } from '../types/weather';
import { aiService } from '../services/aiService';
import { Send, Mic, MicOff, Volume2, Sparkles, User, Bot, Clock, ArrowRight, ShieldAlert, CloudRain, Droplets, Wind, Thermometer, Layers, AlertTriangle } from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/mockData';

interface ChatViewProps {
  weather: WeatherData;
  intelligence: WeatherIntelligenceData;
  persona: PersonalizedMode;
  language: Language;
  onNavigateTab: (tab: string) => void;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  weather,
  intelligence,
  persona,
  language,
  onNavigateTab,
  initialQuery,
  onClearInitialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं WeatherGPT हूँ। मौसम संबंधी कोई भी प्रश्न पूछें—मैं सटीक डेटा के साथ व्यावहारिक और स्पष्ट मार्गदर्शन दूंगा।'
          : language === 'kn'
          ? 'ನಮಸ್ಕಾರ! ನಾನು WeatherGPT. ಹವಾಮಾನದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ—ಸ್ಪಷ್ಟ ಮತ್ತು ಉಪಯುಕ್ತ ಮಾಹಿತಿ ನೀಡುತ್ತೇನೆ.'
          : "Hello! I'm WeatherGPT. Ask me anything about upcoming rain, travel conditions, weekend plans, or farm advisories.",
      timestamp: 'Just now',
      evidenceCard: {
        rainProbability: weather.rainProbability,
        expectedRainfall: weather.expectedRainfallMm,
        windSpeed: `${weather.windSpeed} km/h`,
        temperature: `${weather.temperature}°C`,
        condition: weather.condition,
        uvIndex: weather.uvIndex,
        humidity: weather.humidity,
      },
      intelligence: {
        riskLevel: intelligence.riskLevel,
        forecastAgreement: intelligence.forecastAgreement,
        factors: intelligence.mainFactors,
        explanation: intelligence.whyExplanation,
      },
      actionButtons: [
        { label: 'Hourly forecast', actionType: 'hourly' },
        { label: 'Open weather map', actionType: 'map' },
        { label: 'Set alert', actionType: 'alerts' },
      ],
      sourceAttribution: 'WeatherGPT Multi-Model Fusion',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle incoming initialQuery from Overview page
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery.trim());
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text }));
      const assistantMsg = await aiService.sendMessage({
        message: queryText,
        weather,
        intelligence,
        persona,
        language,
        history,
      });

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Voice Input (Speech Recognition)
  const toggleSpeechInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US';
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setInput(spoken);
        handleSend(spoken);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleActionButton = (actionType: string) => {
    if (actionType === 'hourly') onNavigateTab('forecast');
    else if (actionType === 'map') onNavigateTab('map');
    else if (actionType === 'alerts') onNavigateTab('alerts');
    else if (actionType === 'agriculture') onNavigateTab('agriculture');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="p-4 md:px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>WeatherGPT Intelligence Assistant</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-400">
              Interpreting verified observations for {weather.location.name} · Mode: <strong className="text-cyan-400 capitalize">{persona}</strong>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 hidden sm:block">
          Active Engine: <span className="text-slate-200 font-mono">Gemini 3.8 Flash + Multi-Source</span>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble & Cards */}
              <div className="space-y-3 flex-1">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-tr-none shadow-md shadow-cyan-600/20 font-medium'
                      : 'bg-slate-950/80 border border-slate-800/80 text-slate-100 rounded-tl-none shadow-md'
                  }`}
                >
                  <p>{msg.text}</p>

                  <div className="mt-2 flex items-center justify-between text-[11px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:opacity-100 p-1 transition-opacity text-cyan-300 flex items-center gap-1"
                        title="Listen to response"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Read aloud</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Compact Evidence Card (Section 7 requirement) */}
                {msg.evidenceCard && (
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md shadow-md animate-fadeIn">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                      <span>Verified Meteorological Evidence</span>
                      <span className="text-cyan-400 font-mono">
                        {msg.evidenceCard.condition}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <CloudRain className="w-3 h-3 text-blue-400" />
                          <span>Rain Probability</span>
                        </div>
                        <div className="text-base font-bold text-blue-300 mt-0.5">
                          {msg.evidenceCard.rainProbability}%
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-cyan-400" />
                          <span>Expected Rain</span>
                        </div>
                        <div className="text-base font-bold text-slate-100 mt-0.5">
                          {msg.evidenceCard.expectedRainfall}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Wind className="w-3 h-3 text-indigo-400" />
                          <span>Wind Gusts</span>
                        </div>
                        <div className="text-base font-bold text-slate-100 mt-0.5">
                          {msg.evidenceCard.windSpeed}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-amber-400" />
                          <span>Temperature</span>
                        </div>
                        <div className="text-base font-bold text-slate-100 mt-0.5">
                          {msg.evidenceCard.temperature}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weather Intelligence Note (Section 7 requirement) */}
                {msg.intelligence && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300 animate-fadeIn">
                    <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Weather Intelligence</span>
                    </div>
                    <p className="leading-relaxed text-slate-300">
                      Forecast agreement is {msg.intelligence.forecastAgreement.toLowerCase()} because available forecast models differ slightly on rainfall timing.
                    </p>
                  </div>
                )}

                {/* Action Buttons (Section 7 requirement: [Hourly forecast] [Open weather map] [Set alert]) */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.actionButtons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() => handleActionButton(btn.actionType)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700/80 transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <span>{btn.label}</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Source attribution */}
                {msg.sourceAttribution && (
                  <div className="text-[10px] text-slate-400 pl-1">
                    Source: {msg.sourceAttribution} · Interpreted by AI
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Synthesizing multi-model forecast data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 md:p-4 border-t border-slate-800/80 bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl px-3.5 py-1.5 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Ask WeatherGPT (e.g. "Will it rain tomorrow evening?")'}
              disabled={isLoading}
              className="flex-1 bg-transparent py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={toggleSpeechInput}
              title={isListening ? 'Stop listening' : 'Voice input'}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 text-[11px] text-slate-400 text-center">
          WeatherGPT interprets verified meteorological data. It does not invent forecast numbers.
        </div>
      </div>
    </div>
  );
};
