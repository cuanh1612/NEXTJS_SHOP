import { MainLayout } from '@/layouts';
import { IProduct, NextPageWithLayout } from '@/models/common';
import { cart_message_clear } from '@/reduxState/actionTypes/CartAction';
import { addProductCart } from '@/reduxState/asyncActions/cartAsyncAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectCart } from '@/reduxState/store';
import { AspectRatio, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, Grid, GridItem, Image, Stack } from '@chakra-ui/react';
import { UseToast } from '@/hooks';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { getData } from 'utils/fetchData';
import { useRouter } from 'next/router';
import Loading from '@/components/common/Loading';

export interface IProductDetailProps {
    product: IProduct
}

const ProductDetail: NextPageWithLayout = ({ product }: IProductDetailProps) => {
    //Router 
    const router = useRouter()

    //Tab image 
    const [tab, setTab] = React.useState(0)

    //Dispatch
    const dispatch = useDispatch()

    //Config inform
    const toast = UseToast()

    //select cart state in redux
    const { products: cart, loading, message } = useAppSelector(state => selectCart(state))

    //Handle add product to cart 
    const addCart = () => {
        dispatch(addProductCart(product, cart))
    }

    //Show message from redux
    React.useEffect(() => {
        if (message) toast.showToast("Inform add cart:", message.description, message.status)
        dispatch(cart_message_clear())
    }, [dispatch, message])

    if (router.isFallback) {
        return <Loading />
    }

    return (
        <>
            <Head>
                <title>Product Detail Page</title>
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
                    <BreadcrumbLink href='#'>Product {product && product.title}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Box>
                <Grid templateColumns='repeat(4, 1fr)' gap={10}>
                    <GridItem colSpan={[4, 4, 2]}>
                        <Grid templateColumns='repeat(9, 1fr)' gap={4}>
                            <GridItem colSpan={[1, 1, 2]} display={["none", "none", "block"]}>
                                <Stack>
                                    {
                                        product && product.images.map((image: any, index: number) => {
                                            return (
                                                <AspectRatio maxW='400px' ratio={4 / 3} key={image.url} onClick={() => setTab(index)} cursor="pointer">
                                                    <Image
                                                        borderRadius="lg"
                                                        src={image.url}
                                                        alt='naruto'
                                                        objectFit='cover'
                                                        border={tab === index ? "2px solid teal" : "none"}
                                                        opacity={tab === index ? "1" : "0.5"}
                                                    />
                                                </AspectRatio>
                                            )
                                        })
                                    }
                                </Stack>
                            </GridItem>

                            <GridItem colSpan={[9, 9, 7]}>
                                <Image borderRadius="lg" src={product && product.images[tab].url} alt="Image detail" width="100%" objectFit='cover' objectPosition="center" height={["450px", "600px", "450px", "500px"]} />
                            </GridItem>

                            <GridItem colSpan={[1, 1, 2]} display={["block", "block", "none"]}>
                                <Stack direction="row">
                                    {
                                        product && product.images.map((image: any, index: number) => {
                                            return (
                                                <Box key={image.url} minWidth="75px" width="75px" height="50px" minHeight="50px">
                                                    <Image
                                                        borderRadius="lg"
                                                        onClick={() => setTab(index)} cursor="pointer"
                                                        src={image.url}
                                                        alt='naruto'
                                                        objectFit='cover'
                                                        border={tab === index ? "2px solid teal" : "none"}
                                                        opacity={tab === index ? "1" : "0.5"}
                                                        width="100%"
                                                        height="100%"
                                                        objectPosition="center"
                                                    />
                                                </Box>
                                            )
                                        })
                                    }
                                </Stack>
                            </GridItem>
                        </Grid>
                    </GridItem>

                    {/* Detail product */}
                    <GridItem colSpan={[4, 4, 2]}>
                        <Box fontWeight="semibold" fontSize="20px">
                            {product && product.title.toUpperCase()}
                        </Box>
                        <Flex>
                            <Box
                                color='gray.500'
                                fontWeight='semibold'
                                letterSpacing='wide'
                                fontSize='xs'
                                textTransform='uppercase'
                            >
                                {product && product.inStock} in stock &bull; {product && product.sold} sold
                            </Box>
                        </Flex>
                        <Box paddingY="20px" color="tomato" fontWeight="semibold" fontSize="20px">
                            {product && product.price}$
                        </Box>
                        <Box>
                            {product && product.description}
                        </Box>
                        <Box marginTop="10px">
                            {product && product.content}
                        </Box>
                        <Button disabled={(product.inStock as number > 0) ? false : true} isLoading={loading} onClick={() => addCart()} marginTop="20px" variant="outline" colorScheme="teal" aria-label='View product detail.' rightIcon={<AiOutlineShoppingCart />}>
                            Add Cart
                        </Button>
                    </GridItem>

                </Grid>
            </Box>
        </>
    );
}

ProductDetail.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

export default ProductDetail


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true
    };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const res = await getData(`product/${params?.id}`)


    if (res.err) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            product: res.product
        },
        revalidate: 10
    }
}