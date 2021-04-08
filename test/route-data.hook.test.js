"use strict"

import "core-js/stable";
import "regenerator-runtime/runtime";

import { renderHook } from '@testing-library/react-hooks';
import useRouteData from '../src/route-data.hook';
import event from '../src/event-emitter';

jest.mock('../src/event-emitter');

beforeEach(() => jest.clearAllMocks());


test("Route Data is undefined", () => {
  const route = {};
  const { result } = renderHook(() => useRouteData(route));
  expect(result.current).toBeUndefined();
});


test("Route Data is defined but not a function", () => {
  const route = { data: 'RouteData' };
  const { result } = renderHook(() => useRouteData(route));
  expect(result.current).toEqual('RouteData');
});


test("Route Data is a function returning data", async () => {
  const route = { data: jest.fn(() => 'RouteData'), params: { id: 'test' } };
  const props = { dynamic: true };
  const { result } = renderHook(() => useRouteData(route, props));
  expect(route.data).toHaveBeenCalled();
  expect(route.data).toHaveBeenCalledWith(route.params, props);
  expect(result.current).toEqual('RouteData');
});


test("Route Data is a function returning a promise that resolving data", async () => {
  const route = { data: jest.fn(() => Promise.resolve('RouteData')), params: { id: 'test' } };
  const props = { anyprop: 'anyprop' };
  const { result, waitForNextUpdate } = renderHook(() => useRouteData(route, props));
  expect(result.current).toBe(null);

  await waitForNextUpdate();
  expect(route.data).toHaveBeenCalled();
  expect(route.data).toHaveBeenCalledWith(route.params, props);
  expect(result.current).toEqual('RouteData');
});


test("Route Data is a function returning a promise that rejecting data", async () => {
  const route = { data: jest.fn(() => Promise.reject('RouteError')) };
  const { result, waitForNextUpdate } = renderHook(() => useRouteData(route));
  expect(result.current).toBe(null);

  await waitForNextUpdate();
  expect(route.data).toHaveBeenCalled();
  expect(route.data).toHaveBeenCalledWith(undefined, undefined);
  expect(event.emit).toHaveBeenCalled();
  expect(event.emit).toHaveBeenCalledWith('error', { scope: 'data', error: 'RouteError' });
  expect(result.current).toBeUndefined();
});
