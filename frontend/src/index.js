import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 1. Core Apollo Imports
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink 
} from '@apollo/client';

// 2. React-Specific Imports (The fix for your error)
import { ApolloProvider } from '@apollo/client/react/index.js';

// 3. Auth Link Import (The fix for the "Unauthorized" error)
import { setContext } from '@apollo/client/link/context/index.js';

// --- CONFIGURATION ---

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

// This middleware grabs your token and attaches it to the "Launch Project" request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);