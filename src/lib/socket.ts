import { io } from 'socket.io-client';
import { toasts } from '$lib/stores/toast';
import { translations } from '$lib/i18n/translations';
import { language } from '$lib/stores/language';
import { get } from 'svelte/store';

// Create socket connection with proper CORS configuration
const socket = io(process.env.SMART_SERVER_HOST || 'https://reco.ucontext.live', {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
});

// Type for translation function
type TFunction = (key: string, fallback?: string) => string;

// Handle connection events
socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Image generation events
socket.on('images-generating', () => {
  console.log('Procesando imagenes');
});

socket.on('image-generated', () => {
  console.log('Imagen Generada');
});

socket.on('queue-finished', () => {
  console.log('Queue finished');
  const currentLanguage = get(language) || 'en';
  const t = (key: string, fallback?: string) => {
    if (!translations[key]) return fallback || key;
    return translations[key][currentLanguage] || fallback || key;
  };
  toasts.success(t('completedProcessingImages', 'Images created'));
});

// Export socket instance and related functions
export const socketClient = {
  socket,
  requestImages: (restaurantId: string) => {
    if (socket.connected) {
      socket.emit('request-images', restaurantId);
    }
  },
  generateDishImage: (dishId: string, restaurantId: string) => {
    if (socket.connected) {
      socket.emit('generate-dish-image', dishId );
    }
  }
};

export default socketClient; 