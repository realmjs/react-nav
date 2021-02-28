"use strict"

import React, { Component } from 'react'

import nav from './nav'
import Href from './href'
import { capitalize, isFunction, isSameRoute, createRouteUid } from './util'
import animation from './animation'
import { appendStyle } from './style'

const href = new Href();

class Page extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fire('load');
    if (this.props.active) {
      this.props.fire('enter');
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.active && !prevProps.active) {
      this.props.fire('enter');
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
      <div className="rjs-react-nav-modal" style={{display: this.props.show? 'block' : 'none'}}>
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
    const anim = this.props.bottom ? animation('float-bottom', '0.4s') : animation('float-top', '0.4s')
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
   * @param {Object} initialRoute - The initial routes of the Navigator
   * @param {Function} routeHandler - FUnction return route handler
   * @param {Object} animation
   */
  constructor(props) {
    super(props);

    this.__validateProps(props);

    this.state = {
      routeStack : [],
      activeRouteName: this.__findInitialRouteName(),
      showPopup: {},
      toasts: { top: [], bottom: [] },
    };

    this.__supportedPageEvents = ['load', 'beforeEnter', 'enter', 'leave', 'unload'];
    this.__events = {};

    this.__registeredRoutes = {};
    this.__registerRoutes({...props.routes});

    this.__popupStack = {};

    this.__global = { popup: (PopupComponent, options, cb) => this.__createPopup('__global', PopupComponent, options, cb) };

    // update url missmatch between route and url
    const route = this.__registeredRoutes[this.state.activeRouteName];
    if (!props.noUrl && route && !href.matchUrlPath(route.url)) {
      href.push(route.url);
    }

    this.nav = {
      navigate: this.navigate.bind(this),
    };
    props.routeHandler && props.routeHandler(this.nav);

    this.__createInjectPage = this.__createInjectPage.bind(this);
    this.__fire = this.__fire.bind(this);
    this.__createPopup = this.__createPopup.bind(this);
    this.onPopState = this.onPopState.bind(this);

    appendStyle();

    nav.register(this);

    window.addEventListener('popstate', this.onPopState);

  }

  onPopState() {
    const url = '/' + href.getPathName();
    const routeStack = [...this.state.routeStack];
    const index = routeStack.findIndex(route => route.url === url);
    if (index !== -1) {
      const route = routeStack.slice(index, index + 1)[0];
      routeStack.splice(index, 1);
      routeStack.unshift(route);
      this.__fire(routeStack[1].name, routeStack[1].uid, 'leave');
      this.__fire(routeStack[0].name, routeStack[0].uid, 'beforeEnter');
      this.setState({ routeStack });
    }
  }

  componentDidMount() {
    this.__initRouteStack().then(routeStack => {
      const activeRouteName = routeStack[0].name;
      this.setState({ routeStack, activeRouteName });
    });
  }

  componentWillUnmount() {
    nav.destroy();
    this.props.routeHandler && this.props.routeHandler(null);
    window.removeEventListener('popstate', this.onPopState);
  }

  render() {
    return (
      <div>
        {
          this.state.routeStack.map((route, index) => {
            const {name, url, page, data, params, uid} = route;
            const display = index === 0 ? 'block' : 'none';
            const passingRouteObj = {
              url,
              data,
              params,
            };
            const PageComponent = this.__registeredRoutes[name].Page;
            return (
              <div key = {uid} style={{ display }}>
                {/* Page */}
                <Page fire = { e => this.__fire(name, uid, e) } active = {index === 0} >
                  {
                    React.createElement(PageComponent, { route: passingRouteObj, nav: this.nav, page, ...this.props })
                  }
                </Page>
                {/* Popup */}
                <Popup  show = {this.state.showPopup[name]} >
                  {
                    this.__popupStack[name] && this.__popupStack[name].map( (popup, index) => {
                      if (popup.self.overlay) {
                        return (
                          <div key={index} className="rjs-react-nav-modal" style={{display: 'block'}}>
                             { React.createElement(popup.Popup, { self: popup.self, ...this.props, page }) }
                          </div>
                        )
                      } else {
                        return (
                          <div key={index} className="rjs-react-nav-model-content">
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
                  <div key={index} className="rjs-react-nav-modal" style={{display: 'block'}}>
                      { React.createElement(popup.Popup, { self: popup.self, ...this.props, page: this.__global }) }
                  </div>
                )
              } else {
                return (
                  <div key={index} className="rjs-react-nav-model-content">
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
                <div key = {index} className="rjs-react-nav-card-4" style = {style}>
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
    if (this.props.initialRoute && !this.props.routes[this.props.initialRoute]) {
      throw new Error(`Error: Validate props failed: 'initialRoute' is not listed in 'routes'`);
    }
    if (!this.props.noUrl && !this.props.fallbackRoute) {
      console.warn("Warning: Validate props: Missing 'fallbackRoute'!");
    }
    if (this.props.fallbackRoute && !this.props.routes[this.props.fallbackRoute]) {
      throw new Error(`Error: Validate props failed: 'fallbackRoute' is not listed in 'routes'`);
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

  __findInitialRouteName() {
    if (this.props.noUrl) {
        return this.props.initialRoute;
    }
    return this.__findRouteNameFromURL() || this.props.fallbackRoute;
  }

  __findRouteNameFromURL() {
    if (this.props.noUrl) {
      return undefined;
    }
    for (let name in this.props.routes) {
      const route = this.props.routes[name];
      if (route.url && href.matchUrlPath(route.url)) {
        return route.redirect || name;
      }
    }
    return undefined;
  }

  __initRouteStack() {
    return new Promise((resolve, reject) => {
      this.__createInitRoute()
          .then(route => {
            const routeStack = this.__loadRouteStackFromSessionStorage().filter( _route => !isSameRoute(_route, route.name, route.params));
            routeStack.unshift(route);
            resolve(routeStack);
          })
          .catch(err => reject(err));
    });
  }

  __createInitRoute() {
    return new Promise((resolve, reject) => {
      const initRouteName = this.__findInitialRouteName();
      const initRoute = this.props.routes[initRouteName];
      const params = this.props.noUrl ? undefined : href.extractUrlParams(initRoute.url);
      const url = href.buildUrlPath(initRoute.url, params);
      const uid = createRouteUid(initRouteName, params);
      const page = this.__createInjectPage(initRouteName, uid);
      if (isFunction(initRoute.data)) {
        initRoute.data({ params, props: this.props })
                  .then(data => {
                    resolve({name:initRouteName, url, page, params, data, uid})
                  })
                  .catch(err => reject(err));
      } else {
        resolve({name:initRouteName, url, page, params, data: initRoute.data, uid});
      }
    });
  }

  __registerRoutes(routes) {
    this.__validateRoutes(routes);
    for (let name in routes) {
      const route = routes[name];
      this.__registeredRoutes[name] = route;
    }
    this.__bindPageEvent(routes);
  }

  __createInjectPage(name, uid, options) {
    const page = {
      on: (event, handler) => {
        if (this.__supportedPageEvents.indexOf(event) !== -1) {
          this.__events[name][event].push({ uid, handler });
        }
      },
      popup: (PopupComponent, options, cb) => this.__createPopup(name, PopupComponent, options, cb),
      deleteAllPopups: () => this.__deleteAllPopups(name),
      data: options && options.data || undefined,
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

  __fire(route, uid, event) {
    if (this.__events[route][event]) {
      this.__events[route][event].forEach( e => e.uid === uid && e.handler() );
    } else {
      console.error(`event ${event} is not supported`)
    }
  }

  navigate(name, options) {
    return new Promise( (resolve, reject) => {

      if (!this.__registeredRoutes[name]) {
        reject(`Route ${name} is not registered!`);
        return;
      }

      const params = options && options.params || {};

      if (isSameRoute(this.state.routeStack[0], name, params)) {
        resolve();
        return
      }

      if (isFunction(this.__registeredRoutes[name].data)) {
        return this.__registeredRoutes[name].data({ params: options && options.params || undefined, props: this.props })
                                            .then(changeRoute.bind(this))
                                            .catch(err => reject(err));
      } else {
        return changeRoute.bind(this)();
      }

      function changeRoute(routeData) {
        return new Promise((resolve) => {
          if(this.__registeredRoutes[name].redirect) {
            name = this.__registeredRoutes[name].redirect;
          }

          this.__fire(this.state.activeRouteName, this.state.routeStack[0].uid, 'leave');

          const routeStack = [...this.state.routeStack].filter( route =>  !isSameRoute(route, name, params) );
          const url = href.buildUrlPath(this.__registeredRoutes[name].url, params);
          const uid = createRouteUid(name, params);
          const page = this.__createInjectPage(name, uid, options);
          routeStack.unshift({ name, url, page, data: routeData, params, uid });


          const activeRouteName = name;
          this.__fire(activeRouteName, uid, 'beforeEnter');
          this.setState({ routeStack, activeRouteName });
          if ( this.props.noUrl || (options && options.noUpdateUrl) || !this.__registeredRoutes[name].url) {
            resolve();
            return
          }

          if (options && options.reload) {
            href.set(url);
          } else {
            href.push(url);
          }

          this.__saveRouteStackToSessionStorage();

          resolve();
        });
      }

    });
  }

  __createPopup(scope, PopupComponent, options, cb) {
    return new Promise((resolve, reject) => {
      let self = {};
      if (isFunction(options)) {
        cb = options;
      } else {
        self = { ...options };
      }
      self.resolve = (data) => this.__popupResolve(scope, data, self);
      self.reject = (error) => this.__popupReject(scope, error, self);
      if (!this.__popupStack[scope]) {
        this.__popupStack[scope] = [];
      }
      this.__popupStack[scope].push({ Popup: PopupComponent, self, resolve, reject });
      const showPopup = {...this.state.showPopup};
      showPopup[scope] = true;
      this.setState({ showPopup });
      cb && cb({ resolve: self.resolve, reject: self.reject });
    });
  }

  __popupResolve(scope, data, self) {
    if (this.__popupStack[scope] && this.__popupStack[scope].length > 0) {
      const index =  this.__popupStack[scope].findIndex( p => p.self === self);
      if (index === -1) { return; }
      const { resolve } = this.__popupStack[scope].splice(index, 1)[0];
      const showPopup = {...this.state.showPopup};
      showPopup[scope] = this.__popupStack[scope].length == 0 ? false : true;
      this.setState({ showPopup });
      resolve && resolve(data);
    }
  }

  __popupReject(scope, error, self) {
    if (this.__popupStack[scope] && this.__popupStack[scope].length > 0) {
      const index =  this.__popupStack[scope].findIndex( p => p.self === self);
      if (index === -1) { return; }
      const { reject } = this.__popupStack[scope].splice(index, 1)[0];
      const showPopup = {...this.state.showPopup};
      showPopup[scope] = this.__popupStack[scope].length == 0 ? false : true;
      this.setState({ showPopup });
      reject && reject(error);
    }
  }

  __deleteAllPopups(scope) {
    if (this.__popupStack[scope] && this.__popupStack[scope].length > 0) {
      delete this.__popupStack[scope];
      const showPopup = {...this.state.showPopup};
      showPopup[scope] = false;
      this.setState({ showPopup });
    }
  }

  __createToast(ToastComponent, options, cb) {
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
      bottom.unshift({Toast: ToastComponent, self });
    } else {
      top.unshift({Toast: ToastComponent, self });
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

  __saveRouteStackToSessionStorage() {
    const routeStack = this.state.routeStack.map(route => {
      return {
        name: route.name,
        url: route.url,
        data: route.data,
        params: route.params,
        uid: route.uid,
        pageData: route.page.data || undefined,
      }
    });
    sessionStorage.setItem("__routestack_", JSON.stringify(routeStack));
  }

  __loadRouteStackFromSessionStorage() {
    const routeStack = JSON.parse(sessionStorage.getItem("__routestack_")) || [];
    routeStack.forEach(route => {
      route.page = this.__createInjectPage(route.name, route.uid, { data: route.pageData });
      delete route.pageData;
    });
    return routeStack;
  }

}

Navigator.__rjsWidgetType = 'navigator';
export default Navigator;
