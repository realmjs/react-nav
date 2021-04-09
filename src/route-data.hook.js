"use strict"

import { useState, useEffect } from 'react';

export default function(route, props) {
  const [data, setData] = useState(isFunction(route.data)? null : route.data);
  useEffect(() => isFunction(route.data) && executeRouteDataFunction() , []);
  useEffect(() => {
    route.event.on("update", updateData);
    return () => route.event.off("update", updateData);
  }, []);
  return data;

  function executeRouteDataFunction() {
    const result = route.data(route.params, props, route.event);
    if (result.then)
      result.then(data => setData(data))
            .catch(error => {
              route.event.emit("error", { scope: 'data', error });
              setData(undefined);
            });
    else
      setData(result);
  }

  function updateData({scope, data}) {
    scope === 'data' && setData(data);
  }

}

function isFunction(func) {
  return func && Object.prototype.toString.call(func) === "[object Function]";
}
