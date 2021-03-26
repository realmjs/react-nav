"use strict"

import route from '../src/route.util';

import { mockLocationHref, clearMockLocationHref } from './util';

test("extract url information from location href", () => {

  expect( route.href() ).toBe('http://localhost:3000/');
  expect( route.host() ).toBe('localhost:3000');
  expect( route.hostname() ).toBe('localhost');
  expect( route.path() ).toBe('/');
  expect( route.origin() ).toBe('http://localhost:3000');

});


test("set new href", () => {

  mockLocationHref('http://localhost:3000');

  route.href.set('http://localhost:3100');
  expect( route.href() ).toBe('http://localhost:3100/');

  clearMockLocationHref();

});


test("push new path into history", () => {

  route.push('/test');
  expect( route.href() ).toBe('http://localhost:3000/test');
  expect( route.path() ).toBe('/test');

});


test("matching a pattern with current href", () => {

  mockLocationHref('http://localhost:3000/test/s1/t1/');

  expect( route.match("/test/s1/t1").isMatched ).toBe(true);
  expect( route.match("/test/:s/:t").isMatched ).toBe(true);

  expect( route.match("/test/:s").isMatched ).toBe(false);
  expect( route.match("/test/:s/:t/:c").isMatched ).toBe(false);

  expect( route.match("/").isMatched ).toBe(false);
  expect( route.match("/notest").isMatched ).toBe(false);
  expect( route.match("/test/t1").isMatched ).toBe(false);

  const matcher = route.match("/test/:s/:t");
  expect(matcher.params).toEqual({ s: 's1', t: 't1' });

  clearMockLocationHref();

});
