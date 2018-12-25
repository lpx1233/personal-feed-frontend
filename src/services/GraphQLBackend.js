import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: window.localStorage,
});

export const client = new ApolloClient({
  cache,
  uri: 'http://52.221.217.26:8080/graphql'
});