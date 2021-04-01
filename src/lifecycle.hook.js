"use strict"

import { useRef } from 'react';

export function useComponentWillMount(func) {
  const willMount = useRef(true);
  willMount.current && func();
  willMount.current = false;
}
