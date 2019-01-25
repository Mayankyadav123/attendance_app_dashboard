import feathers from '@feathersjs/client';
import auth from '@feathersjs/client/authentication';

// API host
const host = process.env.REACT_APP_API_URL;

// feathers client
const client = feathers()
  .configure(feathers.rest(host).fetch(window.fetch.bind(window)))
  .configure(auth({ jwtStrategy: 'jwt', storage: window.localStorage }));

export default client;
