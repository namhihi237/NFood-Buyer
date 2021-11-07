import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { storageUtils } from '../utils';

const httpLink = createHttpLink({
  uri: 'https://nfoodfast.herokuapp.com/api/v1/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await storageUtils.getString('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {

    },
  }),
});

export default client;
