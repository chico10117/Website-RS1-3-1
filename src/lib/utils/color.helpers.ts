import { toasts } from '$lib/stores/toast';
import { get } from 'svelte/store';
import { currentRestaurant } from '$lib/stores/restaurant';
import { menuStore } from '$lib/stores/menu-store';
import type { UpdateEvent } from './RestaurantInfo.helpers';

/**
 * Handle selecting a color from the palette - ONLY sets temp value now
 */
export function handleCustomColorSelect(
  hexColor: string,
  setTempColorValue: (val: string) => void
  // setCustomColorInput: (val: string) => void // Removed 3rd argument
) {
  const capitalizedHexColor = hexColor.toUpperCase();
  setTempColorValue(capitalizedHexColor);
  // setCustomColorInput(capitalizedHexColor); // Removed this line
}

/**
 * Handle custom color input change (validation)
 */
export function handleCustomColorInputValidation(
  customColorInput: string,
  setTempColorValue: (val: string) => void
) {
  // Validate color format
  if (/^#[0-9A-F]{6}$/i.test(customColorInput)) {
    setTempColorValue(customColorInput.toUpperCase());
  } else if (/^[0-9A-F]{6}$/i.test(customColorInput)) {
    setTempColorValue(`#${customColorInput}`.toUpperCase());
  }
  // If invalid, tempColorValue remains unchanged, providing visual feedback
}

/**
 * Save custom color to localStorage when it changes
 */
export function saveCustomColorToStorage(
  customColorValue: string,
  selectedRestaurant: string | null
) {
  if (customColorValue && typeof customColorValue === 'string' && typeof window !== 'undefined') {
    localStorage.setItem(`customColor_${selectedRestaurant || 'new'}`, customColorValue.toUpperCase());
  }
}

// Type for the dispatch function expected by helpers
type ColorDispatchFunction = (
  event: 'update',
  detail: UpdateEvent
) => void;

/**
 * Update color based on selection (specifically for light theme selection)
 */
export function updateColorToLight(
  // newColorValue: string, // Implicitly 'light' -> '#85A3FA'
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: number | null,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  selectedRestaurantId: string | null, // Added ID
  dispatchFn: ColorDispatchFunction
) {
  const finalColor = '#85A3FA'; // Standard hex for light theme

  console.log("Setting color to light theme:", finalColor);

  // Dispatch the update event with the light theme color and other current state
  dispatchFn('update', {
    id: selectedRestaurantId || undefined, // Include the ID
    name: restaurantName,
    logo: menuLogo,
    customPrompt: customPrompt,
    phoneNumber: phoneNumber,
    currency: currency,
    color: finalColor,
    // slug is handled by save logic based on ID
    reservas: reservas,
    redes_sociales: redes_sociales,
  });
}

/**
 * Handle accepting a custom color
 */
export function onAcceptCustomColor(
  tempColorValue: string, // The hex color selected/entered
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: number | null,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  selectedRestaurantId: string | null, // Added ID
  dispatchFn: ColorDispatchFunction
) {
  if (!/^#[0-9A-F]{6}$/i.test(tempColorValue)) {
    console.error("Attempted to accept invalid hex color:", tempColorValue);
    // Optionally add a user toast message here
    return; // Don't proceed with invalid color
  }
  const finalColor = tempColorValue.toUpperCase();

  console.log("Accepting custom color:", finalColor);

  // Dispatch the update event with the accepted custom color
  dispatchFn('update', {
    id: selectedRestaurantId || undefined, // Include the ID
    name: restaurantName,
    logo: menuLogo,
    customPrompt: customPrompt,
    phoneNumber: phoneNumber,
    currency: currency,
    color: finalColor,
    // slug is handled by save logic based on ID
    reservas: reservas,
    redes_sociales: redes_sociales,
  });
}

/**
 * Handle canceling custom color selection (No dispatch needed)
 */
export function onCancelCustomColor(
  // No dispatch needed, parent handles UI reset
) {
  console.log("Custom color cancelled. Parent should handle state reset.");
  // Parent (`ThemeColorSection`) should handle reverting its visual state
  // (e.g., closing the picker, resetting radio buttons if needed).
} 