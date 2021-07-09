import 'core-js/stable';
import 'regenerator-runtime/runtime';

import ReactDOM from 'react-dom';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// Modal creates a portal.  Overriding ReactDOM.createPortal allows portals to be tested in jest.
ReactDOM.createPortal = node => node;

// Mock Intersection Observer which is unavailable in the context of a test.
global.IntersectionObserver = jest.fn(function mockIntersectionObserver() {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
});

// Mock getComputedStyle which some Paragon components use to do size calculations.  In general
// These calculations don't matter for our test suite.
window.getComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn(),
}));
