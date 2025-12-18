import React, { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  "Analizando tu perfil metabólico...",
  "Calculando requerimientos calóricos...",
  "Seleccionando fuentes de proteína óptimas...",
  "Equilibrando macronutrientes...",
  "Diseñando tu estrategia de suplementación...",
  "Finalizando tu plan semanal..."
];

export const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">🥗</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        Creando tu Plan Perfecto
      </h3>
      <p className="text-slate-500 h-6 transition-all duration-500">
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </div>
  );
};