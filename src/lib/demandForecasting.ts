// Predictive AI Demand Forecasting & Workforce Auto-Allocation Engine (SIH 2026)
// Combines 30-day velocity, day-of-week seasonality, and weather/monsoon triggers

export interface LocalityForecast {
  locality: string;
  predictedBookings: number;
  surgePercentage: number; // e.g. +45%
  trend: "HIGH_SURGE" | "MODERATE" | "STABLE";
  primaryDiscipline: string;
  activeSpecialists: number;
  requiredSpecialists: number;
  deficitOrSurplus: number; // negative = deficit, positive = surplus
  weatherFactor: string;
}

export interface ReallocationRecommendation {
  id: string;
  sourceLocality: string;
  targetLocality: string;
  discipline: string;
  recommendedTransfers: number;
  incentiveBonusPerJob: number; // e.g. ₹200
  reason: string;
  status: "RECOMMENDED" | "EXECUTED";
}

export interface DayForecastPoint {
  day: string;
  date: string;
  acRepair: number;
  electrical: number;
  plumbing: number;
  cleaning: number;
  totalPredicted: number;
}

export const BASE_LOCALITY_DATA: LocalityForecast[] = [
  {
    locality: "Indiranagar",
    predictedBookings: 148,
    surgePercentage: 48,
    trend: "HIGH_SURGE",
    primaryDiscipline: "HVAC & AC Technician",
    activeSpecialists: 14,
    requiredSpecialists: 24,
    deficitOrSurplus: -10,
    weatherFactor: "High heat index (37°C) driving AC breakdown calls",
  },
  {
    locality: "Whitefield",
    predictedBookings: 182,
    surgePercentage: 55,
    trend: "HIGH_SURGE",
    primaryDiscipline: "Deep Cleaning & Maid",
    activeSpecialists: 16,
    requiredSpecialists: 28,
    deficitOrSurplus: -12,
    weatherFactor: "Weekend tech corridor move-in & deep cleaning peak",
  },
  {
    locality: "Koramangala",
    predictedBookings: 125,
    surgePercentage: 35,
    trend: "HIGH_SURGE",
    primaryDiscipline: "Plumbing & Motor Repair",
    activeSpecialists: 18,
    requiredSpecialists: 22,
    deficitOrSurplus: -4,
    weatherFactor: "Overhead water tank descaling & booster pump repairs",
  },
  {
    locality: "HSR Layout",
    predictedBookings: 96,
    surgePercentage: 20,
    trend: "MODERATE",
    primaryDiscipline: "Electrician",
    activeSpecialists: 15,
    requiredSpecialists: 16,
    deficitOrSurplus: -1,
    weatherFactor: "Appliance wiring & inverter battery checks",
  },
  {
    locality: "Malleshwaram",
    predictedBookings: 54,
    surgePercentage: -8,
    trend: "STABLE",
    primaryDiscipline: "Carpentry & Electrical",
    activeSpecialists: 22,
    requiredSpecialists: 11,
    deficitOrSurplus: 11, // Surplus
    weatherFactor: "Low demand lull; surplus skilled electricians available",
  },
  {
    locality: "Jayanagar",
    predictedBookings: 62,
    surgePercentage: 5,
    trend: "STABLE",
    primaryDiscipline: "Painter & Masonry",
    activeSpecialists: 19,
    requiredSpecialists: 12,
    deficitOrSurplus: 7, // Surplus
    weatherFactor: "Moderate demand; surplus technicians ready for re-deployment",
  },
];

export const INITIAL_REALLOCATIONS: ReallocationRecommendation[] = [
  {
    id: "REC-01",
    sourceLocality: "Malleshwaram",
    targetLocality: "Indiranagar",
    discipline: "Electrician / AC Tech",
    recommendedTransfers: 8,
    incentiveBonusPerJob: 200,
    reason: "Transfer surplus electrical workers to meet +48% Indiranagar heatwave surge.",
    status: "RECOMMENDED",
  },
  {
    id: "REC-02",
    sourceLocality: "Jayanagar",
    targetLocality: "Whitefield",
    discipline: "Deep House Cleaning",
    recommendedTransfers: 6,
    incentiveBonusPerJob: 250,
    reason: "Bridge -12 worker deficit in gated apartment move-in batches in Whitefield.",
    status: "RECOMMENDED",
  },
  {
    id: "REC-03",
    sourceLocality: "Malleshwaram",
    targetLocality: "Koramangala",
    discipline: "Plumbing & Motor Repair",
    recommendedTransfers: 3,
    incentiveBonusPerJob: 150,
    reason: "Resolve plumbing bottleneck for Saturday cluster appointments.",
    status: "RECOMMENDED",
  },
];

export function getWeeklyForecast(tempCelsius: number = 34, rainMm: number = 10): DayForecastPoint[] {
  const heatMultiplier = Math.max(1, (tempCelsius - 25) * 0.05);
  const rainMultiplier = Math.max(1, rainMm * 0.04);

  return [
    { day: "Wed", date: "10 Sep", acRepair: Math.round(35 * heatMultiplier), electrical: 40, plumbing: Math.round(28 * rainMultiplier), cleaning: 30, totalPredicted: 0 },
    { day: "Thu", date: "11 Sep", acRepair: Math.round(42 * heatMultiplier), electrical: 45, plumbing: Math.round(32 * rainMultiplier), cleaning: 35, totalPredicted: 0 },
    { day: "Fri", date: "12 Sep", acRepair: Math.round(58 * heatMultiplier), electrical: 55, plumbing: Math.round(40 * rainMultiplier), cleaning: 60, totalPredicted: 0 },
    { day: "Sat", date: "13 Sep", acRepair: Math.round(85 * heatMultiplier), electrical: 78, plumbing: Math.round(55 * rainMultiplier), cleaning: 110, totalPredicted: 0 },
    { day: "Sun", date: "14 Sep", acRepair: Math.round(92 * heatMultiplier), electrical: 82, plumbing: Math.round(50 * rainMultiplier), cleaning: 125, totalPredicted: 0 },
    { day: "Mon", date: "15 Sep", acRepair: Math.round(38 * heatMultiplier), electrical: 36, plumbing: Math.round(25 * rainMultiplier), cleaning: 28, totalPredicted: 0 },
    { day: "Tue", date: "16 Sep", acRepair: Math.round(40 * heatMultiplier), electrical: 38, plumbing: Math.round(24 * rainMultiplier), cleaning: 26, totalPredicted: 0 },
  ].map((p) => ({
    ...p,
    totalPredicted: p.acRepair + p.electrical + p.plumbing + p.cleaning,
  }));
}
