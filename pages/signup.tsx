import { UseToast } from '@/hooks'
import { MainLayout } from "@/layouts"
import { NextPageWithLayout } from '@/models/common'
import { auth_message_clear } from '@/reduxState/actionTypes/authAction'
import { signUpUser } from '@/reduxState/asyncActions/authAsyncAction'
import { useAppSelector } from "@/reduxState/hooks"
import { selectAuth } from "@/reduxState/store"
import { getData, validSignUp } from '@/utils'
import { Box, Button, Center, FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { ChangeEventHandler, ReactElement, useState } from "react"
import { useDispatch } from "react-redux"

export interface ISignUp {
}
const SignUp: NextPageWithLayout = (props: ISignUp) => {
    //Router
    const router = useRouter()

    //Config inform with hook custom UseToast
    const toast = UseToast()

    //Dispatch
    const dispatch = useDispatch()

    //Selector state
    const { loading, message, currentUser } = useAppSelector(selectAuth)

    //Show error from redux
    React.useEffect(() => {
        if (message) toast.showToast("Inform sign up:", message.description, message.status)
        dispatch(auth_message_clear())
    }, [dispatch, message])

    //Initial state for infor sign up
    const initialState = {
        name: "",
        email: "",
        password: "",
        cf_password: ""
    }

    const [userData, setUserData] = useState(initialState)

    const handleChangeInput: ChangeEventHandler<HTMLInputElement> = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }

    const { name, email, password, cf_password } = userData

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        //Check valid infor sign up
        const errMsg = validSignUp({ name, email, password, cf_password })
        if (errMsg) return toast.showToast("Inform sign up:", errMsg, "warning")

        dispatch(signUpUser({ name, email, password, cf_password }))
    }

    return (
        <>
            <Head>
                <title>Sign Up Page</title>
            </Head>
            <Box className='signinup' height="calc(100vh - 80px)">
                <Center>
                    <Box width="400px" backgroundColor="white" padding="20px" margin="20px" shadow="lg" marginTop={["20px", "20px", "100px"]}>
                        <Box marginBottom="20px">
                            <Box fontSize="25px" fontWeight="500">
                                Sign up with your email
                            </Box>
                            <Box fontSize="15px">
                                Already have an account?
                                <Button marginLeft="5px" color="teal" variant='link'>
                                    <Link href="/signin">
                                        <a>
                                            Sign Up
                                        </a>
                                    </Link>
                                </Button>
                            </Box>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <FormControl id='name' marginY="10px">
                                <FormLabel>Your name</FormLabel>
                                <Input type='text' placeholder="Enter your name" name="name" value={name} onChange={handleChangeInput} />
                                <FormHelperText></FormHelperText>
                            </FormControl>

                            <FormControl id='email' marginY="10px">
                                <FormLabel>Email address</FormLabel>
                                <Input type='email' placeholder="Example@gamil.com" name="email" value={email} onChange={handleChangeInput} />
                                <FormHelperText></FormHelperText>
                            </FormControl>

                            <FormControl id='password' marginY="10px">
                                <FormLabel>Your password</FormLabel>
                                <Input type='password' placeholder="Enter your password" name="password" value={password} onChange={handleChangeInput} autoComplete="password" />
                                <FormHelperText></FormHelperText>
                            </FormControl>

                            <FormControl id='cf_password' marginY="10px">
                                <FormLabel>Comform your password</FormLabel>
                                <Input type='password' placeholder="Re-enter your password" name="cf_password" value={cf_password} onChange={handleChangeInput} autoComplete="cf_password" />
                                <FormHelperText></FormHelperText>
                            </FormControl>
                            <Button
                                colorScheme='teal'
                                type='submit'
                                marginY="10px"
                                isLoading={loading}
                            >
                                Sign Up
                            </Button>
                        </form>
                    </Box>
                </Center>
            </Box>
        </>
    )
}

SignUp.getLayout = function getLayout(page: ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

SignUp.typeAuth = "notLoged"

export default SignUp