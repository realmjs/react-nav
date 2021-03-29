"use strict"

import React, { useState } from 'react';

import routeUtil from './route.util';

export default function Navigator(props) {

  const { routes, initialRoute, fallback } = props;

  const [routeStack, setRouteStack] = useState( createInitialRouteStack() );

  return (
    <div data-testid = "navigator">
      {
        routeStack.map((route, index) => {
          const display = index === 0 ? 'block' : 'none';
          if (!route.Page) { return null; }
          return (
            <div key = { route.name } style = {{ display }}>
              { React.createElement(route.Page) }
            </div>
          );
        })
      }
    </div>
  );

  function createInitialRouteStack() {
    if ( window.location && !Object.keys(routes).every(name => routes[name].path) ) return [];
    const name = window.location?
                  Object.keys(routes).find(name => routeUtil.match(routes[name].path).isMatched) || fallback
                :
                  initialRoute || fallback;
    return [{ name, ...routes[name] }];
  }

}

Navigator.propTypes = {
  routes: validateRoutes
};

function validateRoutes(props) {
  const { routes }= props;
  if ( !routes ) return new Error("Invalid routes definition");
  if ( !Object.keys(routes).every(name => routes[name].Page) ) return new Error("Invalid routes definition");
  if ( window.location && !Object.keys(routes).every(name => routes[name].path) ) return new Error("Invalid routes definition");
  if ( props.initialRoute && Object.keys(routes).indexOf(props.initialRoute) === -1 ) return new Error("initialRoute is not defined in routes object");
  if ( props.fallback && Object.keys(routes).indexOf(props.fallback) === -1 ) return new Error("fallback is not defined in routes object");
  return null;
}
