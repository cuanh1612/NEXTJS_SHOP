import { UseToast } from '@/hooks'
import { MainLayout } from '@/layouts'
import { IProduct, NextPageWithLayout } from "@/models/common"
import { auth_message_clear } from '@/reduxState/actionTypes/authAction'
import { useAppSelector } from '@/reduxState/hooks'
import { selectAuth, selectCart } from '@/reduxState/store'
import { Box, Grid, GridItem, SimpleGrid } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getData } from 'utils/fetchData'
import Empty from '@/components/common/Empty'
import ProductItem from '@/components/product/ProductItem'
import { cart_message_clear } from '@/reduxState/actionTypes/CartAction'

interface IHomeProps {
  products: IProduct[],
  result: number
}
const Home: NextPageWithLayout = ({ products, result }: IHomeProps) => {
  //State 
  const [Products, setProducts] = useState(products)
  console.log(Products);

  //Router
  const router = useRouter()

  //Config inform
  const toast = UseToast()

  //Dispatch
  const dispatch = useDispatch()

  //Selector state
  const { message: messageAuth } = useAppSelector(selectAuth)

  //select cart state in redux
  const { message: messageCart } = useAppSelector(state => selectCart(state))


  //Show message auth from redux
  useEffect(() => {
    if (messageAuth) toast.showToast("Inform sign up:", messageAuth.description, messageAuth.status)
    dispatch(auth_message_clear())
  }, [dispatch, messageAuth])

  //Show message cart from redux
  useEffect(() => {
    if (messageCart) toast.showToast("Inform add cart:", messageCart.description, messageCart.status)
    dispatch(cart_message_clear())
  }, [dispatch, messageCart])

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <Box>
        {
          products.length === 0
            ? <Empty content='No Product T.T' />
            : (
              <SimpleGrid columns={[1, 2, 3]} spacing={10}>
                {
                  products.map(product => (
                    <ProductItem product={product} key={product._id} />
                  ))
                }
              </SimpleGrid>
            )
        }
      </Box>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await getData('product')

  return {
    props: {
      products: res.products,
      result: res.result
    }
  }
}
