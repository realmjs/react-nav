"use strict"

import React from 'react';

import { useDocumentTitle } from '../../src';

export default function({ route }) {

  useDocumentTitle(route);

  return (
    <div>
      <h3 className = "w3-text-red"> B L O G </h3>
    </div>
  );

}
