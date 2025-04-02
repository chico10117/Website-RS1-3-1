import { writable } from 'svelte/store';

export const iframeRefreshTrigger = writable(0);

export function triggerIframeRefresh() {
    iframeRefreshTrigger.update(n => n + 1);
} 