"use strict"

import React from 'react';

import { usePopup } from '../../src';

export default function() {
  const popupAction = usePopup(PopupAction);
  const popupLoading = usePopup(PopupLoading);
  const popupInfo = usePopup(PopupInfo);
  return (
    <div>
      <h3 className = "w3-text-red"> H O M E </h3>
      <button className = "w3-button w3-blue" onClick = {openPopupAction}>Popup </button>
    </div>
  );

  function openPopupAction() {
    popupAction.open()
    .then(openPopupLoading)
    .catch(e => console.log(e));
  }

  function openPopupLoading() {
    popupLoading.open().then(openPopupInfo);
    setTimeout(() => popupLoading.resolve(), 2000);
  }

  function openPopupInfo() {
    popupInfo.open({message: 'success'}).then(m => console.log(m));
  }

}


function PopupAction({ self }) {
  return (
    <div className = "w3-container w3-white" style = {{ maxWidth: '250px', margin: '20% auto'}}>
      <h3> Action </h3>
      <hr />
      <p> Do you want to load resources?</p>
      <p>
        <button className = "w3-button w3-blue" onClick = {e => self.resolve()}> Yes </button>
        <button className = "w3-button" onClick = {e => self.reject('Abort Load Request')}> Cancel </button>
      </p>
    </div>
  );
}

function PopupLoading() {
  return (
    <div style = {{textAlign: 'center', margin: '20% auto'}}>
      <h2>Loading...</h2>
    </div>
  );
}

function PopupInfo({ message, self }) {

  return (
    <div className = "w3-container w3-white" style = {{ maxWidth: '250px', margin: '20% auto'}}>
      <h3> Info </h3>
      <hr />
      <p> { message } </p>
      <p>
        <button className = "w3-button w3-blue" onClick = {e => self.resolve(`Popup Info with message "${message}" has closed`)}> Close </button>
      </p>
    </div>
  );

}
