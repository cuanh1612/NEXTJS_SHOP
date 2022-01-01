import Empty from '@/components/common/Empty'
import ProductItem from '@/components/product/ProductItem'
import { UseToast } from '@/hooks'
import { MainLayout } from '@/layouts'
import { IProduct, NextPageWithLayout } from "@/models/common"
import { auth_message_clear } from '@/reduxState/actionTypes/authAction'
import { cart_message_clear } from '@/reduxState/actionTypes/CartAction'
import { useAppSelector } from '@/reduxState/hooks'
import { selectAuth, selectCart } from '@/reduxState/store'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Checkbox, SimpleGrid, Stack } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteData, getData } from 'utils/fetchData'

interface IHomeProps {
  products: IProduct[],
  result: number
}
const Home: NextPageWithLayout = ({ products, result }: IHomeProps) => {
  //State 
  const [Products, setProducts] = useState(products)
  const [isCheck, setIsCheck] = useState(false)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

  //Setup dialog delete user
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

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

  //Select infor current user
  const { currentUser, accessToken } = useAppSelector(state => selectAuth(state))

  //Handle Check 
  const handleCheck = (id: string) => {
    products.forEach(product => {
      if (product._id === id) {
        if (product.checked) {
          setIsCheck(false)
        }
        product.checked = !product.checked
      }
    })
    setProducts([...products])
  }

  //Handle check all
  const handleCheckAll = () => {
    products.forEach(product => product.checked = !isCheck)

    setProducts([...products])
    setIsCheck(!isCheck)
  }

  //Handle deleteProducts
  const deleteProducts = async () => {
    //Set loading delete all
    setIsLoadingDelete(true)

    //Get list product checked delete
    let deleteArr: IProduct[] = []
    await products.forEach(product => {
      if (product.checked) {
        deleteArr.push(product)
      }
    })

    //show messager when don't have any product checked
    if (deleteArr.length === 0) {
      setIsLoadingDelete(false)
      onClose()
      return toast.showToast("Inform Delete Products Checked:", "Pleas select products to delete.", "warning")
    }

    //Delete all products checked
    deleteArr.map(item => {
      deleteProduct(item._id)
    })


    //Set loading delete all products false
    setIsLoadingDelete(false)

    //Close dialog delete all
    onClose()
  }

  //Handle delete product
  const deleteProduct = async (id: string) => {
    await deleteData(`product/${id}`, accessToken as string).then(res => {
      if (res.err) return toast.showToast(`Inform Delete Product ${id}:`, res.err, "error")
      return toast.showToast(`Inform Delete Product ${id}:`, res.msg, "success")
    })
  }

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

      {
        currentUser?.role === 'admin' && (
          <Stack
            spacing={5}
            direction='row'
            paddingY="20px"
          >
            <Checkbox
              colorScheme='teal'
              onChange={handleCheckAll}
              isChecked={isCheck}
            >
              Select All Products
            </Checkbox>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => setIsOpen(true)}
            >
              Delete All
            </Button>
          </Stack>
        )
      }

      <Box>
        {
          products.length === 0
            ? <Empty content='No Product T.T' />
            : (
              <SimpleGrid columns={[1, 2, 3]} spacing={10}>
                {
                  products.map(product => (
                    <ProductItem handleCheck={handleCheck} product={product} key={product._id} />
                  ))
                }
              </SimpleGrid>
            )
        }
      </Box>

      {/* Dialog display when user enter delete button */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as React.RefObject<any>}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete All Product:
            </AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? You can't undo this action afterwards.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef as React.LegacyRef<any>} onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={isLoadingDelete} colorScheme='red' onClick={() => deleteProducts()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
