"use strict"

import React, { Component } from 'react'

import { capitalize } from './util'

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

    this.state = {
      routeStack : props.initialRouteStack || [props.initialRoute] || [],
      activeRoute: props.initialRoute || null,
      showPopup: {},
    };

    this.route = {
      navigate: this.navigate.bind(this)
    };
    props.routeHandler && props.routeHandler(this.route);

    this.__registeredRoutes = {...props.routes};

    this.__supportedPageEvents = ['load', 'beforeEnter', 'enter', 'leave'];
    this.__events = {};
    for (let name in this.__registeredRoutes) {
      this.__events[name] = {};
      this.__supportedPageEvents.forEach( e => this.__events[name][e] = [] );
    }

    this.__popupStack = {};

    this.__createInjectPage = this.__createInjectPage.bind(this);
    this.__fire = this.__fire.bind(this);
    this.__createPopup = this.__createPopup.bind(this);

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
                <Popup  show = {this.state.showPopup[name]}
                        options = {this.__popupStack[name] && this.__popupStack[name].options}
                        popup = {page.popup}
                >
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
      </div>
    );
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

  __fire(route, event) {
    if (this.__events[route][event]) {
      this.__events[route][event].forEach( handler => handler() );
    } else {
      console.error(`event ${event} is not supported`)
    }
  }

  navigate(name) {
    if (name === this.state.activeRoute) { return; }
    if (!this.__registeredRoutes[name]) {
      console.error(`Route ${name} is not registered!`);
      return;
    }
    const activeRoute = name;
    const routeStack = [...this.state.routeStack];
    if (routeStack.indexOf(name) === -1) {
      routeStack.push(name);
    }
    this.__fire(this.state.activeRoute, 'leave');
    this.__fire(activeRoute, 'beforeEnter');
    this.setState({ routeStack, activeRoute })
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
    })
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

}

Navigator.__rjsWidgetType = 'navigator';
export default Navigator;
