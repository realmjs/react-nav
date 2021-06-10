"use strict"

import React from 'react';

import { useRouteData, useRouteError, useDocumentTitle } from '../../src';

export default function({ route }) {

  const data = useRouteData(route);
  useDocumentTitle(route, data);
  const error = useRouteError(route);

  const err = error && error.scope == 'data'? error.error : null;

  return (
    <div>
      <h3 className = "w3-text-red"> A B O U T </h3>
      <p> { data || err } </p>
    </div>
  );

}
