"use strict"

export function isFunction(func) {
  return func && Object.prototype.toString.call(func) === "[object Function]";
}

export function isNotFunction(func) {
  return !isFunction(func);
}
