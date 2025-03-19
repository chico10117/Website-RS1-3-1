import { toasts } from '$lib/stores/toast';
import { get } from 'svelte/store';
import { currentRestaurant } from '$lib/stores/restaurant';
import { menuStore } from '$lib/stores/menu-store';
import type { UpdateEvent } from './RestaurantInfo.helpers';

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

/**
 * Check and initialize custom color value when needed
 */
export function initializeCustomColor(
  color: string, 
  selectedRestaurant: string | null,
  setCustomColorValue: (val: string) => void,
  setTempColorValue: (val: string) => void,
  setCustomColorInput: (val: string) => void,
  setColor?: (val: string) => void,
  setShowCustomColorPicker?: (val: boolean) => void
) {
  const cRest = get(currentRestaurant);
  
  // First try to get color from database via currentRestaurant store
  if (cRest && cRest.color) {
    // If the color from DB is a hex value (starts with #)
    if (typeof cRest.color === 'string' && cRest.color.startsWith('#')) {
      const dbColor = cRest.color.toUpperCase();
      setCustomColorValue(dbColor);
      setTempColorValue(dbColor);
      setCustomColorInput(dbColor);
      
      // If callbacks provided, also set color to '5' and show picker
      if (setColor) {
        setColor('5');
      }
      if (setShowCustomColorPicker) {
        setShowCustomColorPicker(true);
      }
      
      console.log('Loaded custom color from database:', dbColor);
      return;
    }
  }
  
  // Fallback to localStorage if needed
  if (color === '5' && typeof window !== 'undefined') {
    const savedColor = localStorage.getItem(`customColor_${selectedRestaurant || 'new'}`);
    if (savedColor) {
      setCustomColorValue(savedColor);
      setTempColorValue(savedColor);
      setCustomColorInput(savedColor);
      
      // If callback provided, show picker
      if (setShowCustomColorPicker) {
        setShowCustomColorPicker(true);
      }
      
      console.log('Loaded custom color from localStorage:', savedColor);
    }
  }
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

/**
 * Update color value and dispatch the change
 */
export function updateColor(
  val: string, 
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  currency: string,
  customColorValue: string,
  setColor: (color: string) => void,
  dispatchFn: (event: 'update', detail: any) => void
) {
  console.log('updateColor called with:', val);
  
  // Safely handle both numeric and hex color values
  const newColor = typeof val === 'string' && val.startsWith('#') 
    ? val.toUpperCase() // For hex colors, ensure they're capitalized
    : val; // For standard color numbers, keep as is
  
  setColor(newColor);
  console.log('Local color prop updated to:', newColor);
  
  updateRestaurantColor(
    val,
    restaurantName,
    menuLogo,
    customPrompt,
    phoneNumber,
    newColor,
    currency,
    customColorValue,
    (evt, detail) => {
      console.log('Dispatching color update event with color:', detail.color);
      dispatchFn(evt, detail);
    }
  );
}

/**
 * Handler for color radio button change 
 */
export function onColorChange(
  value: number,
  customColorValue: string,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  currency: string,
  color: string,
  setShowCustomColorPicker: (val: boolean) => void,
  setTempColorValue: (val: string) => void,
  setCustomColorInput: (val: string) => void,
  setColor: (val: string) => void,
  dispatchFn: (event: 'update', detail: any) => void
) {
  if (value === 5) {
    // If selecting custom color option, update the UI but don't change the color value yet
    setShowCustomColorPicker(true);
    if (customColorValue) {
      setTempColorValue(customColorValue);
      setCustomColorInput(customColorValue);
    }
  } else {
    // For standard colors, immediately update the color value
    const newColor = String(value);
    setColor(newColor); // Update the local color prop
    updateRestaurantColor(
      newColor,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      customColorValue,
      dispatchFn
    );
  }
}

/**
 * Handle custom color input change (with capitalization)
 */
export function onCustomColorInput(
  customColorInput: string,
  setCustomColorInput: (val: string) => void,
  setTempColorValue: (val: string) => void
) {
  const capitalizedInput = customColorInput.toUpperCase();
  setCustomColorInput(capitalizedInput);
  handleCustomColorInput(capitalizedInput, setTempColorValue);
}

/**
 * Handle accepting a custom color
 */
export function onAcceptCustomColor(
  tempColorValue: string,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  currency: string,
  customColorValue: string,
  setColor: (val: string) => void,
  setCustomColorValue: (val: string) => void,
  setShowCustomColorPicker: (val: boolean) => void,
  dispatchFn: (event: 'update', detail: any) => void
) {
  console.log('Accepting custom color:', tempColorValue);
  setColor(tempColorValue); // Update the local color prop directly
  
  acceptCustomColor(
    tempColorValue,
    (v: string) => {
      console.log('Setting customColorValue to:', v);
      setCustomColorValue(v);
    },
    (val: string) => {
      console.log('Calling updateColor with:', val);
      updateColor(
        val,
        restaurantName,
        menuLogo,
        customPrompt,
        phoneNumber,
        currency,
        customColorValue,
        setColor,
        dispatchFn
      );
    },
    setShowCustomColorPicker
  );
}

/**
 * Handle canceling custom color selection
 */
export function onCancelCustomColor(
  customColorValue: string,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  currency: string,
  setColor: (val: string) => void,
  setShowCustomColorPicker: (val: boolean) => void,
  dispatchFn: (event: 'update', detail: any) => void
) {
  cancelCustomColor(
    customColorValue,
    setShowCustomColorPicker,
    setColor,
    (val: string) => updateColor(
      val,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      customColorValue,
      setColor,
      dispatchFn
    )
  );
} 