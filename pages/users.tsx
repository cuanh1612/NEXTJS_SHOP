import { MainLayout } from '@/layouts';
import { NextPageWithLayout } from '@/models/common';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectUsers } from '@/reduxState/store';
import { Avatar, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, HStack, IconButton, Table, TableCaption, Tbody, Td, Tfoot, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { MdOutlineDangerous } from 'react-icons/md';
import { GrDocumentUpdate } from 'react-icons/gr'
import { AiOutlineDelete } from 'react-icons/ai'
import UserList from '@/components/common/UsersItem';

export interface IUsersProps {
}

const Users: NextPageWithLayout = (props: IUsersProps) => {
    //Get all users from redux
    const { users } = useAppSelector(state => selectUsers(state))

    //Get infor current admin
    const { currentUser } = useAppSelector(state => selectAuth(state))

    console.log("All users from redux", users);

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
                                <UserList user={user} key={user._id} index={index} currentUser={currentUser}/>
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