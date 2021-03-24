"use strict"

import React, { useState } from 'react';

export default function Navigator(props) {

  const { routes, initialRoute } = props;

  // validateRoutes();

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
    if (initialRoute) {
      return [{ name: initialRoute, ...routes[initialRoute] }]
    } else {
      return [];
    }
  }


}

Navigator.propTypes = {
  routes: validateRoutes
};

function validateRoutes(props) {
  const { routes }= props;
  if ( !routes ) return new Error("Invalid routes definition");
  if ( !Object.keys(routes).every(name => routes[name].Page) ) return new Error("Invalid routes definition");
}
