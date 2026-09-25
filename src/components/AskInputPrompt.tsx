import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/mockData';
import { Language } from '../types/weather';

interface AskInputPromptProps {
  onAsk: (question: string) => void;
  language?: Language;
  disabled?: boolean;
}

export const AskInputPrompt: React.FC<AskInputPromptProps> = ({
  onAsk,
  language = 'en',
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const suggestedQuestions = [
    t.suggestedQ1,
    t.suggestedQ2,
    t.suggestedQ3,
    t.suggestedQ4,
    t.suggestedQ5,
  ];

  // Speech Recognition setup (Web Speech API)
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      setSpeechSupported(false);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US';
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onAsk(query.trim());
      setQuery('');
    }
  };

  const handleSelectSuggested = (qText: string) => {
    onAsk(qText);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl transition-all">
      {/* Heading & Subtitle */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            {t.askHeading}
          </h2>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          {t.askSubtitle}
        </p>
      </div>

      {/* Prominent Conversational Input */}
      <form onSubmit={handleSubmit} className="relative mt-2">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/80 border border-slate-700/70 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all shadow-inner">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isListening ? 'Listening to speech...' : t.inputPlaceholder}
            disabled={disabled}
            className="flex-1 bg-transparent px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />

          {/* Voice button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Speak your question'}
            className={`p-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
            <span className="hidden sm:inline">{t.voiceButton}</span>
          </button>

          {/* Ask button */}
          <button
            type="submit"
            disabled={!query.trim() || disabled}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <span>{t.askButton}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggested Inquiries (No pill-wrapping badges; clean clickable text tabs) */}
      <div className="mt-5 pt-4 border-t border-slate-800/60">
        <div className="text-xs font-medium text-slate-400 mb-2.5">
          {t.suggestedQuestionsTitle}
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectSuggested(sq)}
              className="text-xs text-slate-300 hover:text-cyan-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 px-3.5 py-1.5 rounded-lg transition-all text-left flex items-center gap-1.5 active:scale-95"
            >
              <span className="text-cyan-400/80 text-[11px]">→</span>
              <span>"{sq}"</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
