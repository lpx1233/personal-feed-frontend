import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import config from '../config/config.json';

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: window.localStorage,
});

// local state management
const defaults = {
  userID: 0,
  readBefore: [],
};

export const client = new ApolloClient({
  cache,
  uri: config.backendGraphQLEndpoint,
  clientState: {
    defaults,
    // resolver & typedef are omitted now
  }
});