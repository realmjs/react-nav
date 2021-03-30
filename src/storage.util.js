"use strict"

export default {
  __key: '__routestack_',
  config({ key }) { this.__key = key },
  set(value) { sessionStorage.setItem(this.__key, JSON.stringify(value)) },
  get() { return JSON.parse(sessionStorage.getItem(this.__key)) },
};
