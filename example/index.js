"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Navigator from '../src/Navigator'
import nav from '../src/nav'

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
    const color = this.props.self.color || 'white';
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
    this.props.page.popup(Popup_Loading, {overlay: true, color: 'red'}, self => setTimeout(() =>self.resolve('# --- Popup Loading resolve by Timeout 3s'), 3000))
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }
  close() {
    this.props.self.resolve('# --- Popup Overlay resolve by close button');
  }
}

class Popup_GetInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3 className = "w3-text-blue"> Get Input </h3>
        <p> Type to the box below </p>
        <p>
          <input className="w3-input" type="text" value = {this.state.value} onChange = {this.handleInput.bind(this)} />
        </p>
        <p>
          <button className="w3-button w3-blue" onClick={e => this.confirm()}> OK </button>
          {' '}
          <button className="w3-button w3-blue" onClick={e => this.cancel()}> Cancel </button>
        </p>
      </div>
    )
  }
  handleInput(e) {
    const value = e.target.value;
    this.setState({ value });
  }
  confirm() {
    this.props.self.resolve(this.state.value);
  }
  cancel() {
    this.props.self.reject();
  }
}

class Toast_Success extends Component {
  render() {
    return (
      <div className = "w3-container w3-green">
        <p className="w3-small"> Operation success!
          <span className="cursor-pointer w3-right" onClick={e => this.props.self.close()}> &times; </span>
        </p>
      </div>
    )
  }
}
class Toast_Failure extends Component {
  render() {
    return (
      <div className = "w3-container w3-red">
        <p className="w3-small"> Operation failed!
          <span className="cursor-pointer w3-right" onClick={e => this.props.self.close()}> &times; </span>
        </p>
      </div>
    )
  }
}
class Toast_Info extends Component {
  render() {
    return (
      <div className = "w3-container w3-blue">
        <p className="w3-small"> Annoucement!
          <span className="cursor-pointer w3-right" onClick={e => this.props.self.close()}> &times; </span>
        </p>
      </div>
    )
  }
}
class Toast_System extends Component {
  render() {
    return (
      <div className = "w3-container w3-black">
        <p className="w3-small"> System message!
          <span className="cursor-pointer w3-right" onClick={e => this.props.self.close()}> &times; </span>
        </p>
      </div>
    )
  }
}

class Page_Home extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    props.page.onLoad(e => console.log('# Load Page Home'));
    props.page.onBeforeEnter(e => console.log('# Before Enter Page Home'));
    props.page.onEnter(e => { console.log('# Enter Page Home'); this.setState({ count: 2 }) });
    props.page.onLeave(e => console.log('# Leave Page Home'));
  }
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
        <div className="w3-cell-row">
          <button className = "w3-cell w3-mobile w3-button w3-green" style={{margin: '3px'}} onClick = {e => nav.toast(Toast_Success)} >Toast Success </button>
          <button className = "w3-cell w3-mobile w3-button w3-red" style={{margin: '3px'}} onClick = {e => nav.toast(Toast_Failure)} >Toast Failure </button>
          <button className = "w3-cell w3-mobile w3-button w3-blue" style={{margin: '3px'}} onClick = {e => nav.toast(Toast_Info, {bottom: true})} >Toast Info </button>
          <button className = "w3-cell w3-mobile w3-button w3-black" style={{margin: '3px'}} onClick = {e => nav.toast(Toast_System, {bottom: true}, self => setTimeout(() => self.close(),2000))} >Toast System </button>
        </div>
        <hr />
        <p>
          <button className = "w3-button w3-green" onClick = {e => this.navigate()}> Move to page Welcome Foo (after {this.state.count}s) </button>
        </p>
        <p>
          <button className = "w3-button w3-green" onClick = {e => nav.navigate('testmain')}> Move to Test Page Replace</button>
        </p>
        <p>
          <button className = "w3-button w3-green" onClick = {e => nav.navigate('data', {data: { msg: '--/ Page Data /--'}})}> Move to Page Data</button>
        </p>
      </div>
    );
  }
  navigate() {
    const t = setInterval( _ => {
      if (this.state.count === 0) {
        clearInterval(t);
        this.props.nav && this.props.nav.navigate('welcome', {params: {user: 'Foo'}});
        return;
      }
      this.setState({ count: this.state.count - 1 });
    }, 1000);
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
  constructor(props) {
    super(props);
    props.page.onLoad(e => console.log('# Load Page Welcome'));
    props.page.onBeforeEnter(e => console.log('# Before Enter Page Welcome'));
    props.page.onEnter(e => console.log('# Enter Page Welcome'));
    props.page.onLeave(e => console.log('# Leave Page Welcome'));
  }
  render() {
    const params = this.props.route.params;
    return (
      <div className = "w3-container">
        <h2 className = " w3-text-green"> WELCOME {params && params.user} </h2>
        <p className = "w3-text-grey"> Welcome page </p>
        <hr />
        <p>
          <button className = "w3-button w3-blue" onClick = {e => this.props.nav.navigate('home')}> Move to page Home </button>
          {' '}
          <button className = "w3-button w3-blue" onClick = {e => this.props.nav.navigate('landing')}> Move to page Landing </button>
        </p>
        <p>
          <button className = "w3-cell w3-mobile w3-button w3-blue" style={{margin: '3px'}} onClick = {e => this.popupInfo()}> Popup Info </button>
        </p>
      </div>
    );
  }
  popupInfo() {
    this.props.page.popup(Popup_Info)
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
}

class Page_Error extends Component {
  render() {
    const data = this.props.route.data;
    return (
      <div className = "w3-container">
        <h2 className = " w3-text-red"> Error: {data && data.error || 'Unknown'} </h2>
        <p className = "w3-text-grey"> {data && data.message || 'Unexpected unknown error has occured'} </p>
      </div>
    );
  }
}

class Page_TestReplaceMain extends Component {
  constructor(props) {
    super(props);
    props.page.onLoad(e => console.log('# Load Page Test Replace Main'));
    props.page.onBeforeEnter(e => console.log('# Before Enter Page Test Replace Main'));
    props.page.onEnter(e => console.log('# Enter Page Test Replace Main'));
    props.page.onLeave(e => console.log('# Leave Page Test Replace Main'));
    props.page.onUnload(e => console.log('# Unload Page Test Replace Main'));
  }
  render() {
    return (
      <div className = "w3-container">
        <h2 className = " w3-text-red"> Main: click replaced by sub </h2>
        <p>
          <button className = "w3-button w3-red" onClick = {e => nav.navigate('testsub', { reload: true })}> Replace by Sub</button>
        </p>
      </div>
    );
  }
}

class Page_TestReplaceSub extends Component {
  constructor(props) {
    super(props);
    props.page.onLoad(e => console.log('# Load Page Test Replace Sub'));
    props.page.onBeforeEnter(e => console.log('# Before Enter Page Test Replace Sub'));
    props.page.onEnter(e => console.log('# Enter Page Test Replace Sub'));
    props.page.onLeave(e => console.log('# Leave Page Test Replace Sub'));
    props.page.onUnload(e => console.log('# Unload Page Test Replace Sub'));
  }
  render() {
    return (
      <div className = "w3-container">
        <h2 className = " w3-text-red"> Sub: click replaced by main </h2>
        <p>
          <button className = "w3-button w3-green" onClick = {e => nav.navigate('testmain', { reload: true })}> Replace by main</button>
        </p>
      </div>
    );
  }
}

function Page_Greeting ({ route }) {

  const team = route.params.team;
  const name = route.data;

  return (
    <div className = "w3-container">
        <h2 className = " w3-text-green"> Greeting {name} @ {team} </h2>
        <hr />
        <p>
          <button className = "w3-button w3-blue" onClick = {e => nav.navigate('home')}> Back to Home </button>
        </p>
      </div>
  )
}

class Page_Data extends Component {
  constructor(props) {
    super(props);
    props.page.onLoad(e => console.log('# Load Page Data'));
    props.page.onBeforeEnter(e => console.log('# Before Enter Page Data'));
    props.page.onEnter(e => console.log('# Enter Page Data'));
    props.page.onLeave(e => console.log('# Leave Page Data'));
    props.page.onUnload(e => console.log('# Unload Page Data'));
  }
  render() {
    const data = this.props.page.data;
    return (
      <div className = "w3-container">
        <h2 className = " w3-text-red"> Page Data is {data.msg} </h2>
      </div>
    );
  }
}

const routes = {
  home: { Page: Page_Home, url: '/' },
  landing: {url: '/landing', redirect: 'home'},
  welcome: { Page: Page_Welcome, url: '/welcome/:user', data: {user: '$USER'}, title: 'Welcome' },
  error404: { Page: Page_Error, url: '/error/404', data: {error: 404, message: 'Page not found'}, title: "Error" },
  testmain: { Page: Page_TestReplaceMain, url: '/test/main', title: "Test Main" },
  testsub: { Page: Page_TestReplaceSub, url: '/test/sub', title: "Test Sub" },
  greeting: { Page: Page_Greeting, url: '/greeting/:team', data: () => nav.popup(Popup_GetInput), reject: ({nav}) => nav.navigate('error404'), title: "Greeting"  },
  data: { Page: Page_Data, url: '/data', title: "Data" },
};

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = { ui: 1 };
    this.route = null;
  }
  render() {
    return (
      <div className="w3-container">
        <div className = "w3-bar w3-border-bottom w3-padding">
          <button className = "w3-bar-item w3-button w3-text-blue" onClick = {e => this.navToHome()}> Home </button>
          <button className = "w3-bar-item w3-button w3-text-green" onClick = {e => this.route.navigate('welcome', {params: {user: 'Bar'}})}> Welcome </button>
          <button className = "w3-bar-item w3-button w3-text-green" onClick = {e => this.route.navigate('greeting', {params: {team: 'test'}})}> Greeting </button>
          <button className = "w3-bar-item w3-button w3-text-grey" onClick = {e => this.popupLoading()}> Global Popup Loading </button>
          <button className = "w3-bar-item w3-button w3-text-grey" onClick = {e => this.popupOverlay()}> Global Popup Overlay </button>
          <span className = "w3-right">
            <button className = "w3-bar-item w3-button w3-text-blue" onClick = {e => this.setState({ ui: 1 })}> Mount Nav </button>
            <button className = "w3-bar-item w3-button w3-text-red" onClick = {e => this.setState({ ui: 2 })}> Unmount Nav </button>
          </span>

        </div>
        {
          this.state.ui === 1 ?
            <Navigator  routes = {routes}
                        initialRoute = 'home'
                        fallbackRoute = 'error404'
                        routeHandler = { routeHandler => this.route = routeHandler }
                        {...this.props}
                        noUrl = {false}
            />
            :
            <p> Unmounted Navigator </p>
        }

      </div>
    )
  }
  navToHome() {
    nav.navigate('home')
    .then( () => console.log('# Nav to Home resolved'))
    .catch(e => console.log(e));
  }
  popupLoading() {
    nav.popup(Popup_Loading, self => setTimeout(() => self.resolve('# --- Popup Loading resolve by Timeout 5s'), 5000))
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
  popupOverlay() {
    nav.popup(Popup_Overlay)
    .then(m => console.log(m))
    .catch(e => console.log(e));
  }
}

render(<Demo />, document.getElementById('root'));
