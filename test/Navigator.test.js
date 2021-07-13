"use strict"

import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import { setLocation, mockLocation, clearMockLocation } from './util';
import EventEmitter from "../src/event-emitter";

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  clearMockLocation();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  sessionStorage.clear();
});

import { Navigator, nav, useDocumentTitle } from '../src';

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


test("Navigator alert an error if missing initialRoute when noURL is set", () => {

  const spy = jest.spyOn(console, 'error').mockImplementation();

  act(() => {
    render(<Navigator routes = {routes} noURL fallback = '404' />, container);
  });

  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][2]).toEqual("initialRoute must be defined when noURL = true");

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
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([{ name: '404', params: {} }]);

});


test("Navigator render the initial route when window.location is undefined", () => {

  mockLocation(undefined);

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'about' routeStackName = '__routestack_' />, container);
  });

  expect(container.textContent).toBe("About");
  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([{ name: 'about', params: {} }]);

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


test("Navigator reload route: already in routeStack but with different path, should add to stack", () => {

  sessionStorage.setItem('__routestack_', JSON.stringify([
    { name: 'home', path: '/', params: {} },
    { name: 'contact', path: '/contact/dev', params: { team: 'dev' } }
  ]));

  setLocation("/contact/test");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' />, container);
  });

  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'contact', path: '/contact/test', params: { team: 'test' } },
    { name: 'home', path: '/', params: {} },
    { name: 'contact', path: '/contact/dev', params: { team: 'dev' } }
  ]);

});


test("Navigator navigate route: already in routeStack but with different path, should add to stack", () => {

  sessionStorage.setItem('__routestack_', JSON.stringify([
    { name: 'home', path: '/', params: {} },
    { name: 'contact', path: '/contact/dev', params: { team: 'dev' } }
  ]));

  setLocation("/");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_'  />, container);
  });

  act(() => nav.navigate('contact', { team: 'test' }));

  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'contact', path: '/contact/test', params: { team: 'test' } },
    { name: 'home', path: '/', params: {} },
    { name: 'contact', path: '/contact/dev', params: { team: 'dev' } }
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


test("Navigator redirect route that already in the routeStack", () => {

  const mockEvent = jest.fn();

  sessionStorage.setItem('__routestack_', JSON.stringify([
    { name: 'home', path: '/', params: {} },
  ]));

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


test("Navigator passing enough properties to route object", () => {
  const PageTest = jest.fn(() => null);
  const PageDev = jest.fn(() => null);
  const routes = {
    'test': { Page: PageTest, path: '/test' },
    'dev': { Page: PageDev, path: '/dev' }
  };

  setLocation("/test");

  act(() => {
    render(<Navigator routes = {routes} />, container);
  });

  expect(PageTest).toHaveBeenCalled();
  expect(PageTest.mock.calls[0][0]).toHaveProperty('route', { name: "test", params: {}, path: "/test", event: new EventEmitter(), isActive: true });
  expect(PageDev).not.toHaveBeenCalled();

  act(() => nav.navigate('dev'));

  expect(PageTest).toHaveBeenCalled();
  expect(PageTest.mock.calls[1][0]).toHaveProperty('route', { name: "test", params: {}, path: "/test", event: new EventEmitter(), isActive: false });
  expect(PageDev).toHaveBeenCalled();
  expect(PageDev.mock.calls[0][0]).toHaveProperty('route', { name: "dev", params: {}, path: "/dev", event: new EventEmitter(), isActive: true });

});


test("Navigator use hook to set document title", () => {

  const Page = ({ route }) => { useDocumentTitle(route); return null; }
  const routes = {
    test: { Page, path: '/test/:team', title: 'Test Team' },
    dept: { Page, path: '/department/:dept', title: 'Department' },
  };

  setLocation("/test/alpha");

  act(() => {
    render(<Navigator routes = {routes} />, container);
  });

  expect(document.title).toBe('Test Team');

  act(() => nav.navigate('dept', { dept: 'test' }));

  expect(document.title).toBe('Department');

});


test("Corner case: test for special path pattern: /:param/test", () => {

  const routes = {
    home: { path: '/:param', Page: () => <p>Home</p> },
    test: { path: '/:param/test', Page: () => <p>Test</p> },
    404: { path: '/404', Page: () => <p>404</p> }
  }

  setLocation('/p/test');

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' />, container);
  });

  expect(location.pathname).toBe('/p/test');
  expect(container.textContent).toBe("Test");

});


test("Corner case: test for duplicate error path", () => {

  const mockEvent = jest.fn();

  sessionStorage.setItem('__routestack_', JSON.stringify([
    { name: '404', path: '/error/404', params: {} },
  ]));

  setLocation("/notexist");

  act(() => {
    render(<Navigator routes = {routes} fallback = '404' routeStackName = '__routestack_' onRouteStackChange = {mockEvent} />, container);
  });

  expect(container.textContent).toBe("404");

  expect(mockEvent).toHaveBeenCalled();
  expect(mockEvent.mock.calls[0][0]).toEqual([{ name: '404', path: '/error/404', params: {} }]);

});


test("Navigator propagate its props to Page", () => {
  const PageTest = jest.fn(() => null);

  const routes = {
    'test': { Page: PageTest, path: '/test' },
  };

  setLocation("/test");

  act(() => {
    render(<Navigator routes = {routes} propToBePropagated = 'testpass' />, container);
  });

  expect(PageTest.mock.calls[0][0]).toHaveProperty('propToBePropagated', 'testpass');

});


test("Navigator with noURL, initialRoute must be used", () => {
  const routes = {
    "home": { Page: jest.fn(() => null) },
    "begin": { Page: jest.fn(() => null) },
    "end": { Page: jest.fn(() => null) },
  };

  setLocation("/notexist");

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'begin' routeStackName = '__routestack_' noURL />, container);
  });

  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'begin', params: {}},
  ]);

  act(() => nav.navigate('end', {}));

  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'end', params: {} },
    { name: 'begin', params: {} },
  ]);

});


test("Navigator with noURL, there is should no duplicated route in routeStack", () => {
  const routes = {
    "begin": { Page: jest.fn(() => null) },
  };

  sessionStorage.setItem('__routestack_', JSON.stringify([
    { name: 'begin', params: {} }
  ]));


  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'begin' routeStackName = '__routestack_' noURL />, container);
  });

  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'begin', params: {}},
  ]);

  act(() => nav.navigate('begin', {}));

  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'begin', params: {} },
  ]);

});


test("Navigator with noURL, initialRoute must be used when route contain same path", () => {
  const routes = {
    "home": { path: '/:t', Page: jest.fn(() => null) },
    "begin": { path: '/:t', Page: jest.fn(() => null) },
  };

  setLocation("/test");

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'begin' routeStackName = '__routestack_' noURL />, container);
  });

  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'begin', path: '/test', params: {t: 'test'}},
  ]);

});

test.only("Navigator with noURL, initialRoute must be used when route contain same path and routeStack store different path", () => {
  const routes = {
    "home": { path: '/:t', Page: jest.fn(() => null) },
    "begin": { path: '/:t', Page: jest.fn(() => null) },
    "end": { path: '/:t', Page: jest.fn(() => null) },
  };

  sessionStorage.setItem('__routestack_', JSON.stringify([
    { name: 'end', path: '/test', params: {t: 'test'}},
    { name: 'begin', path: '/test', params: {t: 'test'}},
  ]));

  setLocation("/test");

  act(() => {
    render(<Navigator routes = {routes} initialRoute = 'begin' routeStackName = '__routestack_' noURL />, container);
  });

  expect(JSON.parse(sessionStorage.getItem('__routestack_'))).toEqual([
    { name: 'begin', path: '/test', params: {t: 'test'}},
    { name: 'end', path: '/test', params: {t: 'test'}},
  ]);

});
