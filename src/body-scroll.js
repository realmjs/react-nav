"use strict"

export default function() {

  let originalBodyStyle = document.body.style.cssText || null;

  return {

    enable() {
      const scrollY = document.body.style.top;
      document.body.style.cssText = originalBodyStyle;
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    },

    disable() {
      originalBodyStyle = document.body.style.cssText;
      document.body.style.cssText = `; overflow: hidden; position: fixed;  width: 100%; top: -${window.scrollY}px `;
    },

  }
}
