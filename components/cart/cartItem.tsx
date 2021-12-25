import { IProduct } from '@/models/common';
import { Box, Button, Flex, HStack, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { increaseProduct, decreaseProduct } from '@/reduxState/asyncActions/cartAsyncAction'
import { MdDeleteForever } from 'react-icons/md'
import { cart_save_new } from '@/reduxState/actionTypes/CartAction';

export interface IAppProps {
    cart: IProduct[],
    product: IProduct
}

export default function App({ cart, product }: IAppProps) {
    //Dispatch
    const dispatch = useDispatch()

    const { isOpen, onOpen, onClose } = useDisclosure()

    //Handle delete product in cart
    const deleteProduct = () => {
        const newArr: IProduct[] = []
        for (const item of cart) {
            if(item._id !== product._id){
                newArr.push(item)
            }
        }
        dispatch(cart_save_new(newArr))
    }

    return (
        <>
            <hr />
            <Box marginY="20px">
                <Flex direction={["column", "column", "column", "row"]}>
                    <HStack spacing="20px">
                        <Image
                            src={product.images[0].url}
                            alt={product.title}
                            height="70px"
                            width="70px"
                            objectFit="cover"
                            objectPosition="center"
                            borderRadius="lg"
                        />
                        <Box>
                            <Link href={`/product/${product._id}`} passHref>
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
                    <Spacer />
                    <HStack marginTop={["20px", null, null, "0"]}>
                        <HStack>
                            <Button
                                onClick={() => dispatch(increaseProduct(cart, product._id))}
                                disabled={product.quantity === product.inStock ? true : false}
                            >
                                +
                            </Button>
                            <HStack width="40px" borderRadius="lg" border="1px solid gray" justifyContent="center" minHeight="40px">
                                <Box>
                                    {
                                        product.quantity
                                    }
                                </Box>
                            </HStack>
                            <Button
                                onClick={() => dispatch(decreaseProduct(cart, product._id))}
                                disabled={product.quantity === 1 ? true : false}
                            >
                                -
                            </Button>
                        </HStack>
                        <IconButton onClick={onOpen} color="tomato" variant="outline" aria-label='Delete product' icon={<MdDeleteForever />} />
                    </HStack>
                </Flex>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            Are you sure you want to delete the product <Box as="span" color="tomato">{product.title}</Box>?
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='teal' mr={3} onClick={() => deleteProduct()}>
                            Delete
                        </Button>
                        <Button variant='ghost' colorScheme="teal">
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
