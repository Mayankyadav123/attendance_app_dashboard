import React from 'react';  // eslint-disable-line no-unused-vars

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Layout from './layout/Base';

import Dashboard from './pages/Dashboard';

import Client from './pages/Client';
import Employee from './pages/Employee';

import NotFound from './pages/NotFound';

const Router = (props) => {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route exact path='/clients' component={Client} />
          <Route exact path='/employees' component={Employee} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
