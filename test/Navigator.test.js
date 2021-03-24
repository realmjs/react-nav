"use strict"

import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

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
const routes = {
  'home': { Page: Home },
  'about': { Page: About },
};


test("Navigator render the initial route", () => {

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'home' />, container);
  });

  expect(container.textContent).toBe("Home");

});


test("Validating routes should throw errors", () => {

  const spy = jest.spyOn(console, 'error').mockImplementation();

  const routes = {
    'home': {},
  };

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'home' />, container);
  });

  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][2]).toEqual("Invalid routes definition");

  spy.mockRestore();

});
