<script lang="ts">
  import { language } from '$lib/stores/language';
  import { Globe } from 'lucide-svelte';

  function toggleLanguage() {
    $language = $language === 'es' ? 'en' : 'es';
  }
</script>

<div class="relative inline-block">
  <button
    class="flex items-center space-x-1 px-3 py-1 bg-white/30 backdrop-blur-sm rounded-lg border border-white/50 hover:bg-white/40 transition-colors text-gray-700"
    on:click={toggleLanguage}
  >
    <Globe class="w-4 h-4" />
    <span class="text-sm font-medium uppercase">{$language}</span>
  </button>
</div> 