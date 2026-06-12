// Jest setup for general testing DOM properties
import '@testing-library/jest-dom';

// Polyfill or mock for APIs not natively present in JSDOM environment
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

window.scrollTo = window.scrollTo || function() {};
