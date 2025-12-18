import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, WeeklyPlan, Meal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mealSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Nombre del plato" },
    description: { type: Type.STRING, description: "Breve descripción" },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Lista de ingredientes clave"
    }
  },
  required: ["name", "description", "ingredients"]
};

const dayPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dayName: { type: Type.STRING, description: "Día de la semana (e.g., Lunes)" },
    breakfast: mealSchema,
    midMorning: mealSchema, // Added schema for Almuerzo
    lunch: mealSchema,
    snack: mealSchema,
    dinner: mealSchema,
    workoutNutrition: {
      type: Type.OBJECT,
      properties: {
        preWorkout: { type: Type.STRING, nullable: true },
        postWorkout: { type: Type.STRING, nullable: true },
        notes: { type: Type.STRING }
      },
      required: ["notes"]
    }
  },
  required: ["dayName", "breakfast", "midMorning", "lunch", "snack", "dinner", "workoutNutrition"]
};

const foodGuideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    breakfastOptions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Lista de 5 opciones de desayuno variadas" 
    },
    midMorningOptions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Lista de 5 opciones para el almuerzo de media mañana" 
    },
    lunchOptions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Lista de 5 opciones para la comida principal (mediodía)" 
    },
    snackOptions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Lista de 5 opciones de merienda (tarde)"
    },
    dinnerOptions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Lista de 5 opciones para la cena (noche)"
    }
  },
  required: ["breakfastOptions", "midMorningOptions", "lunchOptions", "snackOptions", "dinnerOptions"]
};

const weeklyPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    introduction: { type: Type.STRING, description: "Un breve resumen motivacional del plan." },
    weeklySchedule: {
      type: Type.ARRAY,
      items: dayPlanSchema,
      description: "Plan para 7 días de la semana."
    },
    foodGuide: foodGuideSchema,
    generalAdvice: { type: Type.STRING, description: "Consejos generales sobre hidratación, descanso, etc." },
    supplements: {
      type: Type.OBJECT,
      properties: {
        creatine: {
          type: Type.OBJECT,
          properties: {
            recommended: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            dosage: { type: Type.STRING, nullable: true }
          },
          required: ["recommended", "reason"]
        },
        wheyProtein: {
          type: Type.OBJECT,
          properties: {
            recommended: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            dosage: { type: Type.STRING, nullable: true }
          },
          required: ["recommended", "reason"]
        }
      },
      required: ["creatine", "wheyProtein"]
    }
  },
  required: ["introduction", "weeklySchedule", "foodGuide", "generalAdvice", "supplements"]
};

export const generateDietPlan = async (profile: UserProfile): Promise<WeeklyPlan> => {
  // Format the schedule for the prompt
  const scheduleDescription = Object.entries(profile.schedule)
    .map(([day, details]) => `${day}: ${details.isWorkout ? `Entreno a las ${details.time}` : 'Descanso'}`)
    .join('\n    - ');

  const prompt = `
    Actúa como un nutricionista deportivo experto.
    Crea un plan de alimentación semanal estructurado en 5 COMIDAS AL DÍA para el siguiente usuario:
    
    Perfil:
    - Nombre: ${profile.name}
    - Edad: ${profile.age}
    - Sexo: ${profile.gender}
    - Altura: ${profile.height} cm
    - Peso: ${profile.weight} kg
    - Objetivo: ${profile.goal}
    
    Horario Semanal:
    - ${scheduleDescription}

    Estructura de Comidas Requerida (5 ingestas):
    1. Desayuno
    2. Almuerzo (Snack de media mañana, ligero pero nutritivo)
    3. Comida (Plato fuerte del mediodía)
    4. Merienda (Tarde)
    5. Cena (Noche)

    Requisitos:
    1. Variedad: Usa diferentes frutas, verduras y fuentes de proteínas cada día.
    2. Suplementación: Decide si necesita Creatina y Whey Protein basándote estrictamente en su objetivo y perfil.
    3. Horarios: Ajusta las comidas alrededor de su hora de entrenamiento específica para cada día.
    4. Guía de Alimentos: Genera listas de opciones genéricas para intercambios.
    5. Devuelve la respuesta estrictamente en formato JSON según el esquema proporcionado.
    6. Todo el contenido debe estar en Español.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: weeklyPlanSchema,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as WeeklyPlan;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const generateMealAlternative = async (originalMeal: Meal, goal: string): Promise<Meal> => {
  const prompt = `
    Proporciona una alternativa saludable y diferente para la siguiente comida, manteniendo el objetivo de "${goal}".
    
    Comida original:
    - Nombre: ${originalMeal.name}
    - Descripción: ${originalMeal.description}
    - Ingredientes: ${originalMeal.ingredients.join(", ")}

    La nueva comida debe ser nutricionalmente equivalente pero con ingredientes distintos para dar variedad.
    Devuelve solo el objeto JSON de la comida.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: mealSchema,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as Meal;
  } catch (error) {
    console.error("Error generating alternative meal:", error);
    throw error;
  }
};