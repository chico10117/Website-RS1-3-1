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
  let containerWidth: number;

  const QR_SIZE = 200; // Logical size
  const LOGO_SIZE = 50; // Used for CSS styling of the overlay
  const LOGO_MARGIN = 0; /// Used for CSS styling of the overlay

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  onMount(() => {
    if (!url) return;
    
    // Get container width for responsive sizing
    const updateSize = () => {
      if (!container) return;
      containerWidth = container.clientWidth;
      displaySize = Math.min(containerWidth, QR_SIZE);
      
      // Update canvas with new size
      pixelRatio = window.devicePixelRatio || 1;
      const scaledSize = displaySize * pixelRatio;
      
      canvas.width = scaledSize;
      canvas.height = scaledSize;
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;
      
      generateQR();
    };
    
    // Generate QR with current size settings
    const generateQR = () => {
      QRCode.toCanvas(canvas, url, {
        width: canvas.width,
        margin: 0,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).catch((err: Error) => {
        console.error('Error generating QR code:', err);
        qrError = err.message;
      });
    };
    
    updateSize();
    
    // Handle window resize
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    
    return () => resizeObserver.disconnect();
  });
</script>

<div 
  bind:this={container}
  class="qr-code-container"
  style="--logo-size: {LOGO_SIZE * (displaySize / QR_SIZE)}px; --logo-margin: {LOGO_MARGIN}px;"
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