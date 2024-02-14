import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import routes from '@constants/routes';

import withSessionRedirect from '@hocs/withSessionRedirect';

import NotFound from '@containers/NotFound';
import Home from '@containers/Home';

import './style.scss';

const App = () => {
  const ROUTES_TO_DISPLAY = [
    {
      component: NotFound,
      path: '*',
    },
    {
      component: withSessionRedirect(Home),
      path: routes.HOME,
    }
  ];

  return (
    <main>
      <Toaster />
      <Routes>
        {ROUTES_TO_DISPLAY.map(({ component, path }) => (
          <Route key={path} path={path} Component={component} />
        ))}
      </Routes>
    </main>
  );
};

export default App;
