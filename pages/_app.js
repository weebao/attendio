//pages/_app.js
  
import Head from 'next/head'
import "../styles/globals.css"
import { QueryClient, QueryClientProvider } from 'react-query'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react'
  
function MyApp({ Component, pageProps }) {
  const theme = extendTheme({
    colors: {
      brand: {
        100: "#f7fafc",
        200: "#edf2f7",
        900: "#1a202c",
      },
    },
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    }
  })

  return (
      <>
        <Head>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <QueryClientProvider client={new QueryClient()}>
          <ChakraProvider theme={theme}>
            <Analytics />
            <Component {...pageProps} />
          </ChakraProvider>
        </QueryClientProvider>
      </>
  );
}
  
export default MyApp;