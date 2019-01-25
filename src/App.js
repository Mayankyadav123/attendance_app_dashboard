import React from 'react';
import './App.css';

import Router from './Router';
import Login from './pages/Login';
import Loading from './components/Loading';

import client from './client';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state ={};
  }

  componentDidMount() {
    client.authenticate().then((response) => {
      return client.passport.verifyJWT(response.accessToken);
    }).then((payload) => {
      client.set('username', payload.email);
      client.set('permissions', payload.permissions);
    }).catch((error) => {
      this.setState({
        auth: false,
      });
    });

    client.on('authenticated', (auth) => {
      this.setState({
        auth,
      });
    });

    client.on('logout', () => {
      this.setState({
        auth: false,
      })
    })
  }

  render() {
    if (this.state.auth === undefined) {
      return <Loading />;
    } else if (this.state.auth) {
      return <Router />;
    }

    return <Login />;
  }
}
