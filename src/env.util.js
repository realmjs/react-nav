"use strict"

export default {
  isNative: () => window.location === undefined,
  isWeb: () => window.location !== undefined
};
