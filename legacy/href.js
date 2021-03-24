"use strict"

const URL = 0;
const PROTOCOL = 1;
const HOST = 2;
const PATH = 3;


export default class Href {
  constructor() {
    this.__handlers = { hashChange: [], popState: [] };

    this.__defaultTitle = document.title;

    this.push = (url, title, state) => {
      history.pushState(state, "", url);
      if (title) {
        document.title = title;
      } else {
        document.title = this.__defaultTitle
      }
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
  set(url, title) {
    location.href = url;
    document.title = title;
  }
  on(event, callback) {
    if (event !== 'hashChange' && event !== 'popState') {
      throw new Error('only accept hashChange and popState in href.on');
    }
    this.__handlers[event].push(callback);
  }
  matchUrlPath(url) {
    const paths = this.getPathName().split('/').filter(u => u.length > 0).map(p => p.trim().toLowerCase());
    const urls = url.split('/').filter(u => u.length > 0).map(u => u.trim().toLowerCase());
    // console.log(`Matching urls = ${urls} . paths = ${paths}`)
    // console.log(`   urls.length  = ${urls.length}`)
    // console.log(`   paths.length = ${paths.length}`)
    if (urls.length !== paths.length) {
      return false;
    }
    for (let i = 0; i < urls.length; i++) {
      // console.log(`   urls[${i}]  = ${urls[i]}`)
      // console.log(`   paths[${i}] = ${paths[i]}`)
      if (/^:/.test(urls[i])) {
        continue;
      }
      if (urls[i] !== paths[i]) {
        return false;
      }
    }
    return true;
  }
  buildUrlPath(url, params) {
    const urls = url.split('/').filter(u => u.length > 0).map(u => u.trim().toLowerCase());
    let returnUrl = '';
    for (let i = 0; i < urls.length; i++) {
      if (/^:/.test(urls[i])) {
        const p = urls[i].split(':').pop();
        if (params && params[p]) {
          returnUrl += `/${params[p]}`;
        } else {
          throw new Error(`Missing value for ${urls[i]} in ${url}`);
        }
      } else {
        returnUrl += `/${urls[i]}`;
      }
    }
    return returnUrl.length === 0? '/' : returnUrl;
  }
  extractUrlParams(url) {
    const paths = this.getPathName().split('/').filter(u => u.length > 0);
    const urls = url.split('/').filter(u => u.length > 0).map(u => u.trim().toLowerCase());
    const params = {};
    for (let i = 0; i < urls.length; i++) {
      if (/^:/.test(urls[i])) {
        params[urls[i].split(':').pop()] = paths[i];
      }
    }
    return params;
  }
  setDefaultTitle(title) {
    this.__defaultTitle = title;
  }
};
