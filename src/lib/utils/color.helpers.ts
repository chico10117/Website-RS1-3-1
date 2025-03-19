import { toasts } from '$lib/stores/toast';
import { get } from 'svelte/store';
import { currentRestaurant } from '$lib/stores/restaurant';
import { menuStore } from '$lib/stores/menu-store';
import type { UpdateEvent } from './RestaurantInfo.helpers';

/**
 * Handle color change from the radio inputs
 */
export function handleColorChange(
  value: number,
  showCustomColorPicker: boolean,
  customColorValue: string,
  updateColorFn: (val: string) => void,
  setShowCustomColorPicker: (val: boolean) => void,
  setTempColorValue: (val: string) => void, 
  setCustomColorInput: (val: string) => void
) {
  if (value === 5) {
    // Custom color
    setShowCustomColorPicker(true);
    if (customColorValue) {
      setTempColorValue(customColorValue);
      setCustomColorInput(customColorValue);
    }
  } else {
    // Standard color
    updateColorFn(String(value));
  }
}

/**
 * Handle selecting a color from the palette
 */
export function handleCustomColorSelect(
  hexColor: string, 
  setTempColorValue: (val: string) => void,
  setCustomColorInput: (val: string) => void
) {
  const capitalizedHexColor = hexColor.toUpperCase();
  setTempColorValue(capitalizedHexColor);
  setCustomColorInput(capitalizedHexColor);
}

/**
 * Handle custom color input change
 */
export function handleCustomColorInput(
  customColorInput: string,
  setTempColorValue: (val: string) => void
) {
  // Validate color format
  if (/^#[0-9A-F]{6}$/i.test(customColorInput)) {
    setTempColorValue(customColorInput.toUpperCase());
  } else if (/^[0-9A-F]{6}$/i.test(customColorInput)) {
    setTempColorValue(`#${customColorInput}`.toUpperCase());
  }
}

/**
 * Accept custom color
 */
export function acceptCustomColor(
  tempColorValue: string,
  setCustomColorValue: (val: string) => void,
  updateColorFn: (val: string) => void,
  setShowCustomColorPicker: (val: boolean) => void
) {
  if (tempColorValue) {
    const capitalizedColorValue = tempColorValue.toUpperCase();
    setCustomColorValue(capitalizedColorValue);
    updateColorFn(capitalizedColorValue);
    setShowCustomColorPicker(false);
    
    // Add extra logging to verify the color is being set
    console.log('Custom color accepted:', capitalizedColorValue);
  }
}

/**
 * Cancel custom color picker
 */
export function cancelCustomColor(
  customColorValue: string,
  setShowCustomColorPicker: (val: boolean) => void,
  setColor: (val: string) => void,
  updateColorFn: (val: string) => void
) {
  setShowCustomColorPicker(false);
  
  // Reset to standard color if no custom color was set
  if (!customColorValue) {
    setColor('1');
    updateColorFn('1');
  }
}

/**
 * Update color based on picker position
 */
export function updateColorFromPosition(
  x: number,
  y: number,
  hueValue: number,
  setTempColorValue: (val: string) => void,
  setCustomColorInput: (val: string) => void
) {
  const s = x / 100;
  const v = 1 - (y / 100);
  const hexColor = hsvToHex(hueValue, s, v);
  setTempColorValue(hexColor);
  setCustomColorInput(hexColor);
}

/**
 * Clamp a number between 0 and 100
 */
export function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/**
 * Convert HSV to Hex color
 */
export function hsvToHex(h: number, s: number, v: number): string {
  // Convert HSV to RGB
  let r, g, b;
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i) {
    case 0: [r, g, b] = [v, t, p]; break;
    case 1: [r, g, b] = [q, v, p]; break;
    case 2: [r, g, b] = [p, v, t]; break;
    case 3: [r, g, b] = [p, q, v]; break;
    case 4: [r, g, b] = [t, p, v]; break;
    case 5: [r, g, b] = [v, p, q]; break;
    default: [r, g, b] = [0, 0, 0];
  }
  
  // Convert RGB to Hex
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Handle color picker mouse interaction (both down and move)
 */
export function handleColorPickerInteraction(
  event: MouseEvent,
  pickerElement: HTMLDivElement,
  updatePositionFn: (x: number, y: number) => void,
  updateColorFn: (x: number, y: number, hue: number) => void,
  hueValue: number
) {
  const rect = pickerElement.getBoundingClientRect();
  const x = clamp(((event.clientX - rect.left) / rect.width) * 100);
  const y = clamp(((event.clientY - rect.top) / rect.height) * 100);
  
  updatePositionFn(x, y);
  updateColorFn(x, y, hueValue);
  
  return { rect, x, y };
}

/**
 * Handle color picker touch interaction
 */
export function handleColorPickerTouchInteraction(
  event: TouchEvent,
  pickerElement: HTMLDivElement,
  updatePositionFn: (x: number, y: number) => void,
  updateColorFn: (x: number, y: number, hue: number) => void,
  hueValue: number
) {
  event.preventDefault();
  const touch = event.touches[0];
  const rect = pickerElement.getBoundingClientRect();
  const x = clamp(((touch.clientX - rect.left) / rect.width) * 100);
  const y = clamp(((touch.clientY - rect.top) / rect.height) * 100);
  
  updatePositionFn(x, y);
  updateColorFn(x, y, hueValue);
  
  return { rect, x, y };
}

/**
 * Handle hue slider interaction
 */
export function handleHueInteraction(
  event: MouseEvent,
  sliderElement: HTMLDivElement,
  updateHueFn: (value: number) => void,
  updateColorFromPositionFn: (x: number, y: number, hue: number) => void,
  pickerPosition: { x: number, y: number }
) {
  const rect = sliderElement.getBoundingClientRect();
  const x = clamp(((event.clientX - rect.left) / rect.width) * 100);
  const hueValue = x * 3.6;
  
  updateHueFn(hueValue);
  updateColorFromPositionFn(pickerPosition.x, pickerPosition.y, hueValue);
  
  return rect;
}

/**
 * Handle hue slider touch interaction
 */
export function handleHueTouchInteraction(
  event: TouchEvent,
  sliderElement: HTMLDivElement,
  updateHueFn: (value: number) => void,
  updateColorFromPositionFn: (x: number, y: number, hue: number) => void,
  pickerPosition: { x: number, y: number }
) {
  event.preventDefault();
  const touch = event.touches[0];
  const rect = sliderElement.getBoundingClientRect();
  const x = clamp(((touch.clientX - rect.left) / rect.width) * 100);
  const hueValue = x * 3.6;
  
  updateHueFn(hueValue);
  updateColorFromPositionFn(pickerPosition.x, pickerPosition.y, hueValue);
  
  return rect;
}

/**
 * Update restaurant color in store
 */
export function updateRestaurantColor(
  val: string,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  color: string,
  currency: string,
  customColorValue: string,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void
) {
  // Make sure hex color values are capitalized
  const capitalizedVal = val.startsWith('#') ? val.toUpperCase() : val;
  
  console.log('Updating restaurant color', {
    newColor: capitalizedVal,
    currentColor: color
  });

  // For existing restaurant, update the store
  const cRest = get(currentRestaurant);
  if (cRest) {
    console.log('Updating existing restaurant color to:', capitalizedVal);
    menuStore.updateRestaurantInfo(
      cRest.name,
      cRest.logo,
      cRest.customPrompt,
      cRest.slug,
      cRest.phoneNumber,
      capitalizedVal
    );
    dispatchFn('update', {
      id: cRest.id,
      name: cRest.name,
      logo: cRest.logo,
      customPrompt: cRest.customPrompt,
      phoneNumber: cRest.phoneNumber,
      currency,
      color: capitalizedVal,
      slug: cRest.slug
    });
  } else {
    // For new restaurant, just update local state
    dispatchFn('update', {
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      color: capitalizedVal
    });
  }
} 