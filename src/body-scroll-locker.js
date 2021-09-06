"use strict"

export default function() {

  let originalBodyStyle = document.body.style.cssText || null;

  return {

    _lockCnt: 0,

    enable() {
      if (this._lockCnt === 1) {
        const scrollY = document.body.style.top;
        this.restoreBodyStyle();
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        this.isDisabled = false;
      }
      if (this._lockCnt > 0) {
        this._lockCnt--;
      } else {
        this._lockCnt = 0;
      }
    },

    disable() {
      if (this._lockCnt === 0) {
        this.backupBodyStyle();
        document.body.style.cssText = `; overflow: hidden; position: fixed;  width: 100%; top: -${window.scrollY}px `;
        this.isDisabled = true;
      }
      this._lockCnt++;
    },

    backupBodyStyle() {
      originalBodyStyle = document.body.style.cssText;
    },

    restoreBodyStyle() {
      document.body.style.cssText = originalBodyStyle;
    }

  }
}
