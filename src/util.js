"use strict"

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function isFunction(fn) {
 return fn && {}.toString.call(fn) === '[object Function]';
}

export function isSameRoute(route, name, params) {
  if (!route) { return false; }
  if (route.name !== name) { return false }
  if (route.params === undefined && params === undefined) { return true; }
  if (route.params && params && compareObject(route.params, params) === true) { return true; }
  return false;
}

export function compareObject(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) { return false; }
  for (let prop in a) {
    if (a[prop] !== b[prop]) { return false; }
  }
  return true;
}

export function createRouteUid(name, params) {
  let uid = `${name}_`;
  const props = Object.keys(params).sort((a, b) => a.firstname.localeCompare(b.firstname));
  for (let i = 0; i < props.length; i++) {
    uid += `${params[props[i]]}*`;
  }
  return uid;
}

export function makeTitle(str, params, data) {

  if (!str) { return undefined; }
  if (!params && !data) { return str; }

  let title = str;

  params && parsePatternsFromTitle(str, 'param').forEach(p => {
    title = title.replace(new RegExp(`{:${p}}`), params[p]);
  });

  data && parsePatternsFromTitle(str, 'data').forEach(p => {
    title = title.replace(new RegExp(`{{${p}}}`), deepGetData(data, p));
  });

  return title;

}

function parsePatternsFromTitle(title, by) {
  const patterns = (by === 'param')? title.match(/\{:(\w+)\}/g) : title.match(/\{\{(.+)\}\}/g);
  return patterns? patterns.map(p => p.replace(/\{|:|\}/g,'')) : [];
}

function deepGetData(data, pattern) {
  const keys = pattern.split('.');
  const value = data[keys[0]];
  if (keys.length === 1) { return value; }
  return deepGetData(value, pattern.replace(/^\w*\./,''));
}
