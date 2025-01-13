import { writable } from 'svelte/store';

type Language = 'es' | 'en';

// Get the initial language from localStorage or default to Spanish
const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';
  const stored = localStorage.getItem('language');
  return (stored === 'en' || stored === 'es') ? stored : 'es';
};

// Create the store with initial value
const language = writable<Language>(getStoredLanguage());

// Subscribe to changes and update localStorage
if (typeof window !== 'undefined') {
  language.subscribe((value) => {
    localStorage.setItem('language', value);
  });
}

export { language }; 