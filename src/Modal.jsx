"use strict"

import React, { useState, useRef, useEffect } from 'react';

export default function({ visible, children }) {

  const modal = useRef();
  useEffect(() => visible && scrollModalTop(), [visible]);

  /* to remove flicker when scrollTop, visible content after the modal has already rendered and scrolled top */
  const [visibleContent, setVisibleContent] = useState(false);
  useEffect(() => setVisibleContent(visible), [visible]);

  const style = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0, 0, 0, .2)',
    display: visible? 'block' : 'none',
    overflowY: 'scroll',
  };

  return (
    <div ref = {modal} style = {style}>
      <div style = {{ position: 'relative', display: visibleContent? 'block': 'none' }}>
        {children}
      </div>
    </div>
  );

  function scrollModalTop() {
   modal.current && modal.current.scrollTo && modal.current.scrollTo({ top: 0, behavior: 'auto' });
  }

}
