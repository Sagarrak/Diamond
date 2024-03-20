// ** dotenv import
// import 'dotenv/config'
// ** React Imports
import { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
// ** Apollo Imports
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { RetryLink } from "apollo-link-retry";
import { WebSocketLink } from "@apollo/client/link/ws";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { GQL_URL, WEB_SOCKET_URL } from './config'
import history from './constants/history';
// ** Redux Imports
import { Provider } from 'react-redux'
import { store } from './redux/store'
// ** Intl, CASL & ThemeColors Context
import ability from './configs/acl/ability'
import { toast, ToastContainer } from 'react-toastify'
import { AbilityContext } from './utility/context/Can'
import { ThemeContext } from './utility/context/ThemeColors'
// ** i18n
import './configs/i18n'
// ** Spinner (Splash Screen)
import Spinner from './@core/components/spinner/Fallback-spinner'
// ** Ripple Button
import './@core/components/ripple-button'
// ** PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx.min'
// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css'
// ** React Toastify
import '@styles/react/libs/toastify/toastify.scss'
// ** Core styles
import './@core/assets/fonts/feather/iconfont.css'
import './@core/scss/core.scss'
import './assets/scss/style.scss'
// import './index.scss'
// ** Service Worker
import * as serviceWorker from './serviceWorker'
// import { FormatError } from './@core/components/common/FormatError';

// ** Lazy load app
const LazyApp = lazy(() => import('./App'))


const signOut = (client) => {
  localStorage.clear()
  client.cache.reset()
  client.clearStore()
  history.push('/');
};

const retry = new RetryLink({ attempts: { max: Infinity } })
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GQL_URL ? process.env.REACT_APP_GQL_URL : GQL_URL
});

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_SOCKET_URL ? process.env.REACT_APP_SOCKET_URL : WEB_SOCKET_URL,
  options: {
    reconnect: true,
  },
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
  retry
);

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {

    const token = localStorage.getItem('token');
    if (token) {
      headers = { ...headers, 'x-token': token };
    }
    return { headers };
  });

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const token = localStorage.getItem('token');
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions, path }) => {
      if (extensions.code === 'UNAUTHENTICATED') {
        if (token) {
          // toast.error(message)
          signOut(client);
        }
      }
    });
  }
  if (networkError) {
    if (networkError.statusCode === 400) {
      if (token) {
        // signOut(client);
      }
    }
  }
});

const link = ApolloLink.from([authLink, errorLink, terminatingLink]);

const cache = new InMemoryCache();
const storage = window.localStorage
const waitOnCache = persistCache({ cache, storage })

const client = new ApolloClient({
  link,
  cache,
});

waitOnCache.then(() => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Suspense fallback={<Spinner />}>
          <AbilityContext.Provider value={ability}>
            <ThemeContext>
              <LazyApp />
              <ToastContainer newestOnTop />
            </ThemeContext>
          </AbilityContext.Provider>
        </Suspense>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
