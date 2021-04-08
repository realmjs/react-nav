"use strict"

import { useState, useEffect } from 'react';

import event from './event-emitter';

export default function(route, props) {
  const [data, setData] = useState(isFunction(route.data)? null : route.data);
  useEffect(() => isFunction(route.data) && updateData() , []);
  return data;

  function updateData() {
    const result = route.data(route.params, props);
    if (result.then)
      result.then(data => setData(data))
            .catch(error => {
              event.emit("error", { scope: 'data', error });
              setData(undefined);
            });
    else
      setData(result);
  }
}

function isFunction(func) {
  return func && Object.prototype.toString.call(func) === "[object Function]";
}
