"use strict"

import React, { useState, useEffect } from 'react';

import routeUtil from './route.util';
import env from './env.util';
import storage from './storage.util';
import { registerNavigator } from './nav';
import { useComponentWillMount } from './lifecycle.hook';
import EventEmitter from '../src/event-emitter';

export default function Navigator(props) {

  const { routes, initialRoute, fallback } = props;

  const [routeStack, setRouteStack] = useState(() => createInitialRouteStack());

  useComponentWillMount(setInitialLocation);

  useEffect(() => storage.set(exportRouteStack()), [routeStack]);
  useEffect(() => props.onRouteStackChange && props.onRouteStackChange(exportRouteStack()), [routeStack]);

  useEffect(() => registerNavigator({ navigate }), []);

  return (
    <div data-testid = "navigator">
      {
        routeStack.map((route, index) => {
          const display = index === 0 ? 'block' : 'none';

          if (!route.Page)
            return null;

          return (
            <div key = { route.name } style = {{ display }}>
              { React.createElement(route.Page, { route: exportRouteForPage(route) }) }
            </div>
          );
        })
      }
    </div>
  );

  function createInitialRouteStack() {
    if ( env.isWeb() && !Object.keys(routes).every(name => routes[name].path || routes[name].redirect) )
      return [];

    let name = env.isWeb()?
                  Object.keys(routes).find(name => routes[name].path && routeUtil.match(routes[name].path).isMatched) || fallback
                :
                  initialRoute || fallback;

    if (routes[name].redirect) {
      name = routes[name].redirect;
    }

    const routeStack = importRouteStack(storage.get());

    const index = routeStack.findIndex(route => route.name === name);

    if (index === -1) {
      const route = { ...routes[name] };
      route.params = env.isWeb()? routeUtil.match(routes[name].path).params : undefined;
      route.path = env.isWeb()? routeUtil.constructLocationPath(route.path, route.params) : undefined;
      routeStack.unshift({ name, ...route });
    } else {
      routeStack.unshift(routeStack.splice(index, 1)[0]);
    }

    return routeStack;
  }

  function setInitialLocation() {
    const route = routeStack[0];
    env.isWeb() && routeUtil.path.replace(route.path);
  }

  function exportRouteStack() {
    return routeStack.map(route => {
      const {Page, ...rest} = route;
      return rest;
    });
  }

  function importRouteStack(routeStack) {
    if (!routeStack)
      return [];

    return routeStack.map(route => {
      return { ...route, Page: routes[route.name].Page };
    });
  }

  function exportRouteForPage(route) {
    const {Page, ...exported} = { ...route };
    exported.event = new EventEmitter();
    return exported;
  }

  function navigate(name, params) {
    if (!routes[name]) {
      console.error(`[Error: route name ${name} does not exist]`);
      return false;
    }
    const route = { ...routes[name] };
    route.params = params || {};
    try {
      route.path = env.isWeb()? routeUtil.constructLocationPath(route.path, route.params) : undefined;
    } catch(err) {
      console.error("[Error: route params do not match the param's pattern]");
      return false;
    }
    env.isWeb() && routeUtil.path.replace(route.path);
    setRouteStack(routeStack => addToRouteStackIfNotExist(routeStack, { name, ...route }));
  }

  function addToRouteStackIfNotExist(routeStack, route) {
    const index = routeStack.findIndex(r => r.name === route.name);
    if (index === -1) {
      return [route, ...routeStack];
    } else {
      routeStack.unshift(routeStack.splice(index, 1)[0]);
      return [...routeStack];
    }
  }

}

Navigator.propTypes = {
  routes: validateRoutes
};

function validateRoutes(props) {
  const { routes }= props;
  if ( !routes ) return new Error("Invalid routes definition");
  if ( !Object.keys(routes).every(name => routes[name].Page || routes[name].redirect) ) return new Error("Invalid routes definition");
  if ( env.isWeb() && !Object.keys(routes).every(name => routes[name].path || routes[name].redirect) ) return new Error("Invalid routes definition");
  if ( props.initialRoute && Object.keys(routes).indexOf(props.initialRoute) === -1 ) return new Error("initialRoute is not defined in routes object");
  if ( props.fallback && Object.keys(routes).indexOf(props.fallback) === -1 ) return new Error("fallback is not defined in routes object");
  return null;
}
