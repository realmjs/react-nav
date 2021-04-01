"use strict"

const nav = {
  navigate: undefined,
};

export function registerNavigator(navHandler) {
  nav.navigate = navHandler.navigate;
};

export default nav;
