import Loading from '@/components/common/Loading';
import UserList from '@/components/common/UsersItem';
import { MainLayout } from '@/layouts';
import { IMessage, IUserInfor, NextPageWithLayout } from '@/models/common';
import { users_message_clear } from '@/reduxState/actionTypes/usersAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectUsers } from '@/reduxState/store';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Center, FormControl, FormLabel, Input, InputGroup, InputRightElement, Table, TableCaption, Tbody, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { UseToast } from 'hooks/useToast';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { getData } from 'utils/fetchData';

export interface IUsersProps {
    user: IUserInfor
}

const Categories: NextPageWithLayout = ({user}: IUsersProps) => {
    //router
    const router = useRouter()

    //Toast Hook
    const toast = UseToast()

    //Dispatch 
    const dispatch = useDispatch()

    //Get all users from redux
    const { users, loading } = useAppSelector(state => selectUsers(state))

    //Get infor current admin
    const { currentUser, accessToken, firstLoading } = useAppSelector(state => selectAuth(state))
    const { message } = useAppSelector(state => selectUsers(state))

    //Show message of user redux
    React.useEffect(() => {
        if (message) {
            toast.showToast(
                "Inform delete user:",
                message.description,
                message.status
            )

            dispatch(users_message_clear())
        }
    }, [message, dispatch, toast])

    return (
        <>
            <Head>
                <title>Manage Categories Page</title>
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
                    <BreadcrumbLink href='#'>
                        Manage Categories
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            {/* Detail profile */}
            <Center>
                <Box width="600px" border="1px solid teal" borderRadius="md" overflow="hidden" position="relative">
                    <Box padding="20px">
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                placeholder='Enter Category Name'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm'>
                                    Create
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                </Box>
            </Center>

        </>
    );
}

Categories.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}


export default Categories

export const getServerSideProps: GetServerSideProps = async(context) => {
    const cookie = context.req.headers.cookie
    const res = await getData('auth/accessToken', "", cookie!)

    if(res.status === 401){
        return {
            redirect: {
                destination: "/signin",
                permanent: false
            }
        }
    }

    if(res.err || !res.user || res.user.role !== 'admin') {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    
    return {
        props: {
            user: res.user
        }
    }
}