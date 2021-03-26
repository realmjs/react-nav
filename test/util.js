"use strict"

let __location;

export function mockLocationHref(url) {
  const mockLocation = new URL(url);
  __location = window.location;
  delete window.location;
  window.location = mockLocation;
}

export function clearMockLocationHref() {
  jest.clearAllMocks();
  window.location = __location;
}
