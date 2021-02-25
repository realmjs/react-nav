"use strict"

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function isFunction(fn) {
 return fn && {}.toString.call(fn) === '[object Function]';
}
