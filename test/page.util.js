"use strict"

import React from 'react';

export const Home = () => (<h2>Home</h2>);
export const About = () => (<h2>About</h2>);
export const Error404 = () => (<h2>404</h2>);

export const Contact = ({ route }) => {
  const { team } = route.params;
  return (<h2>Contact {team}</h2>);
};
