import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit'; // <-- Add this line

// Call injectAnalytics at the module level
injectAnalytics({ mode: dev ? 'development' : 'production' }); // <-- Add this line

export const prerender = false;
export const ssr = true;
export const trailingSlash = 'never';