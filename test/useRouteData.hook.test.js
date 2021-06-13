"use strict"

import "core-js/stable";
import "regenerator-runtime/runtime";

import { act } from "react-dom/test-utils";

import { renderHook } from '@testing-library/react-hooks';
import { useRouteData } from '../src';
import EventEmitter from '../src/event-emitter';

jest.mock('../src/event-emitter');

beforeEach(() => jest.clearAllMocks());


test("Route Data is undefined", () => {
  const event = new EventEmitter();
  const route = { event };
  const { result } = renderHook(() => useRouteData(route));
  expect(result.current).toBeUndefined();
});


test("Route Data is defined but not a function", () => {
  const event = new EventEmitter();
  const route = { data: 'RouteData', event };
  const { result } = renderHook(() => useRouteData(route));
  expect(result.current).toEqual('RouteData');
});


test("Route Data is a function returning data", async () => {
  const event = new EventEmitter();
  const route = { data: jest.fn(() => 'RouteData'), params: { id: 'test' }, event };
  const props = { dynamic: true };
  const { result } = renderHook(() => useRouteData(route, props));
  expect(route.data).toHaveBeenCalled();
  expect(route.data).toHaveBeenCalledWith(route.params, props, event);
  expect(result.current).toEqual('RouteData');
});


test("Route Data is a function returning a promise that resolving data", async () => {
  const event = new EventEmitter();
  const route = { data: jest.fn(() => Promise.resolve('RouteData')), params: { id: 'test' }, event };
  const props = { anyprop: 'anyprop' };
  const { result, waitForNextUpdate } = renderHook(() => useRouteData(route, props));
  expect(result.current).toBe(null);

  await waitForNextUpdate();
  expect(route.data).toHaveBeenCalled();
  expect(route.data).toHaveBeenCalledWith(route.params, props, event);
  expect(result.current).toEqual('RouteData');
});


test("Route Data is a function returning a promise that rejecting data", async () => {
  const event = new EventEmitter();
  const route = { data: jest.fn(() => Promise.reject('RouteError')), event };
  const { result, waitForNextUpdate } = renderHook(() => useRouteData(route));
  expect(result.current).toBe(null);

  await waitForNextUpdate();
  expect(route.data).toHaveBeenCalled();
  expect(route.data).toHaveBeenCalledWith(undefined, undefined, event);
  expect(route.event.emit).toHaveBeenCalled();
  expect(route.event.emit).toHaveBeenCalledWith('error', { scope: 'data', error: 'RouteError' });
  expect(result.current).toBeUndefined();
});


test("Route Data update data via event", async () => {
  const EventEmitter = jest.requireActual('../src/event-emitter');
  const event = new EventEmitter.default();
  event.off = jest.fn();
  const data = jest.fn((params, props, event) => {
    event.on('action', () => event.emit('update', { scope: 'data', data: 'RouteDataUpdate' }));
    return Promise.resolve('RouteData');
  });
  const route = { data, event };
  const { result, waitForNextUpdate, unmount } = renderHook(() => useRouteData(route));
  expect(result.current).toBe(null);

  await waitForNextUpdate();
  expect(result.current).toEqual('RouteData');

  act(() => event.emit('action'));
  expect(result.current).toEqual('RouteDataUpdate');

  unmount();
  expect(route.event.off).toHaveBeenCalledTimes(1);

});


test("Route Data should not update data if update event scope is not data ", async () => {
  const EventEmitter = jest.requireActual('../src/event-emitter');
  const event = new EventEmitter.default();

  const data = jest.fn((params, props, event) => {
    event.on('action', () => event.emit('update', { scope: 'cafe', data: 'RouteDataUpdate' }));
    return Promise.resolve('RouteData');
  });
  const route = { data, event };
  const { result, waitForNextUpdate } = renderHook(() => useRouteData(route));
  expect(result.current).toBe(null);

  await waitForNextUpdate();
  expect(result.current).toEqual('RouteData');

  act(() => event.emit('action'));
  expect(result.current).toEqual('RouteData');

});
