import { IProduct } from '@/models/common';
import { cart_message_clear } from '@/reduxState/actionTypes/CartAction';
import { addProductCart } from '@/reduxState/asyncActions/cartAsyncAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectCart } from '@/reduxState/store';
import { Box, Image, Badge, AspectRatio, Flex, Spacer, IconButton, Button, HStack } from '@chakra-ui/react';
import { UseToast } from '@/hooks';
import Link from 'next/link';
import * as React from 'react';
import { AiOutlineEye, AiOutlineShoppingCart } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

export interface IProductItemProps {
    product: IProduct
}

export default function ProductItem({ product }: IProductItemProps) {

    //Dispatch
    const dispatch = useDispatch()

    //Config inform
    const toast = UseToast()

    //select cart state in redux
    const { products: cart, loading } = useAppSelector(state => selectCart(state))

    //select infor current user state in redux
    const { currentUser } = useAppSelector(state => selectAuth(state))

    //Handle add product to cart 
    const addCart = () => {
        dispatch(addProductCart(product, cart))
    }

    //User link 
    const userLink = () => {
        return (
            <Flex marginTop="20px">
                <Link href={`/product/${product._id}`}>
                    <a>
                        <IconButton variant="outline" colorSchema="teal" aria-label='View product detail.' icon={<AiOutlineEye />} />
                    </a>
                </Link>
                <Spacer />
                <Button disabled={(product.inStock > 0) ? false : true} isLoading={loading} onClick={() => addCart()} variant="outline" colorScheme="teal" aria-label='View product detail.' rightIcon={<AiOutlineShoppingCart />}>
                    Add Cart
                </Button>
            </Flex>
        )
    }

    //Admin link 
    const adminLink = () => {
        return (
            <HStack marginTop="20px">
                <Link href={`/create/${product._id}`}>
                    <a>
                        <Button
                            variant="outline"
                            colorScheme="teal"
                            aria-label='View product detail.'
                        >
                            Update
                        </Button>
                    </a>
                </Link>
                <Spacer />
                <Button
                    variant="outline"
                    colorScheme="red"
                    aria-label='View product detail.'
                >
                    Delete
                </Button>
            </HStack>
        )
    }

    return (
        <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
            <Box>
                <AspectRatio maxW='500px' maxH='350px' ratio={1} marginX="auto">
                    <Image src={product.images[0].url} alt={product.title} />
                </AspectRatio>
            </Box>

            <Box p='6'>
                <Box display='flex' alignItems='baseline'>
                    <Badge borderRadius='full' px='2' colorScheme='teal'>
                        Animal
                    </Badge>

                    <Spacer />

                    <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='xs'
                        textTransform='uppercase'
                        ml='2'
                    >
                        {product.inStock} in stock &bull; {product.sold} sold
                    </Box>
                </Box>

                <Flex marginTop="10px">
                    <Box
                        mt='1'
                        fontWeight='semibold'
                        as='h4'
                        lineHeight='tight'
                        isTruncated
                    >
                        {product.title}
                    </Box>

                    <Spacer />

                    <Box color="tomato" fontWeight="medium">
                        {product.price}$
                    </Box>
                </Flex>

                {/* user or admin link */}
                {
                    currentUser?.role === "admin"
                        ? adminLink()
                        : userLink()
                }
            </Box>
        </Box>
    );
}
