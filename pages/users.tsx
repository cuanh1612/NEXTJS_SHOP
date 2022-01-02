import UserList from '@/components/common/UsersItem';
import { MainLayout } from '@/layouts';
import { IUserInfor, NextPageWithLayout } from '@/models/common';
import { users_message_clear } from '@/reduxState/actionTypes/usersAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectUsers } from '@/reduxState/store';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Table, TableCaption, Tbody, Tfoot, Th, Thead, Tr } from '@chakra-ui/react';
import { UseToast } from 'hooks/useToast';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import { useDispatch } from 'react-redux';

export interface IUsersProps {
}

const Users: NextPageWithLayout = (props: IUsersProps) => {
    //Toast Hook
    const toast = UseToast()
    //Dispatch 
    const dispatch = useDispatch()

    //Get all users from redux
    const { users, loading } = useAppSelector(state => selectUsers(state))

    //Get infor current admin
    const { currentUser, accessToken } = useAppSelector(state => selectAuth(state))
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
    }, [message])

    return (
        <>
            <Head>
                <title>Manage Users Page</title>
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
                        Manage Users
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>


            <Box border="1px solid teal" borderRadius="md" overflowX="auto">
                <Table variant='simple' >
                    <TableCaption>Imperial to metric conversion factors</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>No</Th>
                            <Th>ID</Th>
                            <Th>Avatar</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Admin</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            users.map((user, index) => (
                                <UserList
                                    user={user}
                                    key={user._id}
                                    index={index}
                                    currentUser={currentUser as Partial<IUserInfor>}
                                    accessToken={accessToken as string}
                                />
                            ))
                        }

                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>No</Th>
                            <Th>ID</Th>
                            <Th>Avatar</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Admin</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </Box>

        </>
    );
}

Users.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

Users.typeAuth = "loged"

export default Users