"use strict"

import React, { Component } from 'react'

import nav from './nav'
import Href from './href'
import { capitalize } from './util'
import animation from './animation'

const href = new Href();

class Page extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fire('load')
    if (this.props.active) {
      this.props.fire('enter')
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.active && !prevProps.active) {
      this.props.fire('enter')
    }
  }
  render() {
    return this.props.children
  }
}

class Popup extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="w3-modal" style={{display: this.props.show? 'block' : 'none'}}>
        {this.props.children}
      </div>
    )
  }
}

class Toast extends Component {
  render() {
    const style = {
      display: this.props.show? 'block' : 'none',
      position: 'fixed',
      width: '100%',
      left: 0,
      opacity: this.props.opacity || 0.9
    }
    if (this.props.bottom) {
      style.bottom = 0;
    } else {
      style.top = 0;
    }
    const anim = this.props.bottom ? animation('slide-bottom', '0.4s') : animation('slide-top', '0.4s')
    return (
      <div style = {{ ...style, ...anim}}>
        <div style = {{position: 'relative'}}>
        { this.props.children }
        </div>
      </div>
    )
  }
}

/**
 * Navigator component
 * @extends Component
 * */
class Navigator extends Component {
  /**
   * Navigator component that render Page for each Route
   * @param {Array} routes - Object of routes thata are registered
   * @param {Array} initialRouteStack - Array contains the initial routes from the Navigator
   * @param {Object} initialRoute - The initial routes of the Navigator
   * @param {Function} routeHandler - FUnction return route handler
   * @param {Object} animation
   */
  constructor(props) {
    super(props);

    this.__validateProps(props);

    this.state = {
      routeStack : this.__initRouteStack(),
      activeRoute: this.__findInitialRoute(),
      showPopup: {},
      toasts: { top: [], bottom: [] },
    };

    this.__supportedPageEvents = ['load', 'beforeEnter', 'enter', 'leave'];
    this.__events = {};

    this.__registeredRoutes = {};
    this.__registerRoutes({...props.routes});

    this.__popupStack = {};

    this.__global = { popup: (popup, options, cb) => this.__createPopup('__global', popup, options, cb) };

    // update url missmatch between route and url
    const __path = href.getPathName();
    const route = this.__registeredRoutes[this.state.activeRoute];
    if (route && route.url.replace(/\//g,'').toLowerCase() !== __path.toLowerCase()) {
      href.push(route.url);
    }

    this.route = {
      navigate: this.navigate.bind(this)
    };
    props.routeHandler && props.routeHandler(this.route);

    this.__createInjectPage = this.__createInjectPage.bind(this);
    this.__fire = this.__fire.bind(this);
    this.__createPopup = this.__createPopup.bind(this);

    nav.register(this);

  }

  componentWillUnmount() {
    // clean up to avoid memory leak
    nav.destroy();
    this.props.routeHandler && this.props.routeHandler(null);
  }

  render() {
    return (
      <div>
        {
          this.state.routeStack.map((name, index) => {
            const route = this.__registeredRoutes[name] || this.props.fallingRoute || null;
            const display = this.state.activeRoute === name ? 'block' : 'none';
            const page = this.__createInjectPage(name);
            return (
              <div key = {index} style={{ display }}>
                {/* Page */}
                <Page fire = { e => this.__fire(name, e) } active = {this.state.activeRoute === name} >
                  { React.createElement(route.Page, { route: this.route, page, ...this.props }) }
                </Page>
                {/* Popup */}
                <Popup  show = {this.state.showPopup[name]} >
                  {
                    this.__popupStack[name] && this.__popupStack[name].map( (popup, index) => {
                      if (popup.self.overlay) {
                        return (
                          <div key={index} className="w3-modal" style={{display: 'block'}}>
                             { React.createElement(popup.Popup, { self: popup.self, ...this.props, page }) }
                          </div>
                        )
                      } else {
                        return (
                          <div key={index} className="w3-model-content">
                            { React.createElement(popup.Popup, { self: popup.self, ...this.props, page }) }
                          </div>
                        )
                      }
                    })
                  }
                </Popup>
              </div>
            )
          })
        }
        {/* Global Popup */}
        <Popup  show = {this.state.showPopup.__global} >
          {
            this.__popupStack.__global && this.__popupStack.__global.map( (popup, index) => {
              if (popup.self.overlay) {
                return (
                  <div key={index} className="w3-modal" style={{display: 'block'}}>
                      { React.createElement(popup.Popup, { self: popup.self, ...this.props, page: this.__global }) }
                  </div>
                )
              } else {
                return (
                  <div key={index} className="w3-model-content">
                    { React.createElement(popup.Popup, { self: popup.self, ...this.props, page: this.__global }) }
                  </div>
                )
              }
            })
          }
        </Popup>
        {/* Toasts */}
        <Toast show = {this.state.toasts.top.length > 0} top = {true} >
          {
            this.state.toasts.top.map((toast, index) => {
              const style = toast.animateClosing ? animation('fade-out', toast.animateClosing) : {};
              return (
                <div key = {index} style = {style}>
                  { React.createElement(toast.Toast, { self: toast.self }) }
                </div>
              )
            })
          }
        </Toast>
        <Toast show = {this.state.toasts.bottom.length > 0} bottom = {true} >
          {
            this.state.toasts.bottom.map((toast, index) => {
              const style = toast.animateClosing ? animation('fade-out', toast.animateClosing) : {};
              return (
                <div key = {index} className="w3-card-4" style = {style}>
                  { React.createElement(toast.Toast, { self: toast.self }) }
                </div>
              )
            })
          }
        </Toast>
      </div>
    );
  }

  __validateProps(props) {
    if (this.props.noUrl && !this.props.initialRoute) {
      throw new Error(`Error: Validate props failed: 'initialRoute' is required when 'noUrl' set to true`);
    }
    if (!this.props.routes[this.props.initialRoute]) {
      throw new Error(`Error: Validate props failed: 'initialRoute' is not listed in 'routes'`);
    }
    if (!this.props.noUrl && !this.props.fallbackRoute) {
      console.warn("Warning: Validate props: Missing 'fallbackRoute'!")
    }
  }

  __validateRoutes(routes) {
    for (let name in routes) {
      const route = routes[name];
      if (!route.redirect && !route.Page) {
        throw new Error(`Invalid route object: missing 'Page' in route '${name}'`);
      }
      if (!this.props.noUrl && !route.url) {
        throw new Error(`Invalid route object: missing 'url' in route '${name}'`);
      }
    }
  }

  __findInitialRoute() {
    if (this.props.noUrl) {
        return this.props.initialRoute;
    }
    return this.__findRouteNameFromURL() || this.props.fallbackRoute;
  }

  __findRouteNameFromURL() {
    if (this.props.noUrl) {
      return undefined;
    }
    const __path = href.getPathName();
    for (let name in this.props.routes) {
      const route = this.props.routes[name];
      if (route.url && route.url.replace(/\//g,'').toLowerCase() === __path.toLowerCase()) {
        return route.redirect || name;
      }
    }
    return undefined;
  }

  __initRouteStack() {
    const initRoute = this.__findInitialRoute();
    if (this.props.initialRouteStack) {
      return [...this.props.initialRouteStack, initRoute].filter(e => e !== undefined);
    } else {
      return [initRoute].filter(e => e !== undefined);
    }
  }

  __registerRoutes(routes) {
    this.__validateRoutes(routes);
    for (let name in routes) {
      this.__registeredRoutes[name] = routes[name];
    }
    this.__bindPageEvent(routes);
  }

  __createInjectPage(name) {
    const page = {
      on: (event, handler) => {
        if (this.__supportedPageEvents.indexOf(event) !== -1) {
          this.__events[name][event].push(handler);
        }
      },
      popup: (popup, options, cb) => this.__createPopup(name, popup, options, cb),
    }
    this.__supportedPageEvents.forEach( e => page[`on${capitalize(e)}`] = handler => page.on(e, handler) );
    return page;
  }

  __bindPageEvent(routes) {
    for (let name in routes) {
      this.__events[name] = {};
      this.__supportedPageEvents.forEach( e => this.__events[name][e] = [] );
    }
  }

  __fire(route, event) {
    if (this.__events[route][event]) {
      this.__events[route][event].forEach( handler => handler() );
    } else {
      console.error(`event ${event} is not supported`)
    }
  }

  navigate(name, options) {
    return new Promise( (resolve, reject) => {
      if (name === this.state.activeRoute) {
        resolve();
        return
      }
      if (!this.__registeredRoutes[name]) {
        reject(`Route ${name} is not registered!`);
        return;
      }
      if(this.__registeredRoutes[name].redirect) {
        name = this.__registeredRoutes[name].redirect;
      }
      const activeRoute = name;
      const routeStack = [...this.state.routeStack];
      if (routeStack.indexOf(name) === -1) {
        routeStack.push(name);
      }
      this.__fire(this.state.activeRoute, 'leave');
      this.__fire(activeRoute, 'beforeEnter');
      this.setState({ routeStack, activeRoute });
      if ( this.props.noUrl || (options && options.noUpdateUrl) || !this.__registeredRoutes[name].url) {
        resolve();
        return
      }
      if (options && options.reload) {
        href.set(this.__registeredRoutes[name].url);
      } else {
        href.push(this.__registeredRoutes[name].url);
      }
      resolve();
    });
  }

  __createPopup(name, popup, options, cb) {
    return new Promise((resolve, reject) => {
      let self = {};
      if (Object.prototype.toString.call(options) == '[object Function]') {
        cb = options;
      } else {
        self = { ...options };
      }
      self.resolve = (data) => this.__popupResolve(name, data, self);
      self.reject = (error) => this.__popupReject(name, error, self);
      if (!this.__popupStack[name]) {
        this.__popupStack[name] = [];
      }
      this.__popupStack[name].push({ Popup: popup, self, resolve, reject });
      const showPopup = {...this.state.showPopup};
      showPopup[name] = true;
      this.setState({ showPopup });
      cb && cb({ resolve: self.resolve, reject: self.reject });
    });
  }

  __popupResolve(name, data, self) {
    if (this.__popupStack[name] && this.__popupStack[name].length > 0) {
      const index =  this.__popupStack[name].findIndex( p => p.self === self);
      if (index === -1) { return; }
      const { resolve } = this.__popupStack[name].splice(index, 1)[0];
      const showPopup = {...this.state.showPopup};
      showPopup[name] = this.__popupStack[name].length == 0 ? false : true;
      this.setState({ showPopup });
      resolve && resolve(data);
    }
  }

  __popupReject(name, error, self) {
    if (this.__popupStack[name] && this.__popupStack[name].length > 0) {
      const index =  this.__popupStack[name].findIndex( p => p.self === self);
      if (index === -1) { return; }
      const { reject } = this.__popupStack[name].splice(index, 1)[0];
      const showPopup = {...this.state.showPopup};
      showPopup[name] = this.__popupStack[name].length == 0 ? false : true;
      this.setState({ showPopup });
      reject && reject(error);
    }
  }

  __createToast(toast, options, cb) {
    let self = {};
    if (Object.prototype.toString.call(options) == '[object Function]') {
      cb = options;
    } else {
      self = { ...options };
    }
    self.close = () => this.__animateCloseToast(self, options && options.bottom? 'bottom' : 'top')
    const top = [...this.state.toasts.top];
    const bottom = [...this.state.toasts.bottom];
    if (options && options.bottom) {
      bottom.unshift({Toast: toast, self });
    } else {
      top.unshift({Toast: toast, self });
    }
    const toasts = { top, bottom };
    this.setState({ toasts });
    cb && cb(self);
  }

  __animateCloseToast(self, position) {
    if (position.toLowerCase() !== 'top' && position.toLowerCase() !== 'bottom') {
      throw new Error('Invalid toast position, it must be either top or bottom');
    }
    if ( this.state.toasts[position.toLowerCase()].length > 1) {  // animation only if there is 1 toast left
      this.__closeToast(self, position);
      return
    }
    const toasts = {
      top: [...this.state.toasts.top],
      bottom: [...this.state.toasts.bottom],
    };
    toasts[position.toLowerCase()] = this.state.toasts[position.toLowerCase()].map(toast => {
      if (toast.self === self) {
        return {
          Toast: toast.Toast,
          self,
          animateClosing: '0.4s',
        };
      } else {
        return toast;
      }
    });
    this.setState({ toasts });
    setTimeout(() => {
      this.__closeToast(self, position);
    }, 400);
  }

  __closeToast(self, position) {
    const toasts = {
      top: [...this.state.toasts.top],
      bottom: [...this.state.toasts.bottom],
    };
    const index =  toasts[position.toLowerCase()].findIndex(p => p.self === self);
    if (index === -1) { return; }
    toasts[position.toLowerCase()].splice(index, 1);
    this.setState({ toasts });
  }

}

Navigator.__rjsWidgetType = 'navigator';
export default Navigator;
