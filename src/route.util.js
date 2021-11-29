"use strict"

export default {

  href: href,
  path: path,
  host: () =>  location.host,
  hostname: () =>  location.hostname,
  origin: () =>  location.origin,

  match: match,

  constructLocationPath: constructLocationPath,

};

function href() {
  return location.href.replace(/(\/)\1+/g, '/').replace(/:(?=\/)/,":/");
}
href.set = (url) => location.href = url;

function path() {
  return location.pathname === '/' ? '/' : location.pathname.replace(/\/$/,'');
}
path.replace = (path) => history.replaceState({}, "", path);
path.push = (path) => history.pushState({}, "", path);

function match(pattern) {
  const matcher = {  };

  const _pattern = `^${normalize(pattern).replace(/:\w+/g,'[\\w\\-]+')}$`; // replace pattern :param -> [\w\-]+
  const currentPath = normalize(this.path());

  const regExp = new RegExp( _pattern );
  matcher.isMatched = regExp.test( currentPath );

  const path = this.path().split('/').filter(p => p.length > 0);
  matcher.params = matchParams(path, pattern);

  return matcher;
}

function matchParams(path, pattern) {
  const parts = pattern.split('/').filter(k => k.length > 0).map(k => k.trim());
  const params = {};
  parts.forEach((part, i) => {
    if (/^:/.test(part)) {
      params[part.split(':').pop()] = path[i];
    }
  });
  return params;
}

function normalize(path) {
  return path === '/'? path : path.replace(/\/$/, '');
}

function constructLocationPath(path, params) {
  const parts = path.split('/').filter(u => u.length > 0).map(u => u.trim().toLowerCase());
  let locationPath = '';
  for (let i = 0; i < parts.length; i++) {
    if (/^:/.test(parts[i])) {
      const p = parts[i].split(':').pop();
      if (params && params[p] !== undefined && params[p] !== null) {
        locationPath += `/${params[p]}`;
      } else {
        throw new Error(`route params do not match the param's pattern`);
      }
    } else {
      locationPath += `/${parts[i]}`;
    }
  }
  return locationPath.length === 0? '/' : locationPath;
};
