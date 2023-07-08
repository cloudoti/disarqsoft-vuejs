import Toaster from './AlertPlugin.vue';
// import eventBus from './helpers/event-bus.js'
import mount from './helpers/mount-component';

const Api = (globalOptions = {}) => ({
  show(title, messages, options = {}) {
    const localOptions = {
      title,
      messages,
      ...options,
    };
    const c = mount(Toaster, {
      props: { ...globalOptions, ...localOptions },
    });
    return c;
  },
  clear() {
    // eventBus.$emit('toast-clear');
  },
  success(messages, options = {}) {
    // eslint-disable-next-line no-param-reassign
    options.type = 'success';
    return this.show('Operación Correcta', messages, options);
  },
  error(messages, options = {}) {
    // eslint-disable-next-line no-param-reassign
    options.type = 'error';
    return this.show('Ocurrió en error inesperado', messages, options);
  },
  info(messages, options = {}) {
    // eslint-disable-next-line no-param-reassign
    options.type = 'info';
    return this.show('', messages, options);
  },
  warning(messages, options = {}) {
    // eslint-disable-next-line no-param-reassign
    options.type = 'warning';
    return this.show('Algo paso!', messages, options);
  },
});

export default Api;
