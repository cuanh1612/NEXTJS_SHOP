import React, { createContext, useEffect, useState } from 'react';
import { getData } from '@/utils';
import { useDispatch } from 'react-redux';
import { auth_first_login, auth_signin_success } from '@/reduxState/actionTypes/authAction';
import Loading from '@/components/common/Loading'
import { useAppSelector } from '@/reduxState/hooks';
import { selectCart } from '@/reduxState/store';
import { json } from 'node:stream/consumers';
import { cart_save_new } from '@/reduxState/actionTypes/CartAction';

export interface IGlobalContextProps {
  children: any
}

const GlobalContext = createContext({
  user: null
})

function GlobalContextProvider({ children }: IGlobalContextProps) {
  //Dispatch
  const dispatch = useDispatch()

  //Check already login -----------------------
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if (firstLogin === 'true') {
      getData('auth/accessToken').then(res => {
        if (!res.err) {
          dispatch(auth_signin_success(res.user, res.access_token, null))
          dispatch(auth_first_login())
          setLoading(false)
          setUser(res.user)
        } else {
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    setUser
  }
  //-------------------------------------------


  //Check cart exist in localstore and save cart to local when change 
  const { products: cart } = useAppSelector(state => selectCart(state))

  useEffect(() => {
    const Next_Shop_Cart = JSON.parse(localStorage.getItem('Next_Shop_Cart') as string)
    if (Next_Shop_Cart) {
      dispatch(cart_save_new(Next_Shop_Cart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('Next_Shop_Cart', JSON.stringify(cart))
  }, [cart])
  //-----------------------------------------------------------------

  return (
    <GlobalContext.Provider value={value}>
      {
        loading
          ? <Loading />
          : children
      }
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalContextProvider }