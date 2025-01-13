<script lang="ts">
  import { language } from '$lib/stores/language';
  import { Globe } from 'lucide-svelte';

  const languages = {
    es: {
      name: 'Español',
      flag: '🇪🇸'
    },
    en: {
      name: 'English',
      flag: '🇺🇸'
    }
  };

  function toggleLanguage() {
    $language = $language === 'es' ? 'en' : 'es';
  }
</script>

<div class="relative inline-block">
  <button
    class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-lg border-2 border-gray-200 hover:bg-white/90 hover:border-blue-400 transition-all shadow-md hover:shadow-lg text-gray-900 font-semibold"
    on:click={toggleLanguage}
  >
    <Globe class="w-4 h-4 text-blue-600" />
    <span class="text-lg">{languages[$language].flag}</span>
    <span class="text-sm">{languages[$language].name}</span>
  </button>
</div>

<style>
  button {
    transform-style: preserve-3d;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  button:hover {
    transform: translateY(-1px);
  }
  
  button:active {
    transform: translateY(0px);
  }
</style> 