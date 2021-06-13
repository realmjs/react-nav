"use strict"

import "core-js/stable";
import "regenerator-runtime/runtime";

import { renderHook } from '@testing-library/react-hooks';
import { act } from "react-dom/test-utils";
import { useRouteError } from '../src';

let __handler;
const event = {
  __events : {},
  on: jest.fn((type, handler) => __handler = handler),
  emit: (type, data) => __handler(data),
  off: jest.fn(),
}

beforeEach(() => jest.clearAllMocks());

test("Hook register event for error and update its state accordingy", async () => {
  const route = { event };
  const { result, unmount } = renderHook(() => useRouteError(route));
  expect(result.current).toBe(null);
  expect(route.event.on).toHaveBeenCalledTimes(1);
  expect(route.event.on.mock.calls[0][0]).toBe('error');

  act( () => route.event.emit('error', { scope: 'data', error: 'RouteData' }) );
  expect(result.current).toEqual({ scope: 'data', error: 'RouteData' });

  unmount();
  expect(route.event.off).toHaveBeenCalledTimes(1);
});
