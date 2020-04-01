"use strict"

const URL = 0;
const PROTOCOL = 1;
const HOST = 2;
const PATH = 3;


export default class Href {
  constructor() {
    this.__handlers = { hashChange: [], popState: [] };

    this.push = (url, title, state) => {
      history.pushState(state, title, url);
    };

    window.addEventListener('hashchange',(evt) => {
      this.__handlers.hashChange.forEach(handler => handler(evt));
    }, false);
    window.addEventListener('popstate',(evt) => {
      this.__handlers.popState.forEach(handler => handler(evt));
    }, false);

  }
  getPathName() {
    const path = this.__matchFromURL(PATH).replace(/#.*$/,'');
    return path.split('?')[0];
  }
  getUrl() {
    return this.__matchFromURL(URL);
  }
  getProtocol() {
    return this.__matchFromURL(PROTOCOL).replace(/:.*$/,'');
  }
  getHost() {
    return this.__matchFromURL(HOST);
  }
  __matchFromURL(part) {
    const url = window.location.href.replace(/(\/)\1+/g, '/').replace(/:(?=\/)/,":/");
    return url.match(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/)[part].replace(/\/$/,'');
  }
  getQuery() {
    const href = window.location.href.split('?');
    if (!href[1]) {
      return undefined;
    }
    const query = {};
    const params = href[1].split('&');
    params.forEach( param => {
      const splitted = param.split('=');
      if (splitted[0]) {
        query[splitted[0]] = (splitted[1] && splitted[1].replace(/#.*$/,'')) || undefined;
      }
    })
    return query;
  }
  getBookmark() {
    const href = window.location.href.split('#');
    return href[1] || '';
  }
  set(url) {
    location.href = url;
  }
  on(event, callback) {
    if (event !== 'hashChange' && event !== 'popState') {
      throw new Error('only accept hashChange and popState in href.on');
    }
    this.__handlers[event].push(callback);
  }
};
