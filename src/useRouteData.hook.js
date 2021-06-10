"use strict"

import { useState, useEffect } from 'react';
import { isFunction } from './util';

export default function(route, props) {
  const [data, setData] = useState(isFunction(route.data)? null : route.data);
  let isComponentStillMounted = true;

  useEffect(() => {
    isFunction(route.data) && executeRouteDataFunction();
    return () => isComponentStillMounted = false;
  }, []);

  useEffect(() => {
    route.event.on("update", updateData);
    return () => route.event.off("update", updateData);
  }, []);

  return data;

  function executeRouteDataFunction() {
    const result = route.data(route.params, props, route.event);
    if (result.then)
      result.then(data => isComponentStillMounted && setData(data))
            .catch(error => {
              isComponentStillMounted && route.event.emit("error", { scope: 'data', error });
              isComponentStillMounted && setData(undefined);
            });
    else
      setData(result);
  }

  function updateData({scope, data}) {
    scope === 'data' && setData(data);
  }

}
