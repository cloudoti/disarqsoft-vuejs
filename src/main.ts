import { createApp } from 'vue';
import Maska from 'maska';
import Toast, { PluginOptions } from 'vue-toastification';
import LitepieDatepicker from 'litepie-datepicker';
import Popper from 'vue3-popper';
import { AlertPlugin } from '@/ui/plugins/alert';
import App from '@/App.vue';
import router from '@/router';
import global from '@/data/global';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
import directive from '@/ui/directives/debounce';

import '@/assets/tailwind.css';
import '@/assets/vue-notifications.scss';
import Auth from '@/data/Auth';
import Store from '@/data/Store';

const options: PluginOptions = {
  // You can set your default options here
};

const app = createApp(App);
// Inject middlewares
app.use(router);
app.use(Maska);
app.use(AlertPlugin);
app.use(Toast, options);
app.use(LitepieDatepicker);
// Inject provides
app.provide('store', global);

// Inject components
app.component('Popper', Popper);
// Inject directives
app.directive('debounce', (el, binding) => directive(el, binding));

app.mount('#app');
