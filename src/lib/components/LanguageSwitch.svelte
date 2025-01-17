<script lang="ts">
  import { language } from '$lib/stores/language';

  const languages = {
    es: {
      name: 'Español',
      flag: '🇪🇸'
    },
    en: {
      name: 'English',
      flag: '🇬🇧'
    }
  };

  function toggleLanguage() {
    $language = $language === 'es' ? 'en' : 'es';
  }
</script>

<button
  class="relative inline-flex h-12 w-[96px] items-center rounded-full bg-white/80 backdrop-blur-md border-2 border-gray-200 p-1 hover:border-blue-300 transition-all shadow-md hover:shadow-lg"
  on:click={toggleLanguage}
>
  <span 
    class="absolute left-1.5 flex items-center justify-center w-10 h-10 rounded-full text-3xl transition-colors duration-200"
    class:bg-gray-200={$language === 'en'}
  >{languages.es.flag}</span>
  <span 
    class="pointer-events-none block w-10 h-10 rounded-full bg-blue-600 transition-transform duration-200"
    class:translate-x-[42px]={$language === 'en'}
  />
  <span 
    class="absolute right-1.5 flex items-center justify-center w-10 h-10 rounded-full text-3xl transition-colors duration-200"
    class:bg-gray-200={$language === 'es'}
  >{languages.en.flag}</span>
</button>

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