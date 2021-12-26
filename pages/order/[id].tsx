import PaypalBtn from '@/components/cart/paypalBtn';
import { MainLayout } from '@/layouts';
import { Iorder, NextPageWithLayout } from '@/models/common';
import { order_message_clear } from '@/reduxState/actionTypes/orderAction';
import { orderAddList, orderUpdateItem } from '@/reduxState/asyncActions/orderAsyncAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectOrder } from '@/reduxState/store';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Center, Flex, Grid, GridItem, HStack, Spacer } from '@chakra-ui/react';
import { UseToast } from 'hooks/useToast';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { patchData } from 'utils/fetchData';

export interface IOrderDetailProps {
}

const OrderDetail: NextPageWithLayout = (props: IOrderDetailProps) => {
    //Toast
    const toast = UseToast()

    //Dispatch
    const dispatch = useDispatch()

    //Router
    const router = useRouter()

    const [orderDetail, setOrderDetail] = React.useState<Iorder[]>([])

    //Get list orders from redux
    const { accessToken, currentUser } = useAppSelector(state => selectAuth(state))
    const { orders, message } = useAppSelector(state => selectOrder(state))

    //Check if has message of order redux will display
    React.useEffect(() => {
        if (message)
            toast.showToast("Inform payment:", message.description, message.status)
        dispatch(order_message_clear())
    }, [message])

    //Get all list order 
    React.useEffect(() => {
        dispatch(orderAddList(accessToken as string))
    }, [])

    React.useEffect(() => {
        const newArr = orders.filter(order => order._id === router.query.id)
        setOrderDetail(newArr)
    }, [orders])

    //Handle mark order delivered
    const handleDelivered = async(orderId: string, order: Iorder) => {
        await patchData(`order/delivered/${orderId}`, {}, accessToken as string).then(res => {
            if(res.err) return toast.showToast("Inform mark deliverd:", res.err, "error")
            dispatch(orderUpdateItem(orders, orderId, {
                ...order,
                delivered: true
            }))
            return toast.showToast("Inform mark deliverd:", res.msg, "success")
        })
    }


    return (
        <>
            <Head>
                <title>Order Detail Page</title>
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
                    <Link href='/profile' passHref>
                        <BreadcrumbLink>
                            <a>
                                Profile
                            </a>
                        </BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Order Detail</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Grid
                templateColumns='repeat(6, 1fr)'
                gap={4}
            >

                {
                    orderDetail.map(order => (
                        <GridItem
                            key={order._id}
                            colSpan={
                                order.paid
                                    ? [6, 6, 6, 6]
                                    : currentUser && currentUser.role === "admin" 
                                    ? [6, 6, 6, 6]
                                    : [6, 6, 4, 4]
                            }
                            border="1px solid teal"
                            padding="20px"
                            borderRadius="md"
                        >
                            <Flex direction="column">
                                <Box fontSize="20px" fontWeight="medium">
                                    #{
                                        order._id
                                    }
                                </Box>


                                <Box marginTop="20px">
                                    <Box marginBottom="10px" fontSize="20px" fontWeight="medium" color="gray.400">
                                        SHIPPING
                                    </Box>
                                    <Box>
                                        NAME: {order.user && order.user.name}
                                    </Box>
                                    <Box>
                                        EMAIL: {order.user && order.user.email}
                                    </Box>
                                    <Box>
                                        ADDRESS: {order.address}
                                    </Box>
                                    <Box>
                                        PHONE: {order.mobile}
                                    </Box>
                                    <Center
                                        marginTop="20px"
                                        paddingY="15px"
                                        borderRadius="md"
                                        fontWeight="medium"
                                        color="white"
                                        backgroundColor={
                                            order.delivered
                                                ? "teal.400"
                                                : "red.400"
                                        }
                                    >
                                        <HStack>
                                            <Box>
                                                {
                                                    order.delivered
                                                        ? "Delivered"
                                                        : "Not Delivered"
                                                }
                                            </Box>

                                            {
                                                currentUser && currentUser.role === "admin" && !order.delivered && (
                                                    <Button colorScheme="blackAlpha" onClick={() => handleDelivered(order._id, order)}>
                                                        Mark as delivered
                                                    </Button>
                                                )
                                            }
                                        </HStack>
                                    </Center>
                                </Box>

                                <Box marginTop="20px">
                                    <Box marginBottom="10px" fontSize="20px" fontWeight="medium" color="gray.400">
                                        PAYMENT
                                    </Box>

                                    <Box>
                                        PAYMENTID: {order.paymentId ? order.paymentId : "Unpaid"}
                                    </Box>
                                    <Box>
                                        METHOD: {order.method ? order.method : "Unpaid"}
                                    </Box>

                                    <Center
                                        marginTop="20px"
                                        paddingY="15px"
                                        borderRadius="md"
                                        fontWeight="medium"
                                        color="white"
                                        backgroundColor={
                                            order.paid
                                                ? "teal.400"
                                                : "red.400"
                                        }
                                    >
                                        {
                                            order.paid
                                                ? ("Paided at " + (new Date(order.dateOfPayment as string).toLocaleDateString()))
                                                : "Not Paid"
                                        }
                                    </Center>
                                </Box>


                                <Box marginTop="20px">
                                    <Box marginBottom="10px" fontSize="20px" fontWeight="medium" color="gray.400">
                                        ORDER ITEMS
                                    </Box>

                                    {
                                        order.cart.map(product => (
                                            <Box key={product._id} marginY="20px">
                                                <Flex>
                                                    <Box>
                                                        <HStack spacing="20px">
                                                            <Image
                                                                src={product.images[0].url}
                                                                alt={product.title}
                                                                height="70px"
                                                                width="70px"
                                                                objectFit="cover"
                                                                objectPosition="center"
                                                                className='image_radius'
                                                            />
                                                            <Box>
                                                                <Link
                                                                    href={{
                                                                        pathname: '/product/[id]',
                                                                        query: { id: product._id }
                                                                    }}
                                                                    passHref
                                                                >
                                                                    <Box fontWeight="semibold" cursor="pointer">
                                                                        <a>
                                                                            {product.title}
                                                                        </a>
                                                                    </Box>
                                                                </Link>
                                                                <Box fontWeight="semibold" color="tomato">
                                                                    {product.price}$
                                                                </Box>
                                                                <Box color="tomato">
                                                                    In stock: {product.inStock}
                                                                </Box>
                                                            </Box>
                                                        </HStack>
                                                    </Box>
                                                    <Spacer />
                                                    <HStack>
                                                        <Box color="tomato" fontWeight="medium">
                                                            {product.quantity} x {product.price}$ = {product.quantity * product.price}$
                                                        </Box>
                                                    </HStack>
                                                </Flex>
                                                <Box marginY="20px">
                                                    <hr />
                                                </Box>
                                            </Box>
                                        ))
                                    }

                                </Box>
                            </Flex>
                        </GridItem>
                    ))
                }





                {
                    orderDetail.map(order => (
                        <GridItem
                            colSpan={[6, 6, 2, 2]}
                            key={order._id}
                            display={
                                order.paid
                                    ? "none"
                                    : currentUser && currentUser.role === "admin" 
                                        ? "none"
                                        : "block"
                            }
                        >
                            <Box border="1px solid teal" padding="20px" borderRadius="md">
                                <Box >
                                    <Box fontSize="20px" fontWeight="semibold" marginBottom="10px">
                                        TOTAL: <Box as="span" color="tomato">{order.total}$</Box>
                                    </Box>
                                    <PaypalBtn orders={orders} order={order} accessToken={accessToken} />
                                </Box>
                            </Box>
                        </GridItem>
                    ))
                }
            </Grid>
        </>
    );
}

OrderDetail.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

OrderDetail.typeAuth = "loged"


export default OrderDetail