"use strict"

export default {

  href: href,
  host: () =>  location.host,
  hostname: () =>  location.hostname,
  path: () =>  location.pathname,
  origin: () =>  location.origin,

  push: (path) => history.pushState({}, "", path),

  match: match,

};

function href() {
  return location.href.replace(/(\/)\1+/g, '/').replace(/:(?=\/)/,":/");
}
href.set = (url) => location.href = url;

function match(pattern) {
  const matcher = {  };

  const _pattern = `${normalize(pattern).replace(/:\w+/g,'\\w+')}$`; // replace pattern :param -> \w+
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
