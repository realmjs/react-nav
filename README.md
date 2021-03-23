# react-nav

Providing useful Navigator component, nav and page handler

## Installation

`npm install --save @realmjs/react-navi`

## Running example demo

`npm start`

Checkout the example at `localhost:3000`

## Walkthrough Tutorial

TBD

## Quick Simple Usage

```javascript
"use strict"

import React, { Component } from 'react'
import { Navigator } from 'react-navi'

function Home({ nav }) {
  return (
    <div>
      <h2> Home </h2>
      <p>
        <button onClick = { e => nav.navigate('about') }> About </button>
      </p>
    </div>>
  );
}

function About() {
  return (
    <div>
      <h2> About me </h2>
      <p>
        <button onClick = { e => nav.navigate('home') }> Home </button>
      </p>
    </div>>
  );
}

function Error({ route }) {
  const {code, text} = route.data;
  return (
    <div>
      <h2> Error: {code || 'Unknown'} </h2>
      <p> {text || 'Unexpected unknown error has occured'} </p>
    </div>
  );
}

const routes = {
  home: {
    Page: Home,
    url: '/'
  },
  about: {
    Page: About,
    url: '/about'
  },
  error404: {
    Page: Error,
    url: '/error/404',
    data: {
      code: 404,
      text: 'Page not found'
    }
  }
};

function Demo(props) {
  return (
    <div>
      <Navigator  routes = {routes}
                  initialRoute = 'home'
                  fallbackRoute = 'error404'
                  {...this.props}
      />
    </div>
  );
}
```
Either click to the buttons or make change in your browser address bar to navigate to page. For the url paths that does not match with those in `routes` will be redirected to `fallbackRoute`, i.e. `/error/404` in this example.

Any Props passing to `Navigator` will be passed to `Page` element.

It is a simple usage. However, `Navigator` can do much more than that.

## Concept

`@realmjs/react-navi` is built around the `route` object and `navigator` component.

### `Route` object

A `route` object defines a `route` controlled by `Navigator`.

```javascript
route {
  url: String,              // path of url for this route, does NOT include hostname
  Page: React.Component,    // A React component used to render your Page
  data: Object || Promise,  // data you can access from your Page via props.route.data
  title: String,            // Title the browser will display when entered into this route
  resolve: Function         // Function will be called if the promise function of data is resolved
  reject: Function          // Function will be called if the promise function of data is rejected
  redirect: String          // Name of the route that this route will be redirected to
}
```

`url`: is the path of `route` and case insensitive. If your app does not need url, you can ommit it and set prop `noUrl = {true}` in `Navigator`

* Route parameter is supported. For example: `/document/:docid`. You can access these parameters in `route.params`   .

`data`: is the data you want to pass into the rendered Page element of this `route`. It can be an object or a function returning a promise.

* A promise is useful if you want the `navigator` to prepare data before actually navigating to Page. The data function receives two arguments: `params` which is `route.params` and `props` which is the react props passing to the element. Page is loaded only if the function is resolved.

  ```javascript
  const route = {
    ...
    data: ({params, props} => fetch(`${props.endpoint}/${params.id}`)),
    ...
  };
  ```
  Resolved data is accessed from the Page via `props.route.data`

`resolve`: the callback function which is called if the data promise function is resolved, accept the resolved data as the function argument.

`reject`: the callback function which is called if the data promise function is rejected, accept the rejected error as the function argument.

`Page`: is the React component you design for `route`. The `Navigator` will pass the following helper props to your `Page` element:

* `route`: this route object represents the current route. It contains the actual url path, the resolved data, the params object extracted from the url path and an isActive flag indicating whether this route is active or not.

  ```javascript
  const route = { url: '/page/about/:id', Page: Page, data: ({params, props}) => fetch(`/person/${params.id}`) };

  function Page({ route }) {
    const { url, data, params, isActive } = route;
    console.log(url);        // example output: /page/about/jon
    console.log(params);     // example output: { id: 'jon' }
    console.log(data);       // example output: { person: 'Jon Snow', email: 'jon@westeros.got }
    console.log(isActive);   // example output: true or false
    return (
      <div>
        <h2> Person: {data.person} </h2>
        <p> {data.email} </p>
      </div>
    );
  }
  ```

* `page`: the page helper providing some helper utilities for page. You can setup page event observer (load, enter, leave...), create page popup or get data passed to page via navigator routine.

`redirect`: the name of route that this route should be redirected to. For example:

```javascript
const routes = {
  home: {
    url: '/',
    Page: Home
  },
  landing: {
    url: '/landing',
    redirect: 'home'
  }
};
```

* `title`: The document title the browser will display for that `route`. Using {:param} and {{data}} for dynamic title. For example:

  ```javascript
  {
    url: '/welcome/:team',
    data: () => fetch('api/name'),
    title: "Welcome {{name}} from {:team} team",
  }
  ```

  When accessing /welcome/dev with resolving data { name: 'awesome' }, the title will be "Welcome awesome from dev team"

### `Navigator` Component

`Navigator` component controls all routes registered to it. Each time user navigate to a route (by calling API or change url in address bar), it will render and display `Page` component of that `route`.

For each rendered `Page`, `Navigator` will inject `route` object and `page` object into `props`.

Note that there is only one `Navigator` for entire application.

#### `Navigator` Component Properties:

`routes` (Object): Routes object to be registered into `Navigator`

`initialRoute` (String): Name of the `route` that will be active at initial if `noUrl` is `true`

`fallbackRoute` (String): Name of the `route` that `Navigator` will redirect to if the `url` does not match any `route` in registered `routes`. It is ignored if `noUrl` is `false`. Note that navigate to an unregistered route by `navigate API` will not redirect to `fallbackRoute`, but `reject` with an error.

`onChangeRoute` (Function): Function that is called when active route is changed. It receives the `route` object of active route as the arguments.

`onEnterPage` (Function): Function that is called when navigate is enter a Page but before the page is rendered. It receives the `route` object of active route as the arguments.

`onPageRendered` (Function): Function that is called after Page is rendered, It receives the `route` object of active route as the arguments.

`noUrl` (Boolean): Default is `false`, define whether your application should use `url` or not. If set to `true`, `route` object will require `url`, navigate to a `route` will update `url` in address bar and you can also navigate by typing `url` from there.

`routeHandler` (Function): The function will be called when creating `navigator`, with `routeHandler` in the argument. `routeHanler` can be used to call `navigate` API. [Deprecated]

```javascript
// example of using routeHandler
...
render() {
  return (
    <Navigator  routes = {routes}
                onChangeRoute = { route => console.log('Active route is' + route.url) }
                onPageRendered = { route => console.log('Rendered page for route ' + route.url) }
                onEnterPage = { route => console.log('Enter page for route ' + route.url) }
                {...this.props}
    />
  )
}
```

#### Route Stack

The `Navigator` will create route stack in session storage automatically. Each time user navigate to a `route`, it will add to the route stack.

### Global `nav` Object

`@realmjs/react-navi` expose the global `nav` object. It can be used to navigate route, create `global popup` or create `toast` from anywhere in your application

**`navigate (name, options)`**

`name` (String): name of route navigate to

`options` (Object): optional

* `data` (Object): Data passing to `Page` and can be accessed via `props.page.data`.

* `noUpdateUrl` (Boolean): defalt is `false`, set to `true` will not update url [Deprecated]

* `reload` (Boolean): default is `false`, set to `true` will cause a `web page reload` when navigating.

This function return a `promise`

**`popup(PopupComponent, options, callback)`**

* `PopupComponent` (React Component): A React Component design the popup

* `options` (Object): optional
  * `data` (Object): Data passed to `Popup` via `self` object
  * `overlay` (Boolean): Default is `false`, set to `true` will create `popup` in an overlay layer
  * `onClickOverlay` (Function): The function is called whenever user click to overlay. Accept `self` as the function argument.

* `callback` - `Function`: optional, a callback provide `self` object to `resolve` or `reject` popup.

This function return a `promise` that `resolve` or `reject` by the `popup` via `self` object

**Popup `self` object**

The `Popup` component receive `self` object via its `props`.

```javascript
self {
  data: Object,
  onClickOverlay: Function,
  resolve: Function,
  reject: Function
}
```
Note that the popup created by `nav` is global.

##### Create `toast`

`Toast` can only be created by `nav` object. The API is veri similar to `popup APi` except that it does not return anything

**`toast(ToastComponent, options, callback)`**

* `PopupComponent` - `React Component`: A React Component design the popup

* `options` - `Object`: optional
  * `data` - `Object`: `data` passed to `Toast` via `self` object
  * `bottom` - `Boolean`: default `false`, if set to `true` toast will float up from bottom

* `callback` - `Function`: optional, a callback provide `self` object to `close` toast.

**Toast `self` object**

The `Toast` component receive `self` object via its `props`.

```javascript
self {
  data: Object,
  close: Function
}
```

#### Example using `nav` object

```javascript

import { nav } from 'react-navi'

import Popup_Loading from './popup/Popup_Loading'
import Toast_System from './toast/Toast_System'

nav.navigate('welcome', { data: {
  user: 'Awesome Dev'
}});

nav.popup(Popup_Loading, self => {
  setTimeout(() => {
    self.resolve('Loading Timeout 3 seconds');
  }, 3000);
});

nav.toast(Toast_System, { data: 'System message' }, self => {
  setTimeout(() => {
    self.close();
  }, 2000);
});

```

#### Injected `page` object

For each rendered `Page`, `Navigator` will inject a `page` object into `Page props`. This `page` object allow `Page` to setup event listeners and create page's `Popups`.

##### Page events

Following page event are supporting:

`load`

This event is fired when a `route` is active for the first time. When a `route` is active, it will be pushed into a `routeStack` manage internally by `Navigator`. When it is inactive, `Navigator` will `hide` its `page`. When it is active again, `Navigator` simply `unhide` its `page` and `load` event is not fired.

`beforeEnter`

This event is fired every time a `route` is going to active by a `navigate` API call.

`enter`

This event is fired every time a `route` is active and its `page` is shown up.

`leave`

This event is fired every time a `route` is going to `inactive` by a `navigate` API call.

These `event` can be registered via `page` object. Example below:

```javascript
class Page_Home extends Component {
  constructor(props) {
    super(props);
    props.page.onLoad(e => console.log('# Load Page'));
    props.page.onBeforeEnter(e => console.log('# Before Enter Page'));
    props.page.onEnter(e => console.log('# Enter Page'));
    props.page.onLeave(e => console.log('# Leave Page'));
  }
  render() {
    // render code...
  }
}
```

##### Create Popup

It is very useful to create a `popup` using `page` object, simple by calling `popup` API. The API is identical with `nav.popup`.

Note that `popup` created from a `page` will only exist in that `page`. `popup` created by `nav` object will exist in global.


**TODO:**
1. Animation for popup & page
1. Add Unit tests
1. Validate href not duplicated
1. Fix error: enter invalid route without fallbackRoute defined.
1. HOw redirect route use to redirect to  route with param?