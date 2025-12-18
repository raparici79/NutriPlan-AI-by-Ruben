export enum GoalType {
  MUSCLE = 'Muscular (Ganar masa)',
  TONE = 'Tonificar (Definición/Mantenimiento)'
}

export enum Gender {
  MALE = 'Hombre',
  FEMALE = 'Mujer',
  OTHER = 'Otro'
}

export interface DaySchedule {
  isWorkout: boolean;
  time?: string; // HH:mm format
}

export interface UserProfile {
  planName?: string; // New field for identifying the plan
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  goal: GoalType;
  schedule: Record<string, DaySchedule>; // Key is day name (e.g., 'Lunes')
}

export interface Meal {
  name: string;
  description: string;
  ingredients: string[];
}

export interface DayPlan {
  dayName: string;
  breakfast: Meal;
  midMorning: Meal; // New: Almuerzo de media mañana
  lunch: Meal;      // Comida principal
  snack: Meal;      // Merienda
  dinner: Meal;
  workoutNutrition: {
    preWorkout?: string;
    postWorkout?: string;
    notes: string;
  };
}

export interface FoodGuide {
  breakfastOptions: string[];
  midMorningOptions: string[]; // Almuerzo (media mañana)
  lunchOptions: string[];      // Comida (principal)
  snackOptions: string[];      // Merienda
  dinnerOptions: string[];     // Cena
}

export interface WeeklyPlan {
  introduction: string;
  weeklySchedule: DayPlan[];
  foodGuide: FoodGuide;
  generalAdvice: string;
  supplements: {
    creatine: {
      recommended: boolean;
      reason: string;
      dosage?: string;
    };
    wheyProtein: {
      recommended: boolean;
      reason: string;
      dosage?: string;
    };
  };
}

export interface ProgressEntry {
  id: string;
  date: string;
  weight: number;
  waist?: number;
  notes: string;
  workoutPerformance?: string; // e.g., "Good", "Tired", "PR hit"
}

export interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  profile: UserProfile;
  plan: WeeklyPlan;
}