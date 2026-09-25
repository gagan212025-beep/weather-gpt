export type Language = 'en' | 'hi' | 'kn';

export type WeatherRiskLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export type PersonalizedMode = 'general' | 'student' | 'commuter' | 'farmer' | 'outdoor' | 'event_planner';

export interface LocationInfo {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  isFavorite?: boolean;
}

export interface WeatherData {
  location: LocationInfo;
  temperature: number; // in Celsius
  feelsLike: number;
  condition: string;
  conditionCode: string; // 'partly-cloudy', 'rain', 'thunderstorm', 'clear', etc.
  rainProbability: number; // percentage (0-100)
  expectedRainfallMm: string;
  humidity: number; // percentage
  windSpeed: number; // km/h
  windDirection: string; // e.g. "WSW"
  windGusts?: number;
  uvIndex: number;
  pressure: number; // hPa
  visibility: number; // km
  airQualityIndex: number;
  airQualityStatus: string;
  dewPoint: number;
  sunrise: string;
  sunset: string;
  updatedTimeAgo: string;
  dataSource: string;
  isMockData: boolean;
}

export interface HourlyForecastItem {
  timeStr: string; // e.g. "10 AM"
  hour: number;
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  rainProbability: number;
  rainfallMm: number;
  windSpeed: number;
  humidity: number;
}

export interface DailyForecastItem {
  id: string;
  dayName: string; // e.g. "Today", "Tomorrow", "Saturday"
  dateStr: string; // e.g. "Sep 25"
  condition: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
  rainProbability: number;
  rainfallMm: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  summary: string;
  details: {
    morning: { temp: number; rain: number; condition: string };
    afternoon: { temp: number; rain: number; condition: string };
    evening: { temp: number; rain: number; condition: string };
    night: { temp: number; rain: number; condition: string };
  };
}

export interface WeatherIntelligenceData {
  riskLevel: WeatherRiskLevel;
  riskScore: number; // 0-100
  riskSummary: string;
  forecastAgreement: 'High' | 'Moderate' | 'Divergent';
  agreementDetails: string;
  mainFactors: string[];
  whyExplanation: string;
  modelsComparison: {
    name: string;
    agency: string;
    temperature: number;
    rainProb: number;
    rainfallMm: string;
    agreementLevel: 'Agreement' | 'Minor Variance' | 'Outlier';
  }[];
  confidenceDisclaimer: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'Red' | 'Orange' | 'Yellow';
  severityText: string;
  area: string;
  validTime: string;
  reason: string;
  recommendedAction: string;
  whyThisAlert: string;
  source: string;
  isDemo: boolean;
}

export interface PersonalizedAdviceItem {
  mode: PersonalizedMode;
  label: string;
  icon: string;
  title: string;
  advice: string;
  actionChecklist: string[];
  riskLevel: WeatherRiskLevel;
}

export interface ClimateData {
  locationName: string;
  annualTempAnomalies: { year: number; anomaly: number }[];
  monthlyRainfallComparison: { month: string; historicalNorm: number; recentYear: number }[];
  extremeWeatherEvents: {
    year: number;
    eventName: string;
    category: string;
    impact: string;
    trendNote: string;
  }[];
  educationalNote: string;
  datasetNotice: string;
}

export interface AgroCropData {
  cropName: string;
  growthStage: string;
  moistureStatus: string;
  soilMoisturePercentage: number;
  irrigationRecommendation: string;
  diseasePestRisk: 'Low' | 'Elevated' | 'High';
  sprayWindowAdvice: string;
  harvestAdvisory: string;
  temperatureSuitability: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  evidenceCard?: {
    rainProbability: number;
    expectedRainfall: string;
    windSpeed: string;
    temperature: string;
    condition: string;
    uvIndex?: number;
    humidity?: number;
  };
  intelligence?: {
    riskLevel: WeatherRiskLevel;
    forecastAgreement: string;
    factors: string[];
    explanation: string;
  };
  actionButtons?: {
    label: string;
    actionType: 'hourly' | 'map' | 'alerts' | 'agriculture' | 'listen';
  }[];
  sourceAttribution?: string;
}
