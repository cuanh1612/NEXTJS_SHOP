import { auth_signin_success } from '@/reduxState/actionTypes/authAction';
import { getData } from '@/utils';
import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, HStack, IconButton, useDisclosure, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

export default function DrawerNavbar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement, setPlacement] = React.useState('right')

    //Router
    const router = useRouter()

    //Dispatch
    const dispatch = useDispatch()

    const CheckLoginNavigate = (url: string) => {
        const firstLogin = localStorage.getItem('firstLogin')
        if (firstLogin) {
            getData('auth/accessToken').then(res => {
                if (res.err) {
                    return router.push(url)
                } else {
                    dispatch(auth_signin_success(res.user, res.access_token, null))
                    return router.push('/')
                }
            })
        }
    }

    return (
        <>
            <HStack display={["none", "none", "inline-block"]} spacing="40px">
                <Link href="/signin">
                    <a aria-label="sign in">
                        <Button variant="ghost" borderRadius="20px" colorScheme="teal">
                            Sign in
                        </Button>
                    </a>
                </Link>
                <Link href="/signup">
                    <a aria-label="sign up">
                        <Button variant="outline" borderRadius="20px" colorScheme="teal">
                            Sign up
                        </Button>
                    </a>
                </Link>
            </HStack>

            <Box display={["block", "block", "none"]}>
                <IconButton aria-label='Button menu' icon={<AiOutlineMenu />} colorScheme='teal' variant="outline" onClick={onOpen} />
                <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerBody>
                            <VStack paddingY="40px">
                                <Link href="/signin">
                                    <a aria-label="sign in">
                                        <Button variant="ghost" borderRadius="20px" colorScheme="teal" width="300px" onClick={onClose}>
                                            Sign in
                                        </Button>
                                    </a>
                                </Link>
                                <Link href="/signup">
                                    <a aria-label="sign up">
                                        <Button variant="outline" borderRadius="20px" colorScheme="teal" width="300px" onClick={onClose}>
                                            Sign up
                                        </Button>
                                    </a>
                                </Link>
                            </VStack>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Box>
        </>
    );
}
