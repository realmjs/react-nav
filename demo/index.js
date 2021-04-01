"use strict"

import React from 'react';
import { render } from 'react-dom';

import { Navigator, nav } from '../src';

import Home from './Page/Home';
import About from './Page/About';
import E404 from './Page/E404';
import Blog from './Page/Blog';

const routes = {
  "home": { path: "/", Page: Home },
  "about": { path: "/about/:team", Page: About },
  "404": { path: "/404", Page: E404 },
  'landing': { redirect: 'home', path: '/landing'},
  'blog': { path: "/blog", Page: Blog },
};

function Demo() {

  return (
    <div>
      <header className = "w3-bar">
        <button className = "w3-bar-item w3-button" onClick = {navigateTo('home')}> Home </button>
        <button className = "w3-bar-item w3-button" onClick = {navigateTo('blog')}> Blog </button>
        <button className = "w3-bar-item w3-button" onClick = {navigateTo('about', { team: 'test' })}> About </button>
      </header>
      <div className = "w3-container">
        <Navigator  routes = {routes}
                    fallback = '404'
                    onRouteStackChange = { rs => console.log(rs) }
        />
      </div>
    </div>
  );

  function navigateTo(name, params) {
    return e => nav.navigate(name, params);
  }

}

render(<Demo />, document.getElementById('root'));
