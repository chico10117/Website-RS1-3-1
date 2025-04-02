<script lang="ts">
  import QRCode from 'qrcode';
  import { onMount } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  export let url: string;
  let canvas: HTMLCanvasElement;
  let qrError: string | null = null;

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  onMount(() => {
    if (!url) return;
    
    QRCode.toCanvas(canvas, url, {
      width: 128,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
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
    align-items: center;
    gap: 0.5rem;
  }
  
  .qr-code {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem;
    background: white;
  }
</style> 