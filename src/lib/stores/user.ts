import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  picture: string | null;
}

function formatDisplayName(fullName: string | null): string | null {
  if (!fullName) return null;
  
  // Decodificar el nombre en caso de que venga codificado
  try {
    const decodedName = decodeURIComponent(fullName);
    const nameParts = decodedName.split(' ');
    return nameParts.slice(0, 2).join(' ');
  } catch {
    // Si hay error en la decodificación, usar el nombre original
    const nameParts = fullName.split(' ');
    return nameParts.slice(0, 2).join(' ');
  }
}

// Función para obtener el usuario inicial desde localStorage
const getStoredUser = (): User => {
  if (!browser) return { id: null, name: null, email: null, picture: null };
  
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return { id: null, name: null, email: null, picture: null };

    const user = JSON.parse(storedUser);
    return {
      ...user,
      name: user.name ? formatDisplayName(user.name) : null
    };
  } catch {
    return { id: null, name: null, email: null, picture: null };
  }
};

// Crear el store con el valor inicial desde localStorage
const userStore = writable<User>(getStoredUser());

// Crear un store personalizado que actualiza localStorage cuando cambia
export const user = {
  ...userStore,
  set: (value: User) => {
    if (browser && value) {
      const formattedUser = {
        ...value,
        name: value.name ? formatDisplayName(value.name) : null
      };
      
      if (formattedUser.name) {
        localStorage.setItem('user', JSON.stringify(formattedUser));
      } else {
        localStorage.removeItem('user');
      }
      
      userStore.set(formattedUser);
    }
  },
  logout: () => {
    if (browser) {
      localStorage.removeItem('user');
    }
    userStore.set({ id: null, name: null, email: null, picture: null });
  }
};

// Inicializar el usuario desde la cookie al cargar la página
if (browser) {
  fetch('/api/auth/me')
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        user.set(data.user);
      }
    })
    .catch(console.error);
} 