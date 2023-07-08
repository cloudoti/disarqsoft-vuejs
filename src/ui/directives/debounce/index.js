import debounce from './debouncer';

function directive(el, binding) {
  // change debounce only if interval has changed
  if (binding.value !== binding.oldValue) {
    // eslint-disable-next-line no-param-reassign
    el.oninput = directive.debounce((evt) => {
      el.dispatchEvent(new Event('change'));
    }, parseInt(binding.value, 10) || 500);
  }
}

directive.debounce = debounce;

export default directive;
