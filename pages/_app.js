//pages/_app.js
  
import Head from 'next/head'
import "../styles/globals.css"
import { Layout } from '../components/Layout'
  
function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Head>
                <title>CS250 Roster</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            <Component {...pageProps} />
        </Layout>
    );
}
  
export default MyApp;