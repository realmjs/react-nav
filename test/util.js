"use strict"

let __location;

export function mockLocation(loc) {
  __location = window.location;
  delete window.location;
  window.location = loc;
}

export function clearMockLocation() {
  window.location = __location;
}

export function setLocation(path) {
  history.replaceState({}, "", path);
}
