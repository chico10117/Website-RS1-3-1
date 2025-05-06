import { writable } from 'svelte/store';

interface UploaderState {
  isLoading: boolean;
  currentStep: string;
  progress: number;
}

function createUploaderStore() {
  const { subscribe, set, update } = writable<UploaderState>({
    isLoading: false,
    currentStep: '',
    progress: 0,
  });

  return {
    subscribe,
    setLoading: (loading: boolean, step: string = '', progress: number = 0) => {
      set({ isLoading: loading, currentStep: step, progress: progress });
    },
    updateProgress: (step: string, progress: number) => {
      update(state => ({ ...state, currentStep: step, progress: progress }));
    },
    reset: () => set({ isLoading: false, currentStep: '', progress: 0 }),
  };
}

export const uploaderStore = createUploaderStore(); 