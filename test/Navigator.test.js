"use strict"

import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { mockLocation, clearMockLocation } from './util';

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

import Navigator from '../src/Navigator';

const Home = () => (<h2>Home</h2>);
const About = () => (<h2>About</h2>);
const Error404 = () => (<h2>404</h2>);
const routes = {
  'home': { Page: Home, path: '/' },
  'about': { Page: About, path: '/about' },
  "404": { Page: Error404, path: '/error/404'}
};


test("Validating routes should throw errors, in case of window.location is undefined", () => {

  const spy = jest.spyOn(console, 'error').mockImplementation();

  mockLocation(undefined);

  const routes = {
    'home': {},
  };

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'home' />, container);
  });

  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][2]).toEqual("Invalid routes definition");

  clearMockLocation();

  spy.mockRestore();

});


test("Navigator render the initial route, window.location must be undefined", () => {

  mockLocation(undefined);

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'about' />, container);
  });

  expect(container.textContent).toBe("About");

  clearMockLocation();

});


test("Navigator render the route corresponding to href", () => {

  mockLocation(new URL ('http://localhost:3000/about'));

  act(() => {
    render(<Navigator routes = {routes} />, container);
  });

  expect(container.textContent).toBe("About");

  clearMockLocation();

});


test("Navigator render fallback route if href does not match", () => {

  mockLocation(new URL ('http://localhost:3000/notexist'));

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' />, container);
  });

  expect(container.textContent).toBe("404");

  clearMockLocation();

})

test("Navigator render fallback route in routes object and message an error", () => {

  mockLocation(undefined);

  const spy = jest.spyOn(console, 'error').mockImplementation();

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'notexist' fallback = '404' />, container);
  });

  expect(container.textContent).toBe("404");

  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0]).toEqual("initialRoute is not defined in routes object");

  spy.mockRestore();

  clearMockLocation();

});

// render nothing and message an error if fallback is not in routes
// href/initialRoute --> fallback --> render null