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

// Import main SASS file
import './styles/main.scss';

// Create Pinia instance
const pinia = createPinia();

// Create and mount the Vue application
const app = createApp(App);
app.use(pinia);
app.mount('#app');

// Log application version
console.log(`Financial Dashboard v${import.meta.env.VITE_APP_VERSION || '1.0.0'}`);