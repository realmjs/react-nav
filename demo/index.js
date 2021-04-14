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
  "about": { path: "/about/:team", Page: About, data: (params) => /^t|^d/.test(params.team)? Promise.resolve(params.team.toUpperCase()) : Promise.reject('404') },
  "404": { path: "/404", Page: E404 },
  'landing': { redirect: 'home', path: '/landing'},
  'blog': {
    path: "/blog/:id",
    Page: Blog,
    title: 'Blog {:id} by {{author}}/{{section.latest}}',
    data: (params, props, event) => {
      const fetchingData = { author: 'me', section: { latest: 'yesterday' }};
      const fetchedData = { author: 'me', section: { latest: 'today' }};
      setTimeout(() => event.emit('update', { scope: 'data', data: fetchedData  }), 5000);
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(fetchingData), 1000);
      });
    }
  },
};

function Demo() {

  return (
    <div>
      <header className = "w3-bar">
        <button className = "w3-bar-item w3-button" onClick = {navigateTo('home')}> Home </button>
        <button className = "w3-bar-item w3-button" onClick = {navigateTo('blog', {id: 'tech'})}> Blog </button>
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
