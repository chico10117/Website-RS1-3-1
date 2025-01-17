import { writable } from 'svelte/store';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  let nextId = 1;

  function addToast(message: string, type: Toast['type'] = 'info') {
    const id = nextId++;
    update(toasts => [...toasts, { message, type, id }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }

  function removeToast(id: number) {
    update(toasts => toasts.filter(t => t.id !== id));
  }

  return {
    subscribe,
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
    remove: removeToast
  };
}

export const toasts = createToastStore(); 