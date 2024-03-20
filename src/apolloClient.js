import { ApolloClient, HttpLink, InMemoryCache, split, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { GQL_URL, WEB_SOCKET_URL } from './config'
import history from './constants/history';

const httpLink = new HttpLink({ uri: GQL_URL });

const wsLink = new WebSocketLink({ // for subscription
    uri: WEB_SOCKET_URL,
    options: {
        reconnect: true,
        connectionParams:{
            authentication:localStorage.getItem("token")

        }
    },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            signOut(client)
        );
    if (networkError) signOut(client);
});

const splitLink = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return (
            kind === 'OperationDefinition' && operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

// const authMiddleware = new ApolloLink((operation, forward) => {
//     // add the authorization to the headers
//     operation.setContext(({ headers = {} }) => ({
//         headers: {
//             ...headers,
//             authorization: AsyncStorage.getItem('token') || null,
//         }
//     }));

//     return forward(operation);
// })

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            'x-token': token ? token : "",
        }
    }
});
const signOut = client => {
    localStorage.clear()
    sessionStorage.clear()
    client.resetStore();
    history.push('/');
};
const link = from([errorLink, splitLink]);

const client = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache()
});

export { client }