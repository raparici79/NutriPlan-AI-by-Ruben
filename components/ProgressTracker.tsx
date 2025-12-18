import React, { useState } from 'react';
import { ProgressEntry } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { PlusCircleIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface ProgressTrackerProps {
  entries: ProgressEntry[];
  onAddEntry: (entry: ProgressEntry) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ entries, onAddEntry }) => {
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    date: new Date().toISOString().split('T')[0],
    weight: undefined,
    waist: undefined,
    workoutPerformance: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.date && newEntry.weight) {
      onAddEntry({
        id: Date.now().toString(),
        date: newEntry.date,
        weight: Number(newEntry.weight),
        waist: newEntry.waist ? Number(newEntry.waist) : undefined,
        workoutPerformance: newEntry.workoutPerformance || '',
        notes: newEntry.notes || ''
      });
      // Reset sensitive fields
      setNewEntry(prev => ({
        ...prev,
        weight: '',
        waist: '',
        workoutPerformance: '',
        notes: ''
      } as any));
    }
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PlusCircleIcon className="w-5 h-5 text-emerald-600" />
            Registrar Progreso
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                type="date"
                required
                value={newEntry.date}
                onChange={e => setNewEntry({...newEntry, date: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newEntry.weight || ''}
                  onChange={e => setNewEntry({...newEntry, weight: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cintura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newEntry.waist || ''}
                  onChange={e => setNewEntry({...newEntry, waist: Number(e.target.value)})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Opcional"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rendimiento / Sensaciones</label>
              <select 
                value={newEntry.workoutPerformance}
                onChange={e => setNewEntry({...newEntry, workoutPerformance: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="Excellent">Excelente - Mucha energía</option>
                <option value="Good">Bueno - Cumplí objetivo</option>
                <option value="Average">Normal</option>
                <option value="Tired">Cansado / Poca energía</option>
                <option value="Rest">Día de Descanso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notas del entrenamiento</label>
              <textarea
                value={newEntry.notes}
                onChange={e => setNewEntry({...newEntry, notes: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                placeholder="Ej: Aumenté 2kg en sentadilla..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
            >
              Guardar Registro
            </button>
          </form>
        </div>

        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
              Evolución de Peso Corporal
            </h3>
            {sortedEntries.length > 1 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sortedEntries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" fontSize={12} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Registra al menos 2 entradas para ver el gráfico
              </div>
            )}
          </div>

          {/* Recent Logs List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              Historial Reciente
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {[...sortedEntries].reverse().map((entry) => (
                <div key={entry.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-slate-800">
                      {new Date(entry.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-900">{entry.weight} kg</h4>
                      {entry.workoutPerformance && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          entry.workoutPerformance === 'Excellent' ? 'bg-green-100 text-green-700' :
                          entry.workoutPerformance === 'Good' ? 'bg-blue-100 text-blue-700' :
                          entry.workoutPerformance === 'Tired' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {entry.workoutPerformance}
                        </span>
                      )}
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{entry.notes}</p>
                    )}
                    {entry.waist && (
                      <p className="text-xs text-slate-400 mt-2">Cintura: {entry.waist} cm</p>
                    )}
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-center text-slate-400 py-4">No hay registros todavía.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};