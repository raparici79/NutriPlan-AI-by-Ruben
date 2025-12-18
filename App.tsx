import React, { useState, useEffect } from 'react';
import { UserForm } from './components/UserForm';
import { PlanView } from './components/PlanView';
import { LoadingState } from './components/LoadingState';
import { ProgressTracker } from './components/ProgressTracker';
import { SavedPlansList } from './components/SavedPlansList';
import { UserProfile, WeeklyPlan, ProgressEntry, SavedPlan } from './types';
import { generateDietPlan } from './services/geminiService';
import { ConfirmationModal } from './components/ConfirmationModal';
import { HeartIcon, ChartBarSquareIcon, CalendarDaysIcon, FolderIcon } from '@heroicons/react/24/solid';

type ViewState = 'form' | 'loading' | 'plan' | 'tracker' | 'saved';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('form');
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  
  // Modal State
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadedPlans = localStorage.getItem('nutriplan_plans');
    if (loadedPlans) {
      setSavedPlans(JSON.parse(loadedPlans));
    }
    const loadedProgress = localStorage.getItem('nutriplan_progress');
    if (loadedProgress) {
        setProgressEntries(JSON.parse(loadedProgress));
    }
  }, []);

  // Save progress changes
  useEffect(() => {
      localStorage.setItem('nutriplan_progress', JSON.stringify(progressEntries));
  }, [progressEntries]);

  // Save plans changes
  useEffect(() => {
      localStorage.setItem('nutriplan_plans', JSON.stringify(savedPlans));
  }, [savedPlans]);

  const handleFormSubmit = async (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('loading');
    try {
      const generatedPlan = await generateDietPlan(profile);
      setPlan(generatedPlan);
      
      // Auto-save the new plan
      const newSavedPlan: SavedPlan = {
        id: Date.now().toString(),
        name: profile.planName || `Plan ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        profile: profile,
        plan: generatedPlan
      };
      setSavedPlans(prev => [...prev, newSavedPlan]);
      
      setCurrentView('plan');
    } catch (error) {
      console.error("Failed to generate plan", error);
      alert("Hubo un error al generar el plan. Por favor verifica tu API KEY o intenta de nuevo.");
      setCurrentView('form');
    }
  };

  const handleReset = () => {
    // Just go back to form to create a new one, keeping state clean
    setPlan(null);
    setUserProfile(null);
    setCurrentView('form');
  };

  const handleUpdatePlan = (newPlan: WeeklyPlan) => {
    setPlan(newPlan);
    // Optional: Update the saved plan in history if it's the current one
  };

  const handleSelectSavedPlan = (saved: SavedPlan) => {
    setPlan(saved.plan);
    setUserProfile(saved.profile);
    setCurrentView('plan');
  };

  const handleDeleteClick = (id: string) => {
    setPlanToDelete(id);
  };

  const confirmDeletePlan = () => {
    if (planToDelete) {
        setSavedPlans(prev => prev.filter(p => p.id !== planToDelete));
        if (plan && userProfile && savedPlans.find(p => p.id === planToDelete)?.plan === plan) {
             setPlan(null);
             setUserProfile(null);
             setCurrentView('saved');
        }
        setPlanToDelete(null);
    }
  };

  const handleAddProgress = (entry: ProgressEntry) => {
    setProgressEntries(prev => [...prev, entry]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('form')}>
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                NutriPlan<span className="text-emerald-600">AI</span>
              </span>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 rounded-lg p-1">
                 {plan && (
                    <button
                        onClick={() => setCurrentView('plan')}
                        className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                        currentView === 'plan' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Plan Actual</span>
                    </button>
                 )}
                <button
                  onClick={() => setCurrentView('saved')}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    currentView === 'saved' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FolderIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Mis Planes</span>
                </button>
                <button
                  onClick={() => setCurrentView('tracker')}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    currentView === 'tracker' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <ChartBarSquareIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Progreso</span>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {currentView === 'form' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                Tu Nutricionista Personal con IA
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Obtén un plan semanal detallado adaptado a tus metas, gustos y horarios de entrenamiento en segundos.
              </p>
            </div>
            <UserForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {currentView === 'loading' && <LoadingState />}

        {currentView === 'plan' && plan && userProfile && (
          <PlanView 
            plan={plan} 
            onReset={handleReset} 
            onUpdatePlan={handleUpdatePlan}
            userGoal={userProfile.goal}
          />
        )}

        {currentView === 'saved' && (
            <SavedPlansList 
                plans={savedPlans}
                onSelectPlan={handleSelectSavedPlan}
                onDeletePlan={handleDeleteClick}
                onCreateNew={handleReset}
            />
        )}

        {currentView === 'tracker' && (
          <ProgressTracker 
            entries={progressEntries} 
            onAddEntry={handleAddProgress} 
          />
        )}
      </main>

      {/* Global Modals */}
      <ConfirmationModal 
        isOpen={!!planToDelete}
        title="¿Eliminar este plan?"
        message="Esta acción no se puede deshacer. El plan se borrará de tu historial permanentemente."
        confirmText="Sí, eliminar"
        onConfirm={confirmDeletePlan}
        onCancel={() => setPlanToDelete(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} NutriPlan AI. Powered by Google Gemini.</p>
          <p className="mt-2 text-xs">Este plan es generado por IA. Consulta siempre a un profesional de la salud antes de comenzar una dieta estricta.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;