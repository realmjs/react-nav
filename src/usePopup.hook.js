"use strict"

import { useEffect, useState } from 'react';

import popupManager from './popup-manager';

export default function(PopupComponent) {

  const [popup, setPopup] = useState();
  useEffect(() => {
    const popup = registerPopup();
    return () => unregisterPopup(popup);
  }, []);

  return popup;

  function registerPopup() {
    const popup = popupManager.add(PopupComponent);
    setPopup(popup);
    return popup
  }

  function unregisterPopup(popup) {
    popupManager.remove(popup)
  }
}
