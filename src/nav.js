"use strict"

const nav = {
  navigate: undefined,
  back: undefined,
};

export function registerNavigator(navHandler) {
  nav.navigate = navHandler.navigate;
  nav.back = navHandler.back;
};

export default nav;
