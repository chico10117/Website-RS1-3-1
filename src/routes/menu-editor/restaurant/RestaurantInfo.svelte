{#if restaurantName !== undefined}
<div class="space-y-4">
  <div>
    <Label for="restaurant-name">{t('restaurant.name')}</Label>
    <Input
      id="restaurant-name"
      value={restaurantName}
      on:input={handleInput}
      placeholder={t('restaurant.name_placeholder')}
    />
  </div>

  <div>
    <Label for="phone-number">{t('restaurant.phone')}</Label>
    <PhoneInput
      id="phone-number"
      value={phoneNumber?.toString() ?? ''}
      on:change={onPhoneChange}
      placeholder={t('restaurant.phone_placeholder')}
    />
  </div>

  <div>
    <Label for="color">{t('restaurant.color')}</Label>
    <ColorPicker
      id="color"
      value={color}
      on:change={(e: CustomEvent<string>) => {
        color = e.detail;
        handleRestaurantNameChange(
          restaurantName,
          menuLogo,
          customPrompt,
          phoneNumber,
          color,
          currency,
          reservas,
          redes_sociales,
          dispatch
        );
      }}
    />
  </div>

  <div>
    <Label for="currency">{t('restaurant.currency')}</Label>
    <CurrencySelect
      id="currency"
      value={currency}
      on:change={(e: CustomEvent<string>) => {
        currency = e.detail;
        handleRestaurantNameChange(
          restaurantName,
          menuLogo,
          customPrompt,
          phoneNumber,
          color,
          currency,
          reservas,
          redes_sociales,
          dispatch
        );
      }}
    />
  </div>

  <div>
    <Label>{t('restaurant.logo')}</Label>
    <ImageUpload
      value={menuLogo}
      on:change={(e: CustomEvent<string | null>) => {
        menuLogo = e.detail;
        handleRestaurantNameChange(
          restaurantName,
          menuLogo,
          customPrompt,
          phoneNumber,
          color,
          currency,
          reservas,
          redes_sociales,
          dispatch
        );
      }}
      on:error={(e: CustomEvent<string>) => handleMenuUploadError(e, t)}
    />
  </div>

  <div>
    <Label>{t('restaurant.prompt')}</Label>
    <PromptEditor
      value={customPrompt}
      on:change={(e: CustomEvent<string | null>) => {
        customPrompt = e.detail;
        handleRestaurantNameChange(
          restaurantName,
          menuLogo,
          customPrompt,
          phoneNumber,
          color,
          currency,
          reservas,
          redes_sociales,
          dispatch
        );
      }}
    />
  </div>

  <div>
    <Label>{t('restaurant.social')}</Label>
    <SocialLinks
      reservas={reservas}
      redes_sociales={redes_sociales}
      on:change={(e: CustomEvent<{ reservas: string | null; redes_sociales: string | null }>) => {
        reservas = e.detail.reservas;
        redes_sociales = e.detail.redes_sociales;
        handleRestaurantNameChange(
          restaurantName,
          menuLogo,
          customPrompt,
          phoneNumber,
          color,
          currency,
          reservas,
          redes_sociales,
          dispatch
        );
      }}
    />
  </div>
</div>
{/if}

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  import { handleRestaurantNameChange, handlePhoneNumberChange } from '$lib/utils/RestaurantInfo.helpers';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { PhoneInput } from '$lib/components/ui/phone-input';
  import { ColorPicker } from '$lib/components/ui/color-picker';
  import { CurrencySelect } from '$lib/components/ui/currency-select';
  import { ImageUpload } from '$lib/components/ui/image-upload';
  import { PromptEditor } from '$lib/components/ui/prompt-editor';
  import { SocialLinks } from '$lib/components/ui/social-links';

  const dispatch = createEventDispatcher();

  export let restaurantName: string;
  export let menuLogo: string | null = null;
  export let customPrompt: string | null = null;
  export let phoneNumber: number | null = null;
  export let color: string = '1';
  export let currency: string = 'USD';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  function handleInput(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    onNameChange(input.value);
  }

  function onPhoneChange(event: CustomEvent<string>) {
    const newPhoneNumber = event.detail ? parseInt(event.detail.replace(/\D/g, ''), 10) : null;
    handlePhoneNumberChange(
      newPhoneNumber,
      restaurantName,
      menuLogo,
      customPrompt,
      color,
      currency,
      reservas,
      redes_sociales,
      dispatch
    );
  }

  function onNameChange(value: string) {
    handleRestaurantNameChange(
      value,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      reservas,
      redes_sociales,
      dispatch
    );
  }
</script> 