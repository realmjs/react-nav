"use strict"

import EventEmitter from '../src/event-emitter';

beforeEach(() => jest.clearAllMocks());

test("Verify event properties", () => {
  const event = new EventEmitter();
  expect(event).toBeInstanceOf(EventEmitter);
  expect(event).toHaveProperty('__events.error', []);
  expect(event).toHaveProperty('on');
  expect(event).toHaveProperty('off');
  expect(event).toHaveProperty('emit');
});

test("Register and unregister an event", () => {
  const h1 = jest.fn();
  const h2 = jest.fn();
  const h3 = jest.fn();

  const event = new EventEmitter();
  event.on("error", h1);
  event.on("error", h2);
  event.on("error", h3);
  expect(event).toHaveProperty('__events.error', [h1, h2, h3]);

  event.off("error", h2);
  expect(event).toHaveProperty('__events.error', [h1, h3]);

  event.off("error", h3);
  expect(event).toHaveProperty('__events.error', [h1]);

  event.off("error", h1);
  expect(event).toHaveProperty('__events.error', []);
});

test("Emit an event", () => {
  const h1 = jest.fn();
  const h2 = jest.fn();

  const event = new EventEmitter();
  event.on("error", h1);
  event.on("error", h2);

  event.emit("error", "event-error");
  expect(h1).toHaveBeenCalledTimes(1);
  expect(h1).toHaveBeenCalledWith("event-error");
  expect(h2).toHaveBeenCalledTimes(1);
  expect(h2).toHaveBeenCalledWith("event-error");
});
