import { render, h } from 'vue';

const createElement = () => typeof document !== 'undefined' && document.createElement('div');

const mount = (component, {
  props,
  children,
  element,
  app,
} = {}) => {
  let el = element || createElement();

  let vNode = h(component, props, children);
  // eslint-disable-next-line no-underscore-dangle
  if (app && app._context) {
    // eslint-disable-next-line no-underscore-dangle
    vNode.appContext = app._context;
  }

  render(vNode, el);

  const destroy = () => {
    if (el) {
      render(null, el);
    }
    el = null;
    vNode = null;
  };

  return {
    vNode,
    destroy,
    el,
  };
};

export default mount;
