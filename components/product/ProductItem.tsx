import { UseToast } from '@/hooks';
import { IProduct } from '@/models/common';
import { addProductCart } from '@/reduxState/asyncActions/cartAsyncAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectCart, selectCategories } from '@/reduxState/store';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AspectRatio, Badge, Box, Button, Checkbox, Flex, HStack, IconButton, Image, Spacer } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { AiOutlineEye, AiOutlineShoppingCart } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { deleteData } from 'utils/fetchData';

export interface IProductItemProps {
    product: IProduct
    handleCheck: (id: string) => void
}

export default function ProductItem({ product, handleCheck }: IProductItemProps) {
    //State
    const [isLoadingDelete, setIsLoadingDelete] = React.useState(false)

    //Setup dialog delete user
    const [isOpen, setIsOpen] = React.useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef()

    //Dispatch
    const dispatch = useDispatch()

    //Config inform
    const toast = UseToast()

    //select cart state in redux
    const { products: cart, loading } = useAppSelector(state => selectCart(state))

    //select infor current user state in redux
    const { currentUser, accessToken } = useAppSelector(state => selectAuth(state))

    //Select categories from redux
    const {categories} = useAppSelector(state => selectCategories(state))

    //Handle add product to cart 
    const addCart = () => {
        dispatch(addProductCart(product, cart))
    }

    //Handle delete product
    const deleteProduct = async (id: string) => {
        setIsLoadingDelete(true)
        await deleteData(`product/${id}`, accessToken as string).then(res => {
            if (res.err) return toast.showToast("Inform Delete Product:", res.err, "error")
            return toast.showToast("Inform Delete Product:", res.msg, "success")
        })
        setIsLoadingDelete(false)
        onClose()
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
            <Box>

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
                        onClick={() => setIsOpen(true)}
                    >
                        Delete
                    </Button>
                </HStack>



                {/* Dialog display when user enter delete button */}
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef as React.RefObject<any>}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Product <Box as="span" color="tomato">{product._id}</Box> :
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                {`Are you sure? You can't undo this action afterwards.`}
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef as React.LegacyRef<any>} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button isLoading={isLoadingDelete} colorScheme='red' onClick={() => deleteProduct(product._id)} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        )
    }

    return (
        <Box position="relative">
            {
                currentUser && currentUser.role === 'admin' && (
                    <Checkbox
                        size='lg'
                        colorScheme='teal'
                        position="absolute"
                        top="0"
                        left="0"
                        zIndex="1"
                        background="white"
                        isChecked={product.checked}
                        onChange={() => handleCheck(product._id)}
                    />
                )
            }

            <Box position="relative" maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                <Box>
                    <AspectRatio maxW='500px' maxH='350px' ratio={1} marginX="auto">
                        <Image src={product.images[0].url} alt={product.title} />
                    </AspectRatio>
                </Box>

                <Box p='6'>
                    <Box display='flex' alignItems='baseline'>
                        <Badge borderRadius='full' px='2' colorScheme='teal'>
                            {
                                categories.map(category => {
                                    if(category._id === product.category){
                                        return (
                                            <Box>
                                                {
                                                    category.name
                                                }
                                            </Box>
                                        )
                                    }
                                })
                            }
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
        </Box>
    );
}
