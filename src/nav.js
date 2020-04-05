"use strict"

export default {
  __isNavRegistered : false,
  __popup: null,
  __route: null,
  register(nav) {
    if (this.__isNavRegistered) {
      throw new Error("Only one Navigator can be registered!")
    }
    this.__isNavRegistered = true;
    this.__popup = (PopupComponent, options, cb) => nav.__createPopup('__global', PopupComponent, options, cb);
    this.__route = nav.route;
    this.__toast = (ToastComponent, options, cb) => nav.__createToast(ToastComponent, options, cb);
  },
  destroy() {
    this.__isNavRegistered = false;
    this.__popup = null;
    this.__route = null;
    this.__toast = null;
  },
  popup(PopupComponent, options, cb) {
    if (this.__popup === null) {
      return Promise.reject('Navigator is not mounted or has been destroyed');
    }
    return this.__popup(PopupComponent, options, cb);
  },
  navigate(route, options) {
    if (this.__route === null) {
      return Promise.reject('Navigator is not mounted or has been destroyed');
    }
    return this.__route.navigate(route, options);
  },
  toast(ToastComponent, options, cb) {
    if (this.__toast === null) {
      return Promise.reject('Navigator is not mounted or has been destroyed');
    }
    return this.__toast(ToastComponent, options, cb);
  }
};
