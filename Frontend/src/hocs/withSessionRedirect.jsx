import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation} from 'react-router-dom';

const withSessionRedirect = (Component) => {
  const { pathname } = useLocation();

  const SessionRedirect = () => {
    return <Component {...pathname} />;
  }

  SessionRedirect.propTypes = {
    match: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  };

  return SessionRedirect;
};

export default withSessionRedirect;
