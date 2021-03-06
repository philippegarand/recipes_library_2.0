import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import '../styles/globals.css';
import { useStore } from '../Utils/Store';
import { Layout, SnackBar } from '../components';
import theme from '../Utils/theme';

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
          <SnackBar />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
