"use strict"

export default function (route, data) {
  if (document && route.isActive && route.title) {
    document.title = composeDocTitle(route.title, route.params, data);
  }
}

function composeDocTitle(title, params, data) {

  let _title = title;

  params && matchParams(title).forEach(p => _title = _title.replace(new RegExp(`{:${p}}`), params[p]));

  data && matchData(title).forEach(p => _title = _title.replace(new RegExp(`{{${p}}}`), deepGetData(data, p)));

  return _title;

}

function matchParams(title) {
  const matched = title.match(/\{:(\w+)\}/g);
  return matched? matched.map(p => p.replace(/\{|:|\}/g,'')) : [];
}

function matchData(title) {
  const matched = title.match(/\{\{([\w|\.]+)\}\}/g);
  return matched? matched.map(p => p.replace(/\{|:|\}/g,'')) : [];
}

function deepGetData(data, pattern) {
  const keys = pattern.split('.');
  const value = data[keys[0]] || data;
  if (keys.length === 1) { return value; }
  return deepGetData(value, pattern.replace(/^\w*\./,''));
}
