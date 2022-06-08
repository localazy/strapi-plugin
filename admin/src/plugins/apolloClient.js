import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
} from "@apollo/client";
import Cookies from "js-cookie";

const createClient = () => {
  const httpLink = new HttpLink({ uri: process.env.STRAPI_ADMIN_GRAPHQL_URL });

  const authLink = new ApolloLink((operation, forward) => {
    // Retrieve the authorization token from local storage.
    const token = Cookies.get('LOCALAZY-API-USER-JWT');

    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    // Call the next link in the middleware chain.
    return forward(operation);
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
}

export default createClient;
