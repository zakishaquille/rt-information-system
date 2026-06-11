import { create } from "zustand";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions | null;
  resolveCallback: ((value: boolean) => void) | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  onConfirm: () => void;
  onCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  options: null,
  resolveCallback: null,
  
  confirm: (options) => {
    return new Promise<boolean>((resolve) => {
      set({ isOpen: true, options, resolveCallback: resolve });
    });
  },
  
  onConfirm: () => {
    const { resolveCallback } = get();
    if (resolveCallback) resolveCallback(true);
    set({ isOpen: false, resolveCallback: null });
  },
  
  onCancel: () => {
    const { resolveCallback } = get();
    if (resolveCallback) resolveCallback(false);
    set({ isOpen: false, resolveCallback: null });
  },
}));
