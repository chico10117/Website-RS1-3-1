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
  class="relative inline-flex h-12 w-[96px] items-center rounded-full bg-gray-200 backdrop-blur-md border-2 p-1 hover:border-blue-400 transition-all shadow-md hover:shadow-lg"
  on:click={toggleLanguage}
>
  <span 
    class="absolute left-1.5 flex items-center justify-center w-10 h-10 rounded-full text-3xl transition-colors duration-200"
    class:bg-transparent={$language === 'en'}
  >{languages.es.flag}</span>
  <span 
    class="pointer-events-none block w-11 h-11 rounded-full bg-white transition-transform duration-200"
    class:translate-x-[42px]={$language === 'en'}
  />
  <span 
    class="absolute right-1.5 flex items-center justify-center w-10 h-10 rounded-full text-3xl transition-colors duration-200"
    class:bg-transparent={$language === 'es'}
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