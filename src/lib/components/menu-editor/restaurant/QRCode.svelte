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

  const QR_SIZE = 150; // Logical size
  const LOGO_SIZE = 35;
  const LOGO_MARGIN = 4; // Margin around the logo
  // LOGO_BACKGROUND_SIZE will be calculated dynamically

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

      // Scale the context to draw according to logical size
      ctx.scale(pixelRatio, pixelRatio);

      // Disable image smoothing for potentially sharper rendering
      ctx.imageSmoothingEnabled = false;

      const logo = new Image();
      logo.src = '/QRlogo2.png'; // Use the PNG logo
      
      logo.onload = () => {
        const logoNatWidth = logo.naturalWidth;
        const logoNatHeight = logo.naturalHeight;

        // Calculate scaling factor to fit logo within LOGO_SIZE box
        const scale = Math.min(LOGO_SIZE / logoNatWidth, LOGO_SIZE / logoNatHeight);
        const drawnWidth = Math.floor(logoNatWidth * scale);
        const drawnHeight = Math.floor(logoNatHeight * scale);

        // Calculate centered position for the logo
        const x = Math.floor((displaySize - drawnWidth) / 2);
        const y = Math.floor((displaySize - drawnHeight) / 2);
        
        // Calculate background dimensions and position
        const bgWidth = drawnWidth + LOGO_MARGIN * 2;
        const bgHeight = drawnHeight + LOGO_MARGIN * 2;
        const bgX = Math.floor((displaySize - bgWidth) / 2);
        const bgY = Math.floor((displaySize - bgHeight) / 2);

        ctx.fillStyle = 'white';
        // Draw square white background based on logo aspect ratio + margin
        ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
        
        // Draw the logo with its correct aspect ratio
        ctx.drawImage(logo, x, y, drawnWidth, drawnHeight);
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