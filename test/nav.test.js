"use strict"

import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { setLocation, mockLocation, clearMockLocation } from './util';

import { Navigator, nav } from '../src';
import { Home, About, Contact, Error404 } from './page.util';
const routes = {
  'home': { Page: Home, path: '/' },
  'about': { Page: About, path: '/about' },
  'contact': { Page: Contact, path: '/contact/:team' },
  "404": { Page: Error404, path: '/error/404'},
  "landing": { redirect: 'home', path: '/landing' },
};

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

test("Navigate between pages", () => {

  setLocation("/");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' />, container);
  });

  act(() => nav.navigate('about'));
  expect(location.pathname).toBe("/about");
  expect(container.textContent).toBe("AboutHome");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'about', path: '/about', params: {} },
    { name: 'home', path: '/', params: {} },
  ]);

  act(() => nav.navigate('contact', { team: 'test' }));
  expect(location.pathname).toBe("/contact/test");
  expect(container.textContent).toBe("Contact testAboutHome");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'contact', path: '/contact/test', params: { team: 'test' } },
    { name: 'about', path: '/about', params: {} },
    { name: 'home', path: '/', params: {} },
  ]);

  act(() => nav.navigate('home'));
  expect(location.pathname).toBe("/");
  expect(container.textContent).toBe("HomeContact testAbout");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'home', path: '/', params: {} },
    { name: 'contact', path: '/contact/test', params: { team: 'test' } },
    { name: 'about', path: '/about', params: {} }
  ]);


});


test("Alert error when navigating with invalid route name", () => {

  const spy = jest.spyOn(console, 'error').mockImplementation();

  setLocation("/");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' />, container);
  });

  act(() => nav.navigate('notexist'));
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0]).toEqual("route name notexist does not exist");
  expect(location.pathname).toBe("/");
  expect(container.textContent).toBe("Home");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'home', path: '/', params: {} },
  ]);

  spy.mockRestore();

});
