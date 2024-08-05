import { useEffect } from 'react';
import { useStore, Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import Helmet from "react-helmet";
import { wrapper } from "../store/index.js";
import Layout from '~/components/layout';
import { demoActions } from '~/store/demo';
import { currentDemo } from '~/server/queries';
import "~/public/sass/style.scss";
import { useRouter } from 'next/router'; // Correct import for useRouter

const App = ({ Component, pageProps }) => {
    const store = useStore();
   

    useEffect(() => {
        // ReactPixel.init('308078109064492');
        if (store.getState().demo.current !== currentDemo) {
            store.dispatch(demoActions.refreshStore(currentDemo));
        }
    }, [store]);

    // useEffect(() => {
    //     // Facebook Pixel Code
    //     !function(f,b,e,v,n,t,s)
    //     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    //     n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    //     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    //     n.queue=[];t=b.createElement(e);t.async=!0;
    //     t.src=v;s=b.getElementsByTagName(e)[0];
    //     s.parentNode.insertBefore(t,s)}(window, document,'script',
    //     'https://connect.facebook.net/en_US/fbevents.js');
    //     fbq('init', '308078109064492');
    //     fbq('track', 'PageView');
    
    //     // Track pageviews
     
    //   }, []);
    
    return (
        <Provider store={store}>
            <PersistGate
                persistor={store.__persistor}
                loading={<div className="loading-overlay">
                    <div className="bounce-loader">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                        <div className="bounce4"></div>
                    </div>
                </div>}>
                <Helmet>
                    <meta charSet="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                    <title>Party - Online Party Store</title>

                    <meta name="keywords" content="React Template" />
                    <meta name="description" content="Party - React eCommerce Template" />
                    <meta name="author" content="D-THEMES" />
                </Helmet>

                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </PersistGate>
        </Provider>
    );
}

App.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
};

export default wrapper.withRedux(App);
