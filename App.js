import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { ApolloProvider } from '@apollo/client/react';

import { client } from './src/graphql';

import Navigation from './src/navigations';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <Navigation />
      </NativeBaseProvider>
    </ApolloProvider>
  );
};


export default App;
