"use strict"

import route from '../src/route.util';

import { setLocation, mockLocation, clearMockLocation } from './util';

test("extract url information from location href", () => {

  expect( route.href() ).toBe('http://localhost:3000/');
  expect( route.host() ).toBe('localhost:3000');
  expect( route.hostname() ).toBe('localhost');
  expect( route.path() ).toBe('/');
  expect( route.origin() ).toBe('http://localhost:3000');

});


test("set new href", () => {

  mockLocation(new URL('http://localhost:3000'));

  route.href.set('http://localhost:3100');
  expect( route.href() ).toBe('http://localhost:3100/');

  clearMockLocation();

});


test("push new path into history", () => {

  route.path.push('/test');
  expect( route.href() ).toBe('http://localhost:3000/test');
  expect( route.path() ).toBe('/test');

});


test("matching a pattern with current href", () => {

  mockLocation(new URL('http://localhost:3000/test/s1/t1/'));

  expect( route.match("/test/s1/t1").isMatched ).toBe(true);
  expect( route.match("/test/:s/:t").isMatched ).toBe(true);

  expect( route.match("/test/:s").isMatched ).toBe(false);
  expect( route.match("/test/:s/:t/:c").isMatched ).toBe(false);

  expect( route.match("/").isMatched ).toBe(false);
  expect( route.match("/notest").isMatched ).toBe(false);
  expect( route.match("/test/t1").isMatched ).toBe(false);

  clearMockLocation();

});

test("matching params with current href", () => {

  setLocation('/test/p1');
  expect(route.match("/test/:param").params).toEqual({ param: 'p1' });

  setLocation('/test/s1/t1');
  expect(route.match("/test/:s/:t").params).toEqual({ s: 's1', t: 't1' });

  setLocation('/test/s1/case/t1');
  expect(route.match("/test/:s/case/:t").params).toEqual({ s: 's1', t: 't1' });

  setLocation('/test/s1/result');
  expect(route.match("/test/:s/result").params).toEqual({ s: 's1' });

  setLocation('/test/t-01');
  expect(route.match("/test/:t").isMatched).toBe(true);
  expect(route.match("/test/:t").params).toEqual({ t: 't-01' });

});

test("Corner case: test for special path pattern: /:param/test", () => {

  mockLocation(new URL('http://localhost:3000/param/test'));

  expect( route.match("/:p").isMatched ).toBe(false);
  expect( route.match("/:p/test").isMatched ).toBe(true);

  clearMockLocation();

});
