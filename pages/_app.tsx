import '../styles/globals.css'
import type { AppProps } from 'next/app'

import GProvider from "./components/GProvider";


function MyApp({ Component, pageProps }: AppProps) {
  return (<GProvider>
          <Component {...pageProps} />
        </GProvider>)
}
export default MyApp
