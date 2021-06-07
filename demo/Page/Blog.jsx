"use strict"

import React from 'react';

import { useDocumentTitle } from '../../src';
import { useRouteData } from '../../src';
import { usePopup } from '../../src'

export default function({ route }) {

  useDocumentTitle(route);
  const data = useRouteData(route);
  const popup = usePopup(Popup);

  return (
    <div>
      <h3 className = "w3-text-red"> B L O G </h3>
      <p>
        <button className = "w3-button w3-blue" onClick = {openPopup}> See Info </button>
      </p>
    </div>
  );

  function openPopup() {
    popup.open({ data }).then(m => console.log(m));
  }

}



function Popup({ data, self }) {
  return (
    <div className = "w3-container w3-white" style = {{ maxWidth: '250px', margin: '20% auto'}}>
      <h3> Blog Info </h3>
      <p> Author:  { data && data.author } </p>
      <p> Latest post: { data && data.section.latest }  </p>
      <p> <button className = "w3-button w3-blue" onClick = {e => self.resolve('popup closed')}> Close </button> </p>
    </div>
  );
}
