"use strict"

import React from 'react';
import { render } from 'react-dom';

import { Navigator } from '../src';

import Home from './Home';
import About from './About';
import E404 from './E404';

const routes = {
  "home": { path: "/", Page: Home },
  "about": { path: "/about", Page: About },
  "404": { path: "/404", Page: E404 },
  'landing': { redirect: 'home', path: '/landing'},
};

function Demo() {

  return (
    <div className = "w3-container">
      <Navigator  routes = {routes}
                  fallback = '404'
      />
    </div>
  );

}

render(<Demo />, document.getElementById('root'));
