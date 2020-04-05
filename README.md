# react-nav

Providing useful Navigator component, nav and page handler

## Installation

`npm install --save @realmjs/react-navi`

## Running example demo

`npm start`

Checkout example at `localhost:3000`

## Simple usage

First, create your `pages` and a `routes` object

```javascript
"use strict"

import React, { Component } from 'react'
import { Navigator } from 'react-navi'

class Page_Home extends Component {
  render() {
    return (
      <div>
        <h2> Home </h2>
      </div>
    );
  }
}

class Page_Error extends Component {
  render() {
    const data = this.props.page.data;
    return (
      <div>
        <h2> Error: {data && data.error || 'Unknown'} </h2>
        <p> {data && data.message || 'Unexpected unknown error has occured'} </p>
      </div>
    );
  }
}

const routes = {
  home: {
    Page: Page_Home,
    url: '/',
  },
  error404: {
    Page: Page_Error,
    url: '/error/404',
    data: {
      error: 404,
      message: 'Page not found'
    }
  }
}
```

Then, create `Navigator` component and register `routes` object to it.

```javascript
class Demo extends Component {
  render() {
    return (
      <div>
        <Navigator  routes = {routes}
                    initialRoute = 'home'
                    fallbackRoute = 'error404'
                    {...this.props}
        />
      </div>
    )
  }
}
```
Change your url to navigate page, note that it will redirect to `fallbackRoute` for all URLs not registered.

Props passing to `Navigator` (`{...props}` in the example) will be passed to `page` of `routes` as well

It is a simple usage. However, `Navigator` can do much more than that.

## Concept

### `Routes` object

A `route` object defines a `route` controlled by `Navigator`.

```javascript
route {
  Page: React.Component, // A React component used to render your Page
  url: String,          // path of url for this route, does NOT include hostname
  data: Object         // data you can access from your Page via this.props.page.data
}
```
`Page` is the React component (not React Element) you design for `route`.

`url` is the path of `route`. If your app does not need url, you can ommit it and set prop `noUrl = {true}` in `Navigator`

`data` is the data you want to pass into the rendered Page element of this `route`. For example, you design Page_Error component for show error message, then you define route error404 and error401 using that same Page_Error but different data

```javascript
const routes = {
  error404: {
    Page: Page_Error,
    url: '/error/404',
    data: {
      error: 404,
      message: Resource not found
    }
  },
  error401: {
    Page: Page_Error,
    url: '/error/401',
    data: {
      error: 401,
      message: Unauthenticated
    }
  }
};
```
`routes` object is a collection, in a form on object, of `route`. Each `route` has a `name` in `routes` object that you can later navigate to it just by calling `nav.navigate('name')`.

The main concept of `react-navi` is for every `routes` controlled by `Navigator`,

#### `route` redirect to another `route`

You can define a `route` which will redirect to `another route`.

```javascript
const routes = {
  home: {
    url: '/',
    Page: Page_Home
  },
  landing: {
    'url': '/landing',
    redirect: 'home'
  }
};
```

### `Navigator` Component

`Navigator` component controls all routes registered to it. Each time user navigate to a route (by calling API or change url in address bar), it will render and display `Page` component of that `route`.

For each rendered `Page`, `Navigator` will inject `route` object and `page` object into `props`. Please see them in detail in the later part.

Note that there is only one `Navigator` for entire application.

#### `Navigator` Component Properties:

`routes` - `Object`: Routes object to be registered into `Navigator`

`initialRoute` - `String`: `name` of the `route` that will be active at initial if `noUrl` is `true`

`fallbackRoute` - `String`: `name` of the `route` that `Navigator` will redirect to if the `url` does not match any `route` in `registered routes`. It is ignored if `noUrl` is `false`. Note that navigate to an unregistered route by `navigate API` will not redirect to `fallbackRoute`, but `reject` with an error.

`routeHandler` - `Function`: The function will be called when creating `navigator`, with `routeHandler` in the argument. `routeHanler` can be used to call `navigate` API.

```javascript
// example of using routeHandler
...
render() {
  return (
    <Navigator routes = {routes}
               routeHandler = { routeHandler => this.route = routeHandler }
               {...this.props}
    />
  )
}
...
navigateToHome() {
  this.route.navigate('home);
}
...
```
Though it may be useful if you want to call `navigate` API from the Component that use `Navigator`. It is not the only way for doing it. You can use `nav` object to call `navigate` API from anywhere in your application.

`noUrl` - `Boolean`: default is `false`, define whether your application use url or not. If set to `true`, `route` object will require `url`, navigate to a `route` will update `url` in address bar and you can also navigate by typing `url`.

#### Injected `route` object

For each rendered `Page`, `Navigator` will inject a `route` object into `Page props`. This `route` object allow `Page` to navigate to another route by simply calling `navigate` API.

##### `navigate` API

**`navigate (name, options)`**

`name` - `String`: name of route navigate to

`options` - `Object`: optional

* `data` - `Object`: `data` passing to `Page` of `route`. It will override to `data` defined by `route` object if any. It is recommended to define `data` in `route` instead of passing via `navigate` API.

* `noUpdateUrl` - `Boolean`: defalt is `false`, set to `true` will not update url

* `reload` - `Boolean`: default is `false`, set to `true` will cause a `webpage reload` when navigating.

This function return a `promise`

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

It is very useful to create a `popup` using `page` object, simple by calling `popup` API

**`popup(PopupComponent, options, callback)`**

* `PopupComponent` - `React Component`: A React Component design the popup

* `options` - `Object`: optional
  * `data` - `Object`: `data` passed to `Popup` via `self` object
  * `overlay` - `Boolean`: default `false`, set to `true` will create `popup` in an overlay layer

* `callback` - `Function`: optional, a callback provide `self` object to `resolve` or `reject` popup.

This function return a `promise` that `resolve` or `reject` by the `popup` via `self` object

**Popup `self` object**

The `Popup` component receive `self` object via its `props`.

```javascript
self {
  data: Object,
  resolve: Function,
  reject: Function
}
```
Example

```javascript
class Popup_YesNo extends Component {
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3 className = "w3-text-blue"> Popup YesNo </h3>
        <p> Click Yes to resolve, click No to reject</p>
        <p>
          <button className="w3-button w3-blue" onClick={e => this.yes()}> Yes </button>
          {' '}
          <button className="w3-button" onClick={e => this.no()}> No </button>
        </p>
      </div>
    )
  }
  yes() {
    this.props.self.resolve('# --- Popup YesNo resolve by Yes button');
  }
  no() {
    this.props.self.reject('# --- Popup YesNo reject by No button');
  }
}
class Page_DemoPopup extends Component {
  render() {
    <div>
      <button className="W3-button w3-blue" onClick={e => this.popup()}>
    </div>
  }
  popup() {
    this.props.page.popup(Popup_YesNo)
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
}
```

In addition, `popup` also receive `page` object from `Page`, so it can call another `popup`.

```javascript
class Popup_Loading extends Component {
  render() {
    const color = this.props.self.data.color || 'white';
    return (
      <div className="w3-round w3-container" style={{ margin: 'auto', width: '300px', textAlign: 'center' }}>
        <p> <i className={`fas fa-spinner w3-spin w3-xxxlarge w3-text-${color}`} /> </p>
      </div>
    )
  }
}
class Popup_Overlay extends Component {
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3 className = "w3-text-blue"> Overlay Popup Demo </h3>
        <p> Click Load buuton to show Popup Loading overlaying </p>
        <p>
          <button className="w3-button w3-blue" onClick={e => this.load()}> Load </button>
          {' '}
          <button className="w3-button" onClick={e => this.close()}> Close </button>
        </p>
      </div>
    )
  }
  load() {
    this.props.page.popup(Popup_Loading, {overlay: true, data: {color: 'red'}}, self => setTimeout(() =>self.resolve('# --- Popup Loading resolve by Timeout 3s'), 3000))
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }
  close() {
    this.props.self.resolve('# --- Popup Overlay resolve by close button');
  }
}
```

Note that `popup` created from a `page` will only exist in that `page`. Except `popup` created by `nav` object will exist in global.

### Global `nav` Object

Using global `nav` object to navigate using `navigate API`, create `global popup` or create `toast` from anywhere in your application

for `navigate` and `popup`, the API is identical with above

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

**TODO:**
1. Animation for popup
1. Add Unit tests