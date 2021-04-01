"use strict"

import React from 'react';

export default function({ route }) {

  const { team } = route.params;

  return (
    <div>
      <h3 className = "w3-text-red"> A B O U T </h3>
      <p> { team } </p>
    </div>
  );

}
