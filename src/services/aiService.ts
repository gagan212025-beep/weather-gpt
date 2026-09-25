import { ChatMessage, WeatherData, WeatherIntelligenceData, PersonalizedMode, Language } from '../types/weather';

export interface SendMessageOptions {
  message: string;
  weather?: WeatherData;
  intelligence?: WeatherIntelligenceData;
  persona?: PersonalizedMode;
  language?: Language;
  history?: { sender: 'user' | 'assistant'; text: string }[];
}

export class AIService {
  async sendMessage(options: SendMessageOptions): Promise<ChatMessage> {
    const {
      message,
      weather,
      intelligence,
      persona = 'general',
      language = 'en',
      history = [],
    } = options;

    const contextData = weather
      ? {
          temp: weather.temperature,
          feelsLike: weather.feelsLike,
          condition: weather.condition,
          rainChance: weather.rainProbability,
          expectedRainfall: weather.expectedRainfallMm,
          windSpeed: weather.windSpeed,
          humidity: weather.humidity,
          uvIndex: weather.uvIndex,
          risk: intelligence?.riskLevel || 'Moderate',
          agreement: intelligence?.agreementDetails || 'Moderate consensus',
        }
      : undefined;

    let replyText = '';
    let sourceAttribution = 'WeatherGPT Meteorological Intelligence';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          location: weather?.location.name || 'Bengaluru, Karnataka',
          contextData,
          persona,
          language,
          history,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        replyText = data.reply;
        sourceAttribution = data.source || sourceAttribution;
      } else {
        throw new Error('Server returned non-200');
      }
    } catch {
      // Offline fallback
      replyText = this.getLocalFallback(message, weather, persona, language);
      sourceAttribution = 'WeatherGPT Local Rules Engine (Offline)';
    }

    // Build evidence card for the response
    const hasRainQuery = /rain|umbrella|water|wet|shower|storm|travel|outside/i.test(message);
    const evidenceCard = weather
      ? {
          rainProbability: weather.rainProbability,
          expectedRainfall: weather.expectedRainfallMm || '8–15 mm',
          windSpeed: `${weather.windSpeed} km/h`,
          temperature: `${weather.temperature}°C`,
          condition: weather.condition,
          uvIndex: weather.uvIndex,
          humidity: weather.humidity,
        }
      : undefined;

    const intelligenceCard = intelligence
      ? {
          riskLevel: intelligence.riskLevel,
          forecastAgreement: intelligence.forecastAgreement,
          factors: intelligence.mainFactors,
          explanation: intelligence.whyExplanation,
        }
      : undefined;

    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      evidenceCard: hasRainQuery || weather ? evidenceCard : undefined,
      intelligence: intelligenceCard,
      actionButtons: [
        { label: 'Hourly forecast', actionType: 'hourly' },
        { label: 'Open weather map', actionType: 'map' },
        { label: 'Set alert', actionType: 'alerts' },
      ],
      sourceAttribution,
    };
  }

  private getLocalFallback(
    message: string,
    weather?: WeatherData,
    persona?: PersonalizedMode,
    language?: Language
  ): string {
    const q = message.toLowerCase();
    const temp = weather?.temperature ?? 29;
    const rain = weather?.rainProbability ?? 62;

    if (language === 'hi') {
      return `कल शाम बारिश की ${rain}% संभावना है, विशेष रूप से शाम 5 बजे से 8 बजे के बीच। लगभग 8-15 मिमी वर्षा होने का अनुमान है। छाता साथ रखना सुरक्षित रहेगा।`;
    }

    if (language === 'kn') {
      return `ನಾಳೆ ಸಂಜೆ 5 ರಿಂದ 8 ರ ನಡುವೆ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ ${rain}% ಇದೆ. 8-15 ಮಿಮೀ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ದಯವಿಟ್ಟು ಛತ್ರಿ ಕೊಂಡೊಯ್ಯಿರಿ.`;
    }

    if (q.includes('rain') || q.includes('umbrella')) {
      if (persona === 'commuter') {
        return `Rain is likely tomorrow evening, especially between 5 PM and 8 PM (${rain}% chance). Allow extra travel time on highways and carry an umbrella.`;
      }
      if (persona === 'farmer') {
        return `Rain is likely tomorrow evening (8–15 mm expected). Hold off scheduled irrigation and inspect low-lying field drainage channels.`;
      }
      return `Rain is likely tomorrow evening, especially between 5 PM and 8 PM. Expected precipitation is 8–15 mm with moderate wind gusts around 18 km/h.`;
    }

    if (q.includes('travel')) {
      return `Travel conditions are good through midday, but evening transit after 5 PM faces moderate thunderstorm risk and slick roadways.`;
    }

    if (q.includes('weekend')) {
      return `This weekend starts with warm intervals (29°C–31°C). Saturday afternoon may bring a 45% chance of thunder showers, while Sunday looks predominantly clear.`;
    }

    return `Current temperature is ${temp}°C with ${weather?.condition || 'Partly Cloudy'}. Rain likelihood sits at ${rain}%, peaking late in the afternoon.`;
  }
}

export const aiService = new AIService();
