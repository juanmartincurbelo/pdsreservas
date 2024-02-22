import React from 'react';

import './style.scss';

const NotFound = () => {

  return (
    <div className="not-found">
      <span className="not-found__error">404</span>
      <span className="not-found__text">
        Page Not Found
      </span>
    </div>
  );
};

export default NotFound;
