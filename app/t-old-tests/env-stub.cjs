class CustomEvent {
  constructor(type, init) {
    this.type = type;
    if (init && init.detail) this.detail = init.detail;
  }
}

function makeElement() {
  return {
    style: {},
    className: '',
    textContent: '',
    setAttribute() {},
    appendChild() {},
    removeChild() {},
    addEventListener() {},
    removeEventListener() {},
    querySelector: makeElement,
    querySelectorAll: () => [],
    getElementsByTagName: () => [],
    classList: { add() {}, remove() {}, contains: () => false },
    parentNode: null,
  };
}

function globalWindowStub() {
  return {
    setTimeout: (cb, ms) => setTimeout(cb, ms),
    clearTimeout: (id) => clearTimeout(id),
    setInterval: (cb, ms) => setInterval(cb, ms),
    clearInterval: (id) => clearInterval(id),
    dispatchEvent: () => true,
    addEventListener() {},
    getElementById: makeElement,
    createElement: makeElement,
    requestAnimationFrame: (cb) => setTimeout(() => cb(Date.now()), 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    CustomEvent,
  };
}

const NodeEnvironment = require('jest-environment-node').default || require('jest-environment-node');
module.exports = class PacmanTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    const w = globalWindowStub();
    w.window = w;
    this.global.window = w;
    const document = {
      getElementById: makeElement,
      createElement: makeElement,
      querySelector: makeElement,
      querySelectorAll: () => [],
      body: makeElement(),
      addEventListener() {},
    };
    this.global.document = document;
    this.global.requestAnimationFrame = w.requestAnimationFrame;
    this.global.cancelAnimationFrame = w.cancelAnimationFrame;
    this.global.CustomEvent = CustomEvent;
  }
};