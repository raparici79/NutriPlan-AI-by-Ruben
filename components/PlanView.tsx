import React, { useState, useRef } from 'react';
import { WeeklyPlan, DayPlan, Meal, GoalType, FoodGuide } from '../types';
import { generateMealAlternative } from '../services/geminiService';
import { ConfirmationModal } from './ConfirmationModal';
import html2canvas from 'html2canvas';
import { 
  SunIcon, 
  MoonIcon, 
  FireIcon, 
  BeakerIcon, 
  CheckCircleIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  SparklesIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  BookOpenIcon,
  ClockIcon,
  CalendarIcon,
  LightBulbIcon,
  PlusCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface PlanViewProps {
  plan: WeeklyPlan;
  onReset: () => void;
  onUpdatePlan: (newPlan: WeeklyPlan) => void;
  userGoal: string;
}

interface MealCardProps {
  title: string;
  meal: Meal;
  icon: React.ReactNode;
  color: string;
  onUpdate: (updatedMeal: Meal) => void;
  userGoal: string;
}

// --- Helper Component for Editable Food Lists ---
interface FoodGuideListProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  colorClass: string; // e.g. "text-amber-500"
  dotClass: string; // e.g. "bg-amber-400"
  onUpdate: (newItems: string[]) => void;
}

const FoodGuideList: React.FC<FoodGuideListProps> = ({ title, icon, items, colorClass, dotClass, onUpdate }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  
  // Modal State for Deletion
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const startEdit = (index: number, currentVal: string) => {
    setEditingIndex(index);
    setEditValue(currentVal);
  };

  const saveEdit = (index: number) => {
    if (editValue.trim()) {
      const updated = [...items];
      updated[index] = editValue.trim();
      onUpdate(updated);
    }
    setEditingIndex(null);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = items.filter((_, i) => i !== deleteIndex);
      onUpdate(updated);
      setDeleteIndex(null);
    }
  };

  const addItem = () => {
    if (newValue.trim()) {
      onUpdate([...items, newValue.trim()]);
      setNewValue("");
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h3 className={`font-bold text-lg text-slate-800 mb-4 flex items-center gap-2`}>
          <div className={colorClass}>{icon}</div>
          {title}
        </h3>
        
        <ul className="space-y-3 flex-1">
          {items.map((item, i) => (
            <li key={i} className="group flex items-start gap-2 text-slate-600 text-sm min-h-[28px]">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dotClass} shrink-0`}></span>
              
              {editingIndex === i ? (
                <div className="flex-1 flex items-center gap-2">
                  <input 
                    autoFocus
                    className="flex-1 border-b border-emerald-500 outline-none bg-transparent px-1 py-0.5 text-slate-900"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(i)}
                  />
                  <button onClick={() => saveEdit(i)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded"><CheckIcon className="w-4 h-4"/></button>
                  <button onClick={() => setEditingIndex(null)} className="text-red-500 hover:bg-red-50 p-1 rounded"><XMarkIcon className="w-4 h-4"/></button>
                </div>
              ) : (
                <div className="flex-1 flex justify-between items-start">
                  <span className="leading-relaxed">{item}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 bg-white">
                    <button 
                      onClick={() => startEdit(i, item)} 
                      className="text-slate-400 hover:text-blue-600 p-0.5" 
                      title="Editar"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(i)} 
                      className="text-slate-400 hover:text-red-600 p-0.5" 
                      title="Eliminar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Add Item Section */}
        <div className="mt-4 pt-3 border-t border-slate-50">
          {isAdding ? (
            <div className="flex items-center gap-2 animate-fade-in">
               <input 
                  autoFocus
                  placeholder="Nuevo alimento..."
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-emerald-500"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
               />
               <button onClick={addItem} className="text-white bg-emerald-500 hover:bg-emerald-600 p-1.5 rounded-lg"><CheckIcon className="w-4 h-4"/></button>
               <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg"><XMarkIcon className="w-4 h-4"/></button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition px-2 py-1 rounded-lg hover:bg-emerald-50 w-full"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Añadir opción
            </button>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteIndex !== null}
        title="¿Eliminar alimento?"
        message="Esta opción desaparecerá de tu lista de recomendaciones."
        confirmText="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </>
  );
};

// --- Meal Card Component ---
const MealCard: React.FC<MealCardProps> = ({ title, meal, icon, color, onUpdate, userGoal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedMeal, setEditedMeal] = useState(meal);

  const handleSave = () => {
    onUpdate(editedMeal);
    setIsEditing(false);
  };

  const handleGenerateAlternative = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling if needed
    setIsGenerating(true);
    try {
      const alternative = await generateMealAlternative(meal, userGoal);
      setEditedMeal(alternative);
      onUpdate(alternative);
    } catch (e) {
      alert("Error generating alternative. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!meal) return null; // Safety check

  // Expanded card with visible details
  return (
    <div className={`relative group h-full`}>
      <div className={`h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-4`}>
         {/* Top Border Color */}
         <div className={`absolute top-0 left-0 w-full h-1 ${color}`}></div>

         {/* Header */}
         <div className="flex items-start justify-between gap-3">
             <div className="flex items-start gap-3">
                 <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${color.replace('bg-', 'bg-').replace('500', '100')} ${color.replace('bg-', 'text-').replace('500', '700')}`}>
                    {icon}
                 </div>
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{title}</h4>
                    <p className="font-bold text-slate-900 text-lg leading-tight">{meal.name}</p>
                 </div>
             </div>
             
             {/* Actions */}
             <div className="flex gap-1 shrink-0">
                {!isEditing && (
                  <>
                    <button 
                      onClick={handleGenerateAlternative} 
                      disabled={isGenerating}
                      title="Sugerir alternativa IA"
                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                    >
                      {isGenerating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                      title="Editar manualmente"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
             </div>
         </div>

         {/* Content - Always Visible */}
         {!isEditing ? (
             <div className="flex flex-col gap-3">
                 <p className="text-slate-600 text-sm leading-relaxed border-l-2 border-slate-100 pl-3">
                    {meal.description}
                 </p>
                 <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {meal.ingredients.map((ing, i) => (
                      <span key={i} className="text-xs font-medium px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
                        {ing}
                      </span>
                    ))}
                 </div>
             </div>
         ) : (
             /* Edit Mode Inputs */
             <div className="flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-emerald-600">Editando</span>
                  <div className="flex gap-2">
                     <button onClick={() => setIsEditing(false)} className="p-1 text-red-500 hover:bg-red-50 rounded"><XMarkIcon className="w-4 h-4"/></button>
                     <button onClick={handleSave} className="p-1 text-green-500 hover:bg-green-50 rounded"><CheckIcon className="w-4 h-4"/></button>
                  </div>
                </div>
                <input 
                  className="w-full text-sm font-medium border border-slate-200 rounded-lg px-3 py-2 focus:border-emerald-500 outline-none"
                  value={editedMeal.name}
                  onChange={(e) => setEditedMeal({...editedMeal, name: e.target.value})}
                  placeholder="Nombre del plato"
                />
                 <textarea 
                  className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 focus:border-emerald-500 outline-none resize-none flex-1 min-h-[80px]"
                  value={editedMeal.description}
                  onChange={(e) => setEditedMeal({...editedMeal, description: e.target.value})}
                  placeholder="Descripción"
                />
             </div>
         )}
      </div>
    </div>
  );
};

// --- Main PlanView Component ---
export const PlanView: React.FC<PlanViewProps> = ({ plan, onReset, onUpdatePlan, userGoal }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'calendar' | 'strategy' | 'guide'>('calendar');
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref for capture
  const exportRef = useRef<HTMLDivElement>(null);

  const selectedDay = plan.weeklySchedule[selectedDayIndex];

  // Helper to update specific Food Guide category
  const handleGuideUpdate = (category: keyof FoodGuide, newItems: string[]) => {
    const updatedGuide = { ...plan.foodGuide, [category]: newItems };
    onUpdatePlan({ ...plan, foodGuide: updatedGuide });
  };

  const handleMealUpdate = (dayIndex: number, mealType: 'breakfast' | 'midMorning' | 'lunch' | 'snack' | 'dinner', updatedMeal: Meal) => {
    const newSchedule = [...plan.weeklySchedule];
    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      [mealType]: updatedMeal
    };
    onUpdatePlan({ ...plan, weeklySchedule: newSchedule });
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure UI is ready if we changed something
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // Higher quality
        backgroundColor: '#f8fafc', // match bg-slate-50
        useCORS: true,
        logging: false
      });

      const image = canvas.toDataURL('image/jpeg', 0.9);
      
      const link = document.createElement('a');
      const suffix = activeTab === 'calendar' ? `-dia-${selectedDayIndex + 1}` : `-${activeTab}`;
      link.download = `NutriPlan${suffix}.jpg`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Hubo un error al exportar la imagen. Inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Tu Plan Nutricional</h1>
          
          <div className="flex items-center gap-2">
            {/* Export Button (Icon Only) */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-emerald-600 transition flex items-center justify-center"
              title="Guardar vista actual como imagen JPG"
            >
              {isExporting ? (
                 <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                 <ArrowDownTrayIcon className="w-5 h-5" />
              )}
            </button>

            {/* Navigation Tabs (Icons Only) */}
            <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
              <button 
                onClick={() => setActiveTab('calendar')}
                title="Calendario"
                className={`p-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center ${activeTab === 'calendar' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveTab('guide')}
                title="Guía de Alimentos"
                className={`p-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center ${activeTab === 'guide' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <BookOpenIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveTab('strategy')}
                title="Estrategia"
                className={`p-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center ${activeTab === 'strategy' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <LightBulbIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Wrapper for Capture */}
      <div ref={exportRef} className="bg-slate-50 p-4 -m-4 rounded-xl"> {/* Small padding hack for better screenshot edges */}
        
        {/* STRATEGY TAB */}
        {activeTab === 'strategy' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Resumen del Plan</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{plan.introduction}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Supplements */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <BeakerIcon className="w-5 h-5 text-purple-600" />
                    Suplementación
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${plan.supplements.creatine.recommended ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                        <span className="font-bold text-slate-900">Creatina</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{plan.supplements.creatine.reason}</p>
                      {plan.supplements.creatine.dosage && (
                        <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded inline-block">
                          {plan.supplements.creatine.dosage}
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${plan.supplements.wheyProtein.recommended ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                        <span className="font-bold text-slate-900">Whey Protein</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{plan.supplements.wheyProtein.reason}</p>
                      {plan.supplements.wheyProtein.dosage && (
                        <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded inline-block">
                          {plan.supplements.wheyProtein.dosage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* General Advice */}
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                    Consejos Generales
                  </h3>
                  <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm h-full">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {plan.generalAdvice}
                    </p>
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* FOOD GUIDE TAB */}
        {activeTab === 'guide' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-800">Guía de Alimentos por Comida</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FoodGuideList 
                title="Desayunos"
                icon={<SunIcon className="w-5 h-5"/>}
                colorClass="text-amber-500"
                dotClass="bg-amber-400"
                items={plan.foodGuide.breakfastOptions}
                onUpdate={(items) => handleGuideUpdate('breakfastOptions', items)}
              />
              
              <FoodGuideList 
                title="Almuerzos (Media Mañana)"
                icon={<ClockIcon className="w-5 h-5"/>}
                colorClass="text-lime-500"
                dotClass="bg-lime-400"
                items={plan.foodGuide.midMorningOptions}
                onUpdate={(items) => handleGuideUpdate('midMorningOptions', items)}
              />

              <FoodGuideList 
                title="Comidas (Mediodía)"
                icon={<FireIcon className="w-5 h-5"/>}
                colorClass="text-orange-500"
                dotClass="bg-orange-400"
                items={plan.foodGuide.lunchOptions}
                onUpdate={(items) => handleGuideUpdate('lunchOptions', items)}
              />

              <FoodGuideList 
                title="Meriendas"
                icon={<BeakerIcon className="w-5 h-5"/>}
                colorClass="text-pink-500"
                dotClass="bg-pink-400"
                items={plan.foodGuide.snackOptions}
                onUpdate={(items) => handleGuideUpdate('snackOptions', items)}
              />

              <FoodGuideList 
                title="Cenas"
                icon={<MoonIcon className="w-5 h-5"/>}
                colorClass="text-indigo-500"
                dotClass="bg-indigo-400"
                items={plan.foodGuide.dinnerOptions}
                onUpdate={(items) => handleGuideUpdate('dinnerOptions', items)}
              />
            </div>
          </div>
        )}

        {/* CALENDAR TAB (DEFAULT) */}
        {activeTab === 'calendar' && (
          <>
            {/* Days Navigation */}
            <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
              {plan.weeklySchedule.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedDayIndex === index
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {day.dayName}
                </button>
              ))}
            </div>

            {/* Daily Plan Detail */}
            <div className="animate-fade-in space-y-8">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-800">{selectedDay.dayName}</h2>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              {/* Meals Grid (Compact / Tooltip) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-700">Menú del Día</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MealCard 
                    title="Desayuno" 
                    meal={selectedDay.breakfast} 
                    icon={<SunIcon className="w-5 h-5" />}
                    color="bg-amber-500"
                    onUpdate={(m) => handleMealUpdate(selectedDayIndex, 'breakfast', m)}
                    userGoal={userGoal}
                  />
                  
                  {selectedDay.midMorning && (
                    <MealCard 
                      title="Almuerzo (Media Mañana)" 
                      meal={selectedDay.midMorning} 
                      icon={<ClockIcon className="w-5 h-5" />}
                      color="bg-lime-500"
                      onUpdate={(m) => handleMealUpdate(selectedDayIndex, 'midMorning', m)}
                      userGoal={userGoal}
                    />
                  )}

                  <MealCard 
                    title="Comida (Mediodía)" 
                    meal={selectedDay.lunch} 
                    icon={<FireIcon className="w-5 h-5" />}
                    color="bg-orange-500"
                    onUpdate={(m) => handleMealUpdate(selectedDayIndex, 'lunch', m)}
                    userGoal={userGoal}
                  />
                  
                  <MealCard 
                    title="Merienda" 
                    meal={selectedDay.snack} 
                    icon={<BeakerIcon className="w-5 h-5" />}
                    color="bg-pink-500"
                    onUpdate={(m) => handleMealUpdate(selectedDayIndex, 'snack', m)}
                    userGoal={userGoal}
                  />
                  
                  <MealCard 
                    title="Cena" 
                    meal={selectedDay.dinner} 
                    icon={<MoonIcon className="w-5 h-5" />}
                    color="bg-indigo-500"
                    onUpdate={(m) => handleMealUpdate(selectedDayIndex, 'dinner', m)}
                    userGoal={userGoal}
                  />
                </div>
              </div>

              {/* Peri-workout Nutrition (Moved to Bottom) */}
              {(selectedDay.workoutNutrition.preWorkout || selectedDay.workoutNutrition.postWorkout) && (
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg mt-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
                    <FireIcon className="w-5 h-5" />
                    Nutrición Peri-Entreno
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      {selectedDay.workoutNutrition.preWorkout && (
                        <div>
                          <span className="text-xs text-orange-400 font-bold block mb-1 uppercase">Pre-Entreno</span>
                          <p className="text-sm">{selectedDay.workoutNutrition.preWorkout}</p>
                        </div>
                      )}
                      {selectedDay.workoutNutrition.postWorkout && (
                        <div>
                          <span className="text-xs text-emerald-400 font-bold block mb-1 uppercase">Post-Entreno</span>
                          <p className="text-sm">{selectedDay.workoutNutrition.postWorkout}</p>
                        </div>
                      )}
                      <div className="col-span-full border-t border-slate-700 pt-3 mt-1">
                        <p className="text-xs text-slate-400 italic">Nota: {selectedDay.workoutNutrition.notes}</p>
                      </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
};