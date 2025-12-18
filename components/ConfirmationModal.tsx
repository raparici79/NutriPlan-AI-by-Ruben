import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  isDestructive = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100 border-2 ${isDestructive ? 'border-red-100' : 'border-emerald-100'}`}>
        <div className="flex flex-col items-center text-center">
          <div className={`p-3 rounded-full mb-4 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
            <ExclamationTriangleIcon className="w-8 h-8" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {title}
          </h3>
          
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 font-medium rounded-xl text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDestructive 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20 focus:ring-red-500' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 focus:ring-emerald-600'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};