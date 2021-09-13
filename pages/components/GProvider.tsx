import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from
} from "@apollo/client";

import { onError } from "@apollo/client/link/error";


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});
const link = from([
  errorLink,
  new HttpLink({ uri: "http://localhost:3030/graphql" })
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

type props = {
  children: JSX.Element[] | JSX.Element
}

function GProvider( { children } : props  ) {
  return (<ApolloProvider client={ client } >{children}</ApolloProvider>)
}

export default GProvider;