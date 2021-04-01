"use strict"

import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { setLocation, mockLocation, clearMockLocation } from './util';

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  sessionStorage.clear();
});

import { Navigator } from '../src';

import { Home, About, Contact, Error404 } from './page.util';
const routes = {
  'home': { Page: Home, path: '/' },
  'about': { Page: About, path: '/about' },
  'contact': { Page: Contact, path: '/contact/:team' },
  "404": { Page: Error404, path: '/error/404'},
  "landing": { redirect: 'home', path: '/landing' },
};


test("Navigator alert an error if missing Page in route definition", async () => {

  const spy = jest.spyOn(console, 'error').mockImplementation();

  const routes = {
    'home': { path: '/' },
  };

  act(() => {
    render(<Navigator routes = {routes} />, container);
  });

  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][2]).toEqual("Invalid routes definition");

  spy.mockRestore();

});


test("Navigator alert an error if initialRoute does not in the routes", () => {

  const spy = jest.spyOn(console, 'error').mockImplementation();

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'notexist' fallback = '404' />, container);
  });

  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][2]).toEqual("initialRoute is not defined in routes object");

  spy.mockRestore();

});


test("Navigator alert an error if fallback is not defined in the routes", () => {

  const spy = jest.spyOn(console, 'error').mockImplementation();

  act(() => {
    render(<Navigator routes = {routes} fallback = 'notexist' />, container);
  });

  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][2]).toEqual("fallback is not defined in routes object");

  spy.mockRestore();

});


test("Navigator render fallback route if href does not match", () => {

  setLocation("/noexist");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' />, container);
  });

  expect(container.textContent).toBe("404");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([{ name: '404', path: routes['404'].path, params: {} }]);
  expect(location.pathname).toBe('/error/404');

});


test("Navigator render fallback if initialRoute and window.location are both undefined", () => {

  mockLocation(undefined);

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' />, container);
  });

  expect(container.textContent).toBe("404");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([{ name: '404' }]);

  clearMockLocation();

});


test("Navigator render the initial route when window.location is undefined", () => {

  mockLocation(undefined);

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'about' routeStackName = '__routestack_' />, container);
  });

  expect(container.textContent).toBe("About");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([{ name: 'about' }]);

  clearMockLocation();

});


test("Navigator render the route corresponding to href", () => {

  setLocation("/about");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' />, container);
  });

  expect(container.textContent).toBe("About");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([{ name: 'about', path: routes['about'].path, params: {} }]);

});


test("Navigator notify via props.onRouteStackChange when routeStack is changed", () => {

  const mockEvent = jest.fn();

  setLocation("/about");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' onRouteStackChange = {mockEvent} />, container);
  });

  expect(mockEvent).toHaveBeenCalled();
  expect(mockEvent.mock.calls[0][0]).toEqual([{ name: 'about', path: routes['about'].path, params: {} }]);

});


test("Navigator import routeStack from sessionStorage at initial load", () => {

  const mockEvent = jest.fn();

  setLocation("/about");

  sessionStorage.setItem('__routestack_', JSON.stringify([ { name: 'home', path: routes['home'].path, params: {} } ]));

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' onRouteStackChange = {mockEvent} />, container);
  });

  expect(mockEvent).toHaveBeenCalled();
  expect(mockEvent.mock.calls[0][0]).toEqual([
    { name: 'about', path: routes['about'].path, params: {} },
    { name: 'home', path: routes['home'].path, params: {} }
  ]);

});


test("Navigator should avoid dulicated route in routeStack when reload page", () => {

  const mockEvent = jest.fn();

  setLocation("/about");

  sessionStorage.setItem('__routestack_', JSON.stringify([ { name: 'about', path: routes['about'].path, params: {} } ]));

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' onRouteStackChange = {mockEvent} />, container);
  });

  expect(mockEvent).toHaveBeenCalled();
  expect(mockEvent.mock.calls[0][0]).toEqual([{ name: 'about', path: routes['about'].path, params: {} }]);

});


test("Navigator should avoid dulicated route in routeStack when popback", () => {

  const mockEvent = jest.fn();

  sessionStorage.setItem('__routestack_', JSON.stringify([
    { name: 'home', path: routes['home'].path, params: {} },
    { name: 'about', path: routes['about'].path, params: {} }
  ]));

  setLocation("/about");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' onRouteStackChange = {mockEvent} />, container);
  });

  expect(mockEvent).toHaveBeenCalled();
  expect(mockEvent.mock.calls[0][0]).toEqual([
    { name: 'about', path: routes['about'].path, params: {} },
    { name: 'home', path: routes['home'].path, params: {} }
  ]);

});


test("Navigator redirect route", () => {

  const mockEvent = jest.fn();

  setLocation("/landing");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' onRouteStackChange = {mockEvent} />, container);
  });

  expect(container.textContent).toBe("Home");

  expect(mockEvent).toHaveBeenCalled();
  expect(mockEvent.mock.calls[0][0]).toEqual([{ name: 'home', path: '/', params: {} }]);

});

test("Navigator passing params to page ", () => {

  const mockEvent = jest.fn();

  setLocation("/contact/test");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' onRouteStackChange = {mockEvent} />, container);
  });

  expect(container.textContent).toBe("Contact test");

  expect(mockEvent).toHaveBeenCalled();
  expect(mockEvent.mock.calls[0][0]).toEqual([{ name: 'contact', path: '/contact/test', params: { team: 'test' } }]);

});
