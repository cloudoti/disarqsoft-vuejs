import AlertPlugin from './AlertPlugin.vue';
import createAlert from './api.js';

const Plugin = (app, options = {}) => {
  const methods = createAlert(options);
  // eslint-disable-next-line no-param-reassign
  app.$toast = methods;
  // eslint-disable-next-line no-param-reassign
  app.config.globalProperties.$toast = methods;
};

AlertPlugin.install = Plugin;

export default AlertPlugin;
export { AlertPlugin, createAlert };
