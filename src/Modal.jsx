"use strict"

import React from 'react';

export default function({ visible, children }) {

  const style = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0, 0, 0, .2)',
    display: visible? 'block' : 'none',
  };

  return (
    <div style = {style}>
      {children}
    </div>
  );

}
