"use strict"

import { useState, useEffect } from 'react';

export default function (route) {

  const [error, setError] = useState(null);

  useEffect(() => {
    route.event.on('error', onRouteError);
    return () => route.event.off('error', onRouteError);
  }, []);

  return error;

  function onRouteError(error) {
    setError(error);
  }

}
