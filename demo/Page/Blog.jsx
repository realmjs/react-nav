"use strict"

import React from 'react';

import { useDocumentTitle } from '../../src';
import { useRouteData } from '../../src';
import { usePopup } from '../../src'

export default function({ route }) {

  const data = useRouteData(route);
  useDocumentTitle(route, data);
  const popup = usePopup(Popup);

  return (
    <div>
      <h3 className = "w3-text-red"> B L O G </h3>
      <p>
        <button className = "w3-button w3-blue" onClick = {openPopup}> See Info </button>
      </p>
      <hr />
      <p> Repeated content to expand page </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>

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
      <p> Repeated content to expand page </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> Lorem ipsum dolor sit amet, est eu ferri audiam reprehendunt. Nam ut modo sumo assueverit, cu tota ancillae persequeris pro. Quo dictas mollis at. Aperiam numquam corrumpit cu per. Id mea eros velit, diceret principes vituperata ea ius. An modo dictas duo, elitr convenire eum id. </p>
      <p> <button className = "w3-button w3-blue" onClick = {e => self.resolve('popup closed')}> Close </button> </p>
    </div>
  );
}
