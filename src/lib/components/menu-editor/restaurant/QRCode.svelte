<script lang="ts">
  import QRCode from 'qrcode';
  import { onMount } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  export let url: string;
  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let qrError: string | null = null;
  let displaySize: number;
  let pixelRatio: number = 1;

  const QR_SIZE = 120; // Logical size
  const LOGO_SIZE = 50; // Used for CSS styling of the overlay
  const LOGO_MARGIN = 0; /// Used for CSS styling of the overlay

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  onMount(() => {
    if (!url) return;
    
    // Adjust for device pixel ratio for sharpness on high-DPI screens
    pixelRatio = window.devicePixelRatio || 1;
    displaySize = QR_SIZE;
    const scaledSize = displaySize * pixelRatio;

    // Set canvas buffer size
    canvas.width = scaledSize;
    canvas.height = scaledSize;

    // Set display size via CSS
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    QRCode.toCanvas(canvas, url, {
      width: scaledSize,
      margin: 0,
      errorCorrectionLevel: 'H', // Highest error correction for better logo visibility
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }).then(() => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Scale the context (only needed if pixelRatio > 1)
      if (pixelRatio !== 1) {
        ctx.scale(pixelRatio, pixelRatio);
      }
      // Logo drawing removed, handled by CSS overlay now
    }).catch((err: Error) => {
      console.error('Error generating QR code:', err);
      qrError = err.message;
    });
  });
</script>

<div 
  class="qr-code-container"
  style="--logo-size: {LOGO_SIZE}px; --logo-margin: {LOGO_MARGIN}px;"
>
  <canvas
    bind:this={canvas}
    class="qr-code"
    aria-label={t('qrCodeFor').replace('{url}', url)}
  />
  <!-- Logo Overlay -->
  <img 
    src="/favicon_simplified_4QR.svg" 
    alt="Logo Overlay"
    class="qr-logo-overlay"
  />
  {#if qrError}
    <p class="text-red-500 text-sm">{t('qrCodeError')}: {qrError}</p>
  {/if}
</div>

<style>
  .qr-code-container {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    position: relative; /* Positioning context for the overlay */
  }
  
  .qr-code {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .qr-logo-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    /* Size controlled by CSS variables */
    width: var(--logo-size);
    height: var(--logo-size);
    
    /* Background and margin via padding */
    padding: var(--logo-margin);
    background-color: white;
    border-radius: 4px; /* Match previous roundRect radius */
    box-sizing: border-box; /* Include padding in width/height */

    /* Optional: prevent interaction if needed */
    pointer-events: none; 
  }
</style> 