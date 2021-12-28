import { MainLayout } from "@/layouts";
import { IUserInfor, NextPageWithLayout } from '@/models/common';
import { auth_message_clear } from "@/reduxState/actionTypes/authAction";
import { signInUser } from '@/reduxState/asyncActions/authAsyncAction';
import { useAppSelector } from "@/reduxState/hooks";
import { selectAuth } from "@/reduxState/store";
import { Box, Button, Center, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react';
import { UseToast } from "hooks/useToast";
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from "next/router";
import * as React from 'react';
import { ReactElement } from 'react';
import { useDispatch } from "react-redux";

const SignIn: NextPageWithLayout = () => {
    //Router
    const router = useRouter()

    //Config inform
    const toast = UseToast()

    //Dispatch
    const dispatch = useDispatch()

    //Selector state
    const { loading, message, currentUser } = useAppSelector(selectAuth)

    //Show message from redux
    React.useEffect(() => {
        if (message) toast.showToast("Inform sign up:", message.description, message.status)
        dispatch(auth_message_clear())
    }, [dispatch, message])

    //Initial state for infor sign up
    const initialState: IUserInfor = {
        email: "",
        password: ""
    }

    const [userData, setUserData] = React.useState(initialState)

    const { email, password } = userData

    //Change state when change value input
    const handleChangeInput: React.ChangeEventHandler<HTMLInputElement> = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }

    //Handle submit
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        if (!email && !password) return toast.showToast("Inform sign in:", "Please add all fields.", "warning")

        dispatch(signInUser({ email, password }))

        if (currentUser) {
            return router.push('/')
        }
    }

    return (
        <>
            <Head>
                <title>Sign In Page</title>
            </Head>
            <Box className='signinup' height="calc(100vh - 80px)">
                <Center>
                    <Box width="400px" backgroundColor="white" padding="20px" margin="20px" shadow="lg" marginTop="100px">
                        <Box marginBottom="20px">
                            <Box fontSize="25px" fontWeight="500">
                                Sign in with your email
                            </Box>
                            <Box fontSize="15px">
                                Not have account?
                                <Button marginLeft="5px" color="teal" variant='link'>
                                    <Link href="/signup">
                                        <a>
                                            Sign Up
                                        </a>
                                    </Link>
                                </Button>
                            </Box>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <FormControl id='email' marginY="10px">
                                <FormLabel>Email address</FormLabel>
                                <Input type='email' placeholder="Example@gamil.com" name="email" value={email} onChange={handleChangeInput} />
                                <FormHelperText></FormHelperText>
                            </FormControl>

                            <FormControl id='password' marginY="10px">
                                <FormLabel>Your password</FormLabel>
                                <Input type='password' placeholder="Enter your password" name="password" value={password} onChange={handleChangeInput} />
                                <FormHelperText></FormHelperText>
                            </FormControl>
                            <Button
                                colorScheme='teal'
                                type='submit'
                                marginY="10px"
                                isLoading={loading}
                            >
                                Sign In
                            </Button>
                        </form>
                    </Box>
                </Center>
            </Box>
        </>
    );
}

SignIn.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

SignIn.typeAuth = "notLoged"

export default SignIn