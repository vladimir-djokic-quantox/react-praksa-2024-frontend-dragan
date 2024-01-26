import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import '@/styles/globals.css';

const client = new ApolloClient({
  uri: 'http://localhost:3030/graphql',
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
