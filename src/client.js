import feathers from '@feathersjs/client';
import auth from '@feathersjs/client/authentication';

// API host
const host = `https://itcinfotech-backend.herokuapp.com`;

// feathers client
const client = feathers()
  .configure(feathers.rest(host).fetch(window.fetch.bind(window)))
  .configure(auth({ jwtStrategy: 'jwt', storage: window.localStorage }));

export default client;
