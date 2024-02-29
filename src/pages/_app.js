import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import '@/styles/globals.css';

const httpLink = new HttpLink({
  uri: 'http://localhost:3030/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    }
  });
  return forward(operation);
});

const link = authLink.concat(httpLink);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
