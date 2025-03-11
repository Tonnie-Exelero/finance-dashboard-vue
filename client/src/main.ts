/**
 * Main Application Entry Point
 * 
 * Initializes the Vue application with Pinia and mounts it to the DOM.
 * 
 * @module main
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Create Pinia instance
const pinia = createPinia();

// Create and mount the Vue application
const app = createApp(App);
app.use(pinia);
app.mount('#app');

// Log application version
console.log(`Financial Dashboard v${process.env.VITE_APP_VERSION || '1.0.0'}`);