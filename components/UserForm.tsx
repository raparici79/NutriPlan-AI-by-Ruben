import React, { useState } from 'react';
import { UserProfile, Gender, GoalType, DaySchedule } from '../types';
import { SparklesIcon, CalendarIcon, ClockIcon, UserIcon, ArrowRightIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface UserFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  
  // Initialize schedule
  const initialSchedule: Record<string, DaySchedule> = {};
  DAYS_OF_WEEK.forEach(day => {
    initialSchedule[day] = { isWorkout: false, time: '18:00' };
  });

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    planName: '',
    gender: Gender.MALE,
    goal: GoalType.MUSCLE,
    schedule: initialSchedule
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateDaySchedule = (day: string, field: keyof DaySchedule, value: any) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule![day],
          [field]: value
        }
      }
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (
      formData.name && 
      formData.age && 
      formData.height && 
      formData.weight && 
      formData.schedule
    ) {
      // Default plan name if empty
      const finalData = {
        ...formData,
        planName: formData.planName || `Plan ${new Date().toLocaleDateString()}`
      };
      onSubmit(finalData as UserProfile);
    } else {
      alert("Por favor completa todos los campos requeridos.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-emerald-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <SparklesIcon className="w-6 h-6" />
          Configura tu Plan
        </h2>
        <p className="text-emerald-100 mt-1">Paso {step} de 3</p>
        <div className="w-full bg-emerald-800/30 h-1.5 mt-4 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Datos Personales
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre para este Plan</label>
              <div className="relative">
                <input
                  type="text"
                  name="planName"
                  value={formData.planName || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Ej. Definición Verano 2025"
                />
                <PencilSquareIcon className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Opcional. Si lo dejas vacío, usaremos la fecha actual.</p>
            </div>

            <hr className="border-slate-100" />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tu Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sexo</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="70"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800">Objetivo Principal</h3>
            <div className="grid grid-cols-1 gap-4">
              {[GoalType.MUSCLE, GoalType.TONE].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setFormData(prev => ({ ...prev, goal }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.goal === goal
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-emerald-300 text-slate-600'
                  }`}
                >
                  <span className="font-semibold block">{goal}</span>
                  <span className="text-sm opacity-80">
                    {goal === GoalType.MUSCLE 
                      ? "Enfoque en hipertrofia y superávit calórico controlado." 
                      : "Enfoque en recomposición corporal y déficit ligero."}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Horario de Entrenamiento
            </h3>
            <p className="text-sm text-slate-600">Selecciona los días que entrenas y tu hora habitual.</p>
            
            <div className="space-y-3">
              {DAYS_OF_WEEK.map(day => {
                const isWorkout = formData.schedule?.[day]?.isWorkout || false;
                const time = formData.schedule?.[day]?.time || '18:00';

                return (
                  <div key={day} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${isWorkout ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                    <div className="flex-1 flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isWorkout}
                          onChange={(e) => updateDaySchedule(day, 'isWorkout', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                      <span className={`font-medium ${isWorkout ? 'text-emerald-900' : 'text-slate-500'}`}>{day}</span>
                    </div>

                    {isWorkout ? (
                      <div className="flex items-center gap-2 animate-fade-in">
                        <ClockIcon className="w-4 h-4 text-emerald-600" />
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => updateDaySchedule(day, 'time', e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-emerald-200 text-sm focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                        />
                      </div>
                    ) : (
                       <span className="text-sm text-slate-400 italic px-2">Descanso</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition"
              disabled={isLoading}
            >
              Atrás
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-8 py-2.5 rounded-lg bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generando...' : step === 3 ? 'Crear Plan' : 'Siguiente'}
            {!isLoading && step < 3 && <ArrowRightIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};