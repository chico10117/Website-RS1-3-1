<script lang="ts">
  import QRCode from 'qrcode';
  import { onMount } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  export let url: string;
  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let qrError: string | null = null;

  const QR_SIZE = 200; // Increased QR size
  const LOGO_SIZE = 60; // Increased logo size
  const LOGO_MARGIN = 0; // Margin around the logo
  const LOGO_BACKGROUND_SIZE = LOGO_SIZE + (LOGO_MARGIN * 0);

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  onMount(() => {
    if (!url) return;
    
    QRCode.toCanvas(canvas, url, {
      width: QR_SIZE,
      margin: 1,
      errorCorrectionLevel: 'H', // Highest error correction for better logo visibility
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }).then(() => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const logo = new Image();
      // Set desired render size for the SVG before loading
      logo.width = LOGO_SIZE;
      logo.height = LOGO_SIZE;
      logo.src = '/favicon.svg'; // Este archivo ya existe en static y es PNG
      
      logo.onload = () => {
        // Posición central
        const x = (QR_SIZE - LOGO_SIZE) / 2;
        const y = (QR_SIZE - LOGO_SIZE) / 2;
        
        ctx.fillStyle = 'white';
        const bgX = (QR_SIZE - LOGO_BACKGROUND_SIZE) / 2;
        const bgY = (QR_SIZE - LOGO_BACKGROUND_SIZE) / 2;
        
        // Dibujar fondo blanco con bordes redondeados
        ctx.beginPath();
        ctx.roundRect(bgX, bgY, LOGO_BACKGROUND_SIZE, LOGO_BACKGROUND_SIZE, 10);
        ctx.fill();
        
        // Dibujar el logo
        ctx.drawImage(logo, x, y, LOGO_SIZE, LOGO_SIZE);
      };
    }).catch((err: Error) => {
      console.error('Error generating QR code:', err);
      qrError = err.message;
    });
  });
</script>

<div class="qr-code-container">
  <canvas
    bind:this={canvas}
    class="qr-code"
    width={QR_SIZE}
    height={QR_SIZE}
    aria-label={t('qrCodeFor').replace('{url}', url)}
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
  }
  
  .qr-code {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style> 