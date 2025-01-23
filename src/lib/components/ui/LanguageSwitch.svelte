<script lang="ts">
  import { language } from '$lib/stores/language';

  function toggleLanguage() {
    $language = $language === 'en' ? 'es' : 'en';
  }
</script>

<button
  on:click={toggleLanguage}
  class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white dark:text-gray-800 dark:bg-gray-200/50 dark:hover:bg-gray-200/70 transition-colors"
>
  <span class="text-lg">
    {#if $language === 'en'}
      🇬🇧
    {:else}
      🇪🇸
    {/if}
  </span>
  <span class="font-medium">
    {$language.toUpperCase()}
  </span>
</button> 