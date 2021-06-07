"use strict"

import EventEmitter from './event-emitter';

const events = new EventEmitter();

const popupHandlers = [];

export default {

  add(PopupComponent) {
    const popup = new PopupHandler(PopupComponent);
    popupHandlers.push(popup);
    return popup;
  },

  remove(popup) {
    const popupIndex = popupHandlers.findIndex(handler => handler === popup);
    popupIndex > -1 && popupHandlers.splice(popupIndex, 1);
  },

  getActivePopups() {
    return popupHandlers.filter(popup => popup.isActive);
  },

  on(eventType, handler) {
    events.on(eventType, handler);
  },

  off(eventType, handler) {
    events.off(eventType, handler);
  }

}

class PopupHandler {
  constructor(PopupComponent) {
    this.Popup = PopupComponent;
    this.isActive = false;
    this._handlers = { 'resolve': [], 'reject': [] };
  }

  open(props) {
    this.props = props;
    this.isActive = true;
    events.emit('request', { action: 'open' });
    return new Promise((resolve, reject) => {
      this.on('resolve', resolve);
      this.on('reject', reject);
    });
  }

  resolve(args) {
    return this.promise('resolve', args);
  }

  reject(args) {
    return this.promise('reject', args);
  }

  promise(action, args) {
    if (this.isActive) {
      this.isActive = false;
      events.emit('request', { action, popup: this });
      this.emit(action, args);
    }
  }

  on(eventType, handler) {
    this._handlers[eventType] = handler;
  }

  emit(eventType, args) {
    this._handlers[eventType](args);
  }

}
