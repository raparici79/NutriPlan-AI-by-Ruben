import React from 'react';
import { SavedPlan } from '../types';
import { TrashIcon, ArrowRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface SavedPlansListProps {
  plans: SavedPlan[];
  onSelectPlan: (plan: SavedPlan) => void;
  onDeletePlan: (id: string) => void;
  onCreateNew: () => void;
}

export const SavedPlansList: React.FC<SavedPlansListProps> = ({ plans, onSelectPlan, onDeletePlan, onCreateNew }) => {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <CalendarDaysIcon className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No tienes planes guardados</h3>
        <p className="text-slate-500 mb-8 max-w-sm">
          Crea tu primer plan nutricional personalizado con IA para empezar.
        </p>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
        >
          Crear mi primer plan
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Mis Planes</h2>
           <p className="text-slate-500">Historial de tus planificaciones nutricionales.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition flex items-center gap-2"
        >
          + Crear Nuevo
        </button>
      </div>

      <div className="grid gap-4">
        {[...plans].reverse().map((saved) => (
          <div 
            key={saved.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 cursor-pointer" onClick={() => onSelectPlan(saved)}>
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">
                    {saved.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                        {saved.profile.goal.split(' ')[0]}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                   <span>Creado: {new Date(saved.createdAt).toLocaleDateString()}</span>
                   <span>•</span>
                   <span>{saved.profile.weight}kg</span>
                </div>
                <p className="text-slate-600 text-sm line-clamp-2 pr-8">
                    {saved.plan.introduction}
                </p>
              </div>

              <div className="flex items-center gap-2 pl-4 border-l border-slate-100 ml-4 self-center">
                 <button
                    onClick={() => onDeletePlan(saved.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar plan"
                 >
                    <TrashIcon className="w-5 h-5" />
                 </button>
                 <button
                    onClick={() => onSelectPlan(saved)}
                    className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                    title="Ver plan"
                 >
                    <ArrowRightIcon className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};