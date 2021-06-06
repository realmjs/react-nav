"use strict"

import React from 'react';

import { useDocumentTitle } from '../../src';
import { useRouteData } from '../../src';

export default function({ route }) {

  useDocumentTitle(route);
  const data = useRouteData(route);

  return (
    <div>
      <h3 className = "w3-text-red"> B L O G </h3>
      { data && data.author }
    </div>
  );

}
