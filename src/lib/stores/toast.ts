import { writable } from 'svelte/store';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timeout?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  let id = 0;

  function addToast(type: Toast['type'], message: string, timeout: number = 3000) {
    const toast: Toast = {
      id: id++,
      type,
      message,
      timeout
    };

    update(toasts => [...toasts, toast]);

    if (timeout) {
      setTimeout(() => {
        remove(toast.id);
      }, timeout);
    }
  }

  function remove(id: number) {
    update(toasts => toasts.filter(toast => toast.id !== id));
  }

  return {
    subscribe,
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message),
    warning: (message: string) => addToast('warning', message),
    remove
  };
}

export const toasts = createToastStore(); 