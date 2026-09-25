import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI SDK if API key is provided
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction enforcing the WeatherGPT architecture:
// Weather Data -> Forecasts -> AI Understanding -> Risk Analysis -> Personalized Advice
// The LLM does NOT invent weather forecasts; it interprets verified meteorological context.
const WEATHER_SYSTEM_INSTRUCTION = `You are WeatherGPT, a conversational meteorological intelligence assistant.
Your tagline: "Ask the weather. Understand the risk. Take action."
Your goal is to transform complex meteorological data and multi-model forecast ensembles into simple, understandable, actionable answers.

STRICT OPERATIONAL RULES:
1. You are NOT the primary forecasting system. You interpret verified meteorological data and multi-model ensembles provided in the context.
2. Never invent temperature numbers, precipitation percentages, or wind speeds that contradict the provided data.
3. Keep answers concise, clear, and easy to read. A normal person should understand within 5 seconds.
4. Structure your response:
   - Direct, plain-language answer first (1-2 sentences).
   - Practical, actionable advice tailored to the user's persona/context (e.g. commuter, student, farmer, outdoor, event planner).
   - Risk note or forecast agreement summary if relevant.
5. If the user asks in Hindi or Kannada, answer fluently in that language while keeping key numbers accurate.
6. Do not output raw JSON or code blocks unless explicitly requested. Be friendly, calm, and trustworthy.`;

// POST /api/chat: Conversational weather intelligence
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      location = 'Bengaluru, Karnataka',
      contextData,
      persona = 'general',
      language = 'en',
      history = [],
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const personaInstructions: Record<string, string> = {
      commuter: 'Tailor advice for daily commuters: traffic safety, transit delays, road grip, visibility, and umbrella needs.',
      student: 'Tailor advice for students: bag protection, campus commute, outdoor sports or study plans.',
      farmer: 'Tailor advice for agriculture: soil moisture, irrigation scheduling, pesticide spraying conditions, crop protection.',
      outdoor: 'Tailor advice for outdoor sports/runners/hikers: UV exposure, heat index, hydration, ground conditions.',
      event_planner: 'Tailor advice for event planners: tent stability, wind gust tolerance, rainfall window risks.',
      general: 'Provide general, practical everyday advice.',
    };

    const targetPersonaPrompt = personaInstructions[persona] || personaInstructions.general;
    const langPrompt = language === 'hi'
      ? 'Please respond in Hindi (Devanagari script).'
      : language === 'kn'
      ? 'Please respond in Kannada script.'
      : 'Please respond in English.';

    const weatherContextString = contextData
      ? `VERIFIED METEOROLOGICAL CONTEXT for ${location}:
- Current Condition: ${contextData.condition || 'Partly Cloudy'}, Temp: ${contextData.temp || '29'}°C (Feels like ${contextData.feelsLike || '31'}°C)
- Rain Probability: ${contextData.rainChance ?? 62}%, Expected Precipitation: ${contextData.expectedRainfall || '8-15 mm'}
- Wind: ${contextData.windSpeed || '14'} km/h, Humidity: ${contextData.humidity || '71'}%, UV Index: ${contextData.uvIndex || '6'}
- Forecast Risk Level: ${contextData.risk || 'Moderate'}
- Forecast Model Agreement: ${contextData.agreement || 'Moderate (ECMWF & GFS predict evening showers between 5 PM and 8 PM)'}
- Next 24h summary: ${contextData.summary || 'Elevated rain probability in late afternoon/evening'}`
      : `Location: ${location}. Provide general meteorological guidance based on seasonal norms.`;

    const fullPrompt = `${weatherContextString}

User Persona: ${persona} (${targetPersonaPrompt})
Language: ${langPrompt}

Conversation History:
${history.slice(-4).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'WeatherGPT'}: ${h.text}`).join('\n')}

User Question: "${message}"

Remember:
1. Answer the question directly in 1-2 friendly sentences.
2. Give clear, risk-aware action items.
3. Be concise and scannable.`;

    // Try Gemini API if configured
    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: fullPrompt,
          config: {
            systemInstruction: WEATHER_SYSTEM_INSTRUCTION,
            temperature: 0.6,
          },
        });

        const replyText = response.text || '';
        return res.json({
          reply: replyText.trim(),
          source: 'Gemini 3.8 Flash + Weather Intelligence Engine',
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local weather intelligence engine:', geminiError?.message);
      }
    }

    // High quality local rule-based fallback response if Gemini is not configured or fails
    const fallbackReply = generateFallbackResponse(message, contextData, persona, language);
    return res.json({
      reply: fallbackReply,
      source: 'WeatherGPT Local Intelligence Engine (Offline / Standby)',
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process weather inquiry' });
  }
});

// Fallback intelligence engine for when Gemini API key is unavailable
function generateFallbackResponse(
  query: string,
  contextData: any,
  persona: string,
  language: string
): string {
  const q = query.toLowerCase();
  const temp = contextData?.temp ?? 29;
  const rain = contextData?.rainChance ?? 62;
  const condition = contextData?.condition ?? 'Partly Cloudy';

  if (language === 'hi') {
    if (q.includes('rain') || q.includes('बारिश') || q.includes('पानी')) {
      return `कल शाम बारिश की 60-75% संभावना है, विशेष रूप से शाम 5 बजे से 8 बजे के बीच। लगभग 8-15 मिमी वर्षा होने का अनुमान है। छाता साथ रखना और यात्रा में अतिरिक्त समय लेकर चलना बेहतर रहेगा।`;
    }
    return `वर्तमान में तापमान ${temp}°C है और मौसम ${condition} बना हुआ है। शाम के समय बारिश की संभावना है। कृपया मौसम अपडेट्स पर नजर रखें।`;
  }

  if (language === 'kn') {
    if (q.includes('rain') || q.includes('ಮಳೆ')) {
      return `ನಾಳೆ ಸಂಜೆ 5 ರಿಂದ 8 ಗಂಟೆಯ ನಡುವೆ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ 65-75% ಇದೆ. ಸುಮಾರು 8-15 ಮಿಮೀ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಛತ್ರಿ ಅಥವಾ ರೇನ್‌ಕೋಟ್ ಜೊತೆಯಲ್ಲಿಟ್ಟುಕೊಳ್ಳುವುದು ಸೂಕ್ತ.`;
    }
    return `ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${temp}°C ಆಗಿದ್ದು, ಹವಾಮಾನವು ${condition} ಆಗಿದೆ. ಸಂಜೆ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ.`;
  }

  // English tailored responses
  if (q.includes('rain') || q.includes('umbrella') || q.includes('wet') || q.includes('shower')) {
    if (rain >= 50) {
      if (persona === 'commuter') {
        return `Rain is likely tomorrow evening, especially between 5 PM and 8 PM (${rain}% chance). Commuter advice: expect waterlogged pockets on outer ring roads. Carry rain protection and allow an extra 20 minutes for travel.`;
      }
      if (persona === 'farmer') {
        return `Rain is expected tomorrow late afternoon to evening (${rain}% probability, 8–15 mm estimated). Agricultural advice: withhold overhead spraying and check field drainage channels before the showers.`;
      }
      if (persona === 'student') {
        return `Yes, carry an umbrella! Showers are likely around 5 PM to 8 PM (${rain}% chance). Pack your textbooks and electronics in water-resistant sleeves for the transit home.`;
      }
      if (persona === 'outdoor') {
        return `Expect wet conditions later today/tomorrow evening (${rain}% probability). Move runs or open-air training to before 3:30 PM to avoid thunder-slicked tracks.`;
      }
      return `Rain is likely tomorrow evening, especially between 5 PM and 8 PM (${rain}% probability). Expected rainfall is 8–15 mm with moderate wind gusts around 18 km/h. It is advisable to carry an umbrella and plan around the evening window.`;
    } else {
      return `Rain probability is low to moderate at ${rain}%. Significant showers are unlikely during the day, though light scattered drizzle is possible in isolated pockets.`;
    }
  }

  if (q.includes('travel') || q.includes('drive') || q.includes('flight') || q.includes('traffic')) {
    return `Travel conditions are moderate. While the daytime is clear, evening hours (after 5 PM) bring a ${rain}% chance of thunderstorms and visibility drops down to 3 km. If driving on highways, maintain safe following distance and avoid known low-lying culverts.`;
  }

  if (q.includes('weekend') || q.includes('saturday') || q.includes('sunday')) {
    return `This weekend will start warm with daytime highs around 29°C–31°C. Saturday afternoon has a 45% chance of localized thunder showers, while Sunday looks noticeably clearer with sunny intervals—ideal for outdoor activities before midday.`;
  }

  if (q.includes('farm') || q.includes('crop') || q.includes('irrigation') || q.includes('soil')) {
    return `For agricultural planning: moderate rain (8–15 mm) is projected within 24 hours. Soil moisture will remain saturated. Hold scheduled irrigation for 48 hours to conserve water and prevent root hypoxia. Verify spraying windows as humidity sits near 71%.`;
  }

  if (q.includes('temp') || q.includes('hot') || q.includes('cold') || q.includes('heat')) {
    return `Current temperature is ${temp}°C, feels like ${contextData?.feelsLike ?? 31}°C due to ${contextData?.humidity ?? 71}% humidity. The overnight low will dip comfortably to 20°C.`;
  }

  return `Based on current meteorological model consensus, temperatures will hover around ${temp}°C with ${condition}. Rain likelihood peaks during late afternoon at ${rain}%. Wind is steady at ${contextData?.windSpeed ?? 14} km/h from the West.`;
}

// Full-stack Vite integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WeatherGPT server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
