import React from "react";
import { useConfirmStore } from "@/stores/useConfirmStore";
import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export const ConfirmationModal: React.FC = () => {
  const { isOpen, options, onConfirm, onCancel } = useConfirmStore();

  if (!isOpen || !options) return null;

  const {
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
  } = options;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[10px] shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-[#eaedf1]">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 p-2 rounded-full ${
              type === 'danger' ? 'bg-red-100 text-red-600' : 
              type === 'warning' ? 'bg-amber-100 text-amber-600' : 
              'bg-blue-100 text-blue-600'
            }`}>
              {type === 'danger' || type === 'warning' ? (
                <ExclamationTriangleIcon className="w-6 h-6" />
              ) : (
                <InformationCircleIcon className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-[#eaedf1]">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              type === 'danger' ? 'bg-red-600 hover:bg-red-700' :
              type === 'warning' ? 'bg-amber-600 hover:bg-amber-700' :
              'bg-[#0f79f3] hover:bg-[#0d6adb]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
