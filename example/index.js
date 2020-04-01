"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Navigator from '../src/Navigator'

class Popup_Info extends Component {
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3 className = "w3-text-blue"> Info </h3>
        <p> Interesting information showing to user </p>
        <p>
          <button className="w3-button w3-blue" onClick={e => this.close()}> Close </button>
        </p>
      </div>
    )
  }
  close() {
    this.props.self.resolve('# --- Popup Info resolve by close button');
  }
}

class Popup_YesNo extends Component {
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3 className = "w3-text-blue"> Confirm </h3>
        <p> Do you wanna open Popup Info?</p>
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

class Popup_Loading extends Component {
  render() {
    return (
      <div className="w3-round w3-container" style={{ margin: 'auto', width: '300px', textAlign: 'center' }}>
        <p> <i className="fas fa-spinner w3-spin w3-xxxlarge w3-text-white" /> </p>
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
    this.props.page.popup(Popup_Loading, {overlay: true}, self => setTimeout(() =>self.resolve('# --- Popup Loading resolve by Timeout 3s'), 3000))
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }
  close() {
    this.props.self.resolve('# --- Popup Overlay resolve by close button');
  }
}

class Page_Home extends Component {
  render() {
    return (
      <div className = "w3-container">
        <h2 className = " w3-text-blue"> HOME </h2>
        <p className = "w3-text-grey"> Home page </p>
        <hr />
        <div className="w3-cell-row">
          <button className = "w3-cell w3-mobile w3-button w3-blue" style={{margin: '3px'}} onClick = {e => this.popupInfo()}> Popup Info </button>
          <button className = "w3-cell w3-mobile w3-button w3-blue" style={{margin: '3px'}} onClick = {e => this.popupYesNo()}> Popup YesNo </button>
          <button className = "w3-cell w3-mobile w3-button w3-blue" style={{margin: '3px'}} onClick = {e => this.popupLoading()}> Popup Loading </button>
          <button className = "w3-cell w3-mobile w3-button w3-blue" style={{margin: '3px'}} onClick = {e => this.popupMany()}> Popup Many </button>
          <button className = "w3-cell w3-mobile w3-button w3-blue" style={{margin: '3px'}} onClick = {e => this.popupOverlay()}> Popup Overlay </button>
        </div>
        <hr />
        <p>
          {/* <button className = "w3-button w3-green" onClick = {e => this.props.route.navigate('welcome')}> Move to page Welcome </button> */}
          <button className = "w3-button w3-green" onClick = {e => setTimeout(_ => this.props.route.navigate('welcome'),5000)}> Move to page Welcome </button>
        </p>
      </div>
    );
  }
  popupInfo() {
    this.props.page.popup(Popup_Info)
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
  popupYesNo() {
    this.props.page.popup(Popup_YesNo)
    .then(m => {
      console.log(m);
      return this.props.page.popup(Popup_Info);
    })
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
  popupLoading() {
    this.props.page.popup(Popup_Loading, self => {
      setTimeout(() => self.reject('# --- Popup Loading reject by Timeout 5s'), 5000);
    })
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
  popupMany() {
    this.props.page.popup(Popup_Info)
    .then(m => console.log(m))
    .catch(e => console.log(e));

    this.props.page.popup(Popup_YesNo)
    .then(m => {
      console.log(m);
      return this.props.page.popup(Popup_Info);
    })
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
  popupOverlay() {
    this.props.page.popup(Popup_Overlay)
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
}

class Page_Welcome extends Component {
  render() {
    return (
      <div className = "w3-container">
        <h2 className = " w3-text-green"> WELCOME </h2>
        <p className = "w3-text-grey"> Welcome page </p>
        <hr />
        <p>
          <button className = "w3-button w3-blue" onClick = {e => this.props.route.navigate('home')}> Move to page Home </button>
        </p>
      </div>
    );
  }
}

const routes = {
  home: { Page: Page_Home, href: '/'},
  welcome: { Page: Page_Welcome, href: '/welcome'}
};

class Demo extends Component {
  constructor(props) {
    super(props);
    this.route = null
  }
  render() {
    return (
      <div className="w3-container">
        <div className = "w3-bar w3-border-bottom w3-padding">
          <button className = "w3-bar-item w3-button w3-text-blue" onClick = {e => this.route.navigate('home')}> Home </button>
          <button className = "w3-bar-item w3-button w3-text-green" onClick = {e => this.route.navigate('welcome')}> Welcome </button>
        </div>
        <Navigator  routes = {routes}
                    initialRoute = 'home'
                    routeHandler = { routeHandler => this.route = routeHandler }
                    {...this.props}
        />
      </div>
    )
  }
}

render(<Demo />, document.getElementById('root'));
