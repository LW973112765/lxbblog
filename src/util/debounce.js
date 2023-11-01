export function debounce(fn, delay) {
  let timer;
  // console.log("调用了防抖", fn, delay);
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, delay);
  };
}
