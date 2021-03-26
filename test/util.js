"use strict"

let __location;

export function mockLocation(loc) {
  __location = window.location;
  delete window.location;
  window.location = loc;
}

export function clearMockLocation() {
  jest.clearAllMocks();
  window.location = __location;
}
