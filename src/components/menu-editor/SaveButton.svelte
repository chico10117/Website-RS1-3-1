async function saveChanges() {
    if (!selectedRestaurant && !restaurantName) {
      toasts.error(t('noRestaurantSelected') || 'No restaurant selected');
      return;
    }

    // Clean the phone number before saving
    const cleanedPhoneNumber = cleanPhoneNumber($menuStore.phoneNumber);
    console.log('Cleaned phone number before save:', cleanedPhoneNumber);

    // Debug URLs and entire menuStore state to see where the issue is
    console.log('Before saving - Complete state:', {
      entireMenuStore: $menuStore,
      colorValue: $menuStore.color,
      reservas: $menuStore.reservas,
      redes_sociales: $menuStore.redes_sociales,
      phoneNumber: cleanedPhoneNumber
    });

    // Ensure color is a hex value, not 'light' or '1'
    const colorValue = $menuStore.color === 'light' || $menuStore.color === '1' 
      ? '#85A3FA' 
      : $menuStore.color;
    
    console.log('Starting save with color:', colorValue);

    try {
      // If we have a restaurant name but no selected restaurant, we need to create a new one
      if (restaurantName && !selectedRestaurant) {
        // Generate a slug for the new restaurant
        const newSlug = await generateSlug(restaurantName);
        
        console.log('Creating restaurant with color:', colorValue, 'and URLs:', {
          reservas: $menuStore.reservas,
          redes_sociales: $menuStore.redes_sociales,
          phoneNumber: cleanedPhoneNumber
        });
        
        // Create the restaurant in the store with cleaned phone number
        menuStore.createRestaurant(
          restaurantName,
          $menuStore.menuLogo,
          $menuStore.customPrompt,
          cleanedPhoneNumber,
          $menuStore.reservas,
          $menuStore.redes_sociales
        );
        
        // Get the newly created restaurant ID
        const storeState = $menuStore;
        const newId = storeState.selectedRestaurant;
        
        if (!newId) {
          throw new Error('Failed to create restaurant');
        }
        
        console.log('Updating restaurant with color:', colorValue);
        
        // Update with the proper slug and cleaned phone number
        menuStore.updateRestaurantInfo(
          restaurantName,
          $menuStore.menuLogo,
          $menuStore.customPrompt,
          newSlug,
          cleanedPhoneNumber,
          $menuStore.reservas,
          $menuStore.redes_sociales,
          colorValue
        );
        
        // Update the current restaurant store
        if ($currentRestaurant === null) {
          const newRestaurant = storeState.restaurants.find(r => r.id === newId);
          if (newRestaurant) {
            currentRestaurant.set({
              ...newRestaurant,
              slug: newSlug,
              color: colorValue,
              reservas: $menuStore.reservas,
              redes_sociales: $menuStore.redes_sociales
            });
          }
        }
      }
      
      // CRITICAL: Make absolutely sure the URL values are set before saving
      // This should not be necessary, but we're adding it as a failsafe
      let currentReservas = $menuStore.reservas; 
      let currentRedesSociales = $menuStore.redes_sociales;
      
      console.log('CRITICAL CHECK - RIGHT BEFORE SAVE:', {
        reservas: currentReservas,
        redes_sociales: currentRedesSociales
      });
      
      console.log('Calling saveChanges with color in store:', colorValue, 
        'reservas:', $menuStore.reservas, 
        'redes_sociales:', $menuStore.redes_sociales
      );
      
      // Use the menuStore's saveChanges method to save all changes
      const result = await menuStore.saveChanges();
      
      // Ensure category order is explicitly saved
      if ($menuStore.selectedRestaurant) {
        const orderedCategoryIds = $menuStore.categories.map(c => c.id);
        try {
          await categoryService.updateCategoryOrder($menuStore.selectedRestaurant, orderedCategoryIds);
          console.log('Category order explicitly saved after main save');
        } catch (error) {
          console.error('Error saving category order:', error);
        }
      }
      
      // Debug the result
      console.log('*******Save result:', {
        //logo: result.restaurant.logo,
        customPrompt: result.restaurant.customPrompt,
        color: result.restaurant.color,
        currency: result.restaurant.currency,
        phoneNumber: result.restaurant.phoneNumber,
        reservas: result.restaurant.reservas,
        redes_sociales: result.restaurant.redes_sociales,
      });
      
      const restId = $menuStore.selectedRestaurant;
      if (restId && restId !== 'a5f22abe-cc7d-465a-9ac6-90ba946ef28b'){
        socket.emit('request-images', restId);
      }

      // Show success message
      toasts.success(t('changesSaved') || 'Changes saved');
      
      // Trigger iframe refresh
      triggerIframeRefresh();
      
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        toasts.error((t('error') || 'Error') + ': ' + error.message);
      } else {
        toasts.error((t('error') || 'Error') + ': ' + (t('unknownError') || 'Unknown error'));
      }
    }
  } 