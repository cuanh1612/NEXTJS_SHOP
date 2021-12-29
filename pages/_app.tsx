import AuthNotLoged from '@/components/common/Auth/AuthNotLogin'
import AuthLoged from '@/components/common/Auth/AuthLogin'
import AuthLogedAdmin from '@/components/common/Auth/AuthLoginAdmin'
import { AppPropsWithLayout } from '@/models/common'
import { store } from '@/reduxState/store'
import { theme } from '@/theme'
import { getData } from '@/utils'
import { ChakraProvider } from "@chakra-ui/react"
import { GlobalContextProvider } from 'contextAPI/globalContext'
import { JSXElementConstructor, ReactElement } from 'react'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import '../styles/globals.css'
import Script from 'next/script'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  //Check type auth each component and render auth with component
  const renderAuth = (page: ReactElement<any, string | JSXElementConstructor<any>>) => {
    //Check login if not loged will return component
    if (Component.typeAuth === "notLoged") {
      return (
        <AuthNotLoged>
          {
            getLayout(<Component {...pageProps} />)
          }
        </AuthNotLoged>
      )
    }

    //Check login if loged will return component
    if (Component.typeAuth === "loged") {
      return (
        <AuthLoged>
          {
            getLayout(<Component {...pageProps} />)
          }
        </AuthLoged>
      )
    }

    //Check login if loged will return component
    if (Component.typeAuth === "logedAdmin") {
      return (
        <AuthLogedAdmin>
          {
            getLayout(<Component {...pageProps} />)
          }
        </AuthLogedAdmin>
      )
    }


    return (
      <>
        {
          getLayout(<Component {...pageProps} />)
        }
      </>
    )
  }

  return (
    <>
      {/* Javscript paybal */}
      <Script src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`} />
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <GlobalContextProvider>
            <SWRConfig value={{ fetcher: (url) => getData(url), shouldRetryOnError: false }}>
              {
                renderAuth(<Component {...pageProps} />)
              }

            </SWRConfig>
          </GlobalContextProvider>
        </ChakraProvider>
      </Provider>
    </>
  )
}
export default MyApp
