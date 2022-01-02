import CartItem from '@/components/cart/cartItem';
import Empty from '@/components/common/Empty';
import { UseToast } from '@/hooks';
import { MainLayout } from '@/layouts';
import { IProduct, NextPageWithLayout } from '@/models/common';
import { cart_message_clear, cart_save_new } from '@/reduxState/actionTypes/CartAction';
import { addMessageCart, cartClearAll } from '@/reduxState/asyncActions/cartAsyncAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectCart } from '@/reduxState/store';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, FormControl, FormHelperText, FormLabel, Grid, GridItem, Input, Spacer, Textarea } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { getData, postData } from 'utils/fetchData';

export interface ICartProps {
}

const Cart: NextPageWithLayout = (props: ICartProps) => {
    //Router
    const router = useRouter()

    //Toast 
    const toast = UseToast()

    //Get message cart from redux
    const { message } = useAppSelector(state => selectCart(state))

    //State 
    const [address, setAddress] = React.useState('')
    const [mobile, setMobile] = React.useState('')
    const [callback, setCallback] = React.useState(false)

    //Dispatch
    const dispatch = useDispatch()

    //Get cart from redux
    const { products: cart } = useAppSelector(state => selectCart(state))

    //Get user from redux
    const { isLogin, accessToken } = useAppSelector(state => selectAuth(state))


    //State total
    const [totalPrice, setTotalPrice] = React.useState(0)

    //Show message from redux
    React.useEffect(() => {
        if (message) toast.showToast("Inform sign up:", message.description, message.status)
        dispatch(cart_message_clear())
    }, [dispatch, message])

    //Get toal price cart
    React.useEffect(() => {
        let total = 0
        for (let index = 0; index < cart.length; index++) {
            total = total + (cart[index].price * cart[index].quantity)
        }
        setTotalPrice(total)
    }, [cart])

    //Update product in cart and remove product when product out of stock
    React.useEffect(() => {
        const cartLocal = JSON.parse(localStorage.getItem('Next_Shop_Cart') as string)
        if (cartLocal && cartLocal.length > 0) {
            let newArr: IProduct[] = []
            const updateCart = async () => {
                for (const product of cartLocal) {
                    const res = await getData(`product/${product._id}`)
                    const { _id, title, images, price, inStock, sold } = res.product
                    if (inStock > 0) {
                        newArr.push({
                            _id, title, images, price, inStock, sold,
                            quantity: product.quantity > inStock - sold ? 1 : product.quantity,
                        })
                    }
                }

                dispatch(cart_save_new(newArr))
            }
            updateCart()
        }
    }, [callback])



    //Handle payment
    const handleOrder = async () => {
        if (!address || !mobile) {
            return toast.showToast("Inform Payment", "Please add your address and mobile.", "warning")
        }

        if (address.length < 20) {
            return toast.showToast("Inform Payment", "The address should be at least 20 characters.", "warning")
        }

        if (mobile.length < 9 || mobile.length > 10) {
            return toast.showToast("Inform Payment", "Mobile should have 10 digits.", "warning")
        }

        let newCart = []
        //Check instock of product in cart and create new cart array
        for (const item of cart) {
            const res = await getData(`product/${item._id}`)
            if ((res.product.inStock - item.quantity >= 0)) {
                newCart.push(item)
            }
        }

        //Check if new cart array difference old cart so setCallback let run again use effect
        if (newCart.length < cart.length) {
            setCallback(!callback)
            return toast.showToast("Inform Payment", "The product is out stock or the quantity is insufficient.", "warning")
        }

        //Send request add ordre but not pay yet
        postData('order', { address, mobile, cart, total: totalPrice }, accessToken as string)
            .then(res => {
                if (res.err) return dispatch(addMessageCart({
                    description: res.err,
                    status: "error"
                }))
                dispatch(cartClearAll())
                dispatch(addMessageCart({
                    description: res.msg,
                    status: "success"
                }))
                router.push(`/order/${res.newOrder._id}`)
            })
    }

    if (cart.length === 0) {
        return <Empty content="Cart Empty" />
    }

    return (
        <Box>
            <Head>
                <title>Cart Page</title>
            </Head>

            <Breadcrumb paddingY="20px">
                <BreadcrumbItem>
                    <Link href='/' passHref>
                        <BreadcrumbLink>
                            <a>
                                Home
                            </a>
                        </BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Cart</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Grid
                templateColumns='repeat(3, 1fr)'
                gap={4}
            >
                <GridItem colSpan={[3, 3, 2]}>
                    <Box border="1px solid teal" borderRadius="md" padding="20px">
                        <Box fontSize="20px" fontWeight="semibold" marginBottom="20px">
                            Your Order
                        </Box>
                        {
                            cart.map(product => (
                                <CartItem product={product} cart={cart} key={product._id} />
                            ))
                        }
                        <Flex padding="20px" borderRadius="md" background="teal.100">
                            <Box fontSize="20px" fontWeight="semibold">
                                Total
                            </Box>
                            <Spacer />
                            <Box fontSize="20px" fontWeight="semibold" color="tomato">
                                {totalPrice}$
                            </Box>
                        </Flex>
                    </Box>
                </GridItem>
                <GridItem colSpan={[3, 3, 1]}>
                    <Box border="1px solid teal" borderRadius="md" padding="20px">
                        <FormControl>
                            <FormLabel htmlFor='address'>ADDRESS</FormLabel>
                            <Textarea id='address' placeholder='Your address' value={address} onChange={e => setAddress(e.target.value)} />
                            <FormHelperText>{`We'll never share your address.`}</FormHelperText>
                        </FormControl>
                        <FormControl marginTop="10px">
                            <FormLabel htmlFor='mobile'>MOBILE</FormLabel>
                            <Input id='mobile' type='number' placeholder='Your phone' value={mobile} onChange={e => setMobile(e.target.value)} />
                            <FormHelperText>{`We'll never share your phone.`}</FormHelperText>
                        </FormControl>

                        <Link href={isLogin ? '#!' : '/signin'} passHref>
                            <Button marginTop="20px" colorScheme="teal">
                                <a onClick={() => handleOrder()}>
                                    PROCESS WITH PAYMENT
                                </a>
                            </Button>
                        </Link>


                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
}

Cart.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

export default Cart