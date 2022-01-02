import { MainLayout } from '@/layouts';
import { IUserInfor, NextPageWithLayout } from '@/models/common';
import { userUpdateItem } from '@/reduxState/asyncActions/usersAsyncAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectUsers } from '@/reduxState/store';
import { patchData } from '@/utils';
import { Avatar, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Center, Checkbox, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { UseToast } from 'hooks/useToast';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useDispatch } from 'react-redux';

export interface IEditUserProps {
}

const EditUser: NextPageWithLayout = (props: IEditUserProps) => {
    //Toast hook
    const toast = UseToast()

    //Dispatch
    const dispatch = useDispatch()

    //Get ifor admin current
    const { currentUser, accessToken } = useAppSelector(state => selectAuth(state))
    const { users } = useAppSelector(state => selectUsers(state))

    //State
    const [detailUserUpdate, setDetailUserUpdate] = React.useState<IUserInfor>({})
    const [checkAdmin, setCheckAdmin] = React.useState(false)
    const [loadingUpdate, setLoadingUpdate] = React.useState(false)

    //Router
    const router = useRouter()

    //Get ID user need udpate
    const { id } = router.query

    //get detail user update and check if admin
    React.useEffect(() => {
        users.forEach(user => {
            if (user._id === id) {
                setDetailUserUpdate(user)
                setCheckAdmin(user.role === "admin" ? true : false)
            }
        })
    }, [users, id])

    //Handle change role
    const handleCheck = () => {
        setCheckAdmin(!checkAdmin)
    }

    //Handle Submit
    const handleSubmit = async () => {
        setLoadingUpdate(true)
        let role = checkAdmin ? "admin" : "user"

        //Update user role in database
        const res = await patchData(`user/${detailUserUpdate._id}`, { role }, accessToken as string)
        setLoadingUpdate(false)
        if (res.err) return toast.showToast("Infrom update user's role:", res.err, "error")

        //Update user role in redux
        dispatch(userUpdateItem(users, detailUserUpdate._id, {
            ...detailUserUpdate,
            role
        }))
        return toast.showToast("Infrom update user's role:", res.msg, "success")
    }

    return (
        <>
            <Head>
                <title>Edit User Page</title>
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
                    <Link href='/users' passHref>
                        <BreadcrumbLink>
                            <a>
                                Users
                            </a>
                        </BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Edit User</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            {/* Detail profile */}
            <Center>
                <Box width="600px" border="1px solid teal" borderRadius="md" overflow="hidden" position="relative">
                    <Box position="relative">
                        <Box height="150px" position="relative">
                            <Image objectFit="cover" objectPosition="center" layout='fill' src={`https://source.unsplash.com/random/?forest`} alt='background profile' />
                        </Box>
                        <Box position="absolute" bottom="-35px" left="10px">
                            <Box position="relative">
                                <Avatar
                                    size='lg'
                                    name='Christian Nwamba'
                                    src={detailUserUpdate?.avatar}
                                    border="2px solid white"
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box padding="20px">
                        <VStack marginTop="30px">
                            <FormControl>
                                <FormLabel htmlFor='name'>User Name</FormLabel>
                                <Input
                                    id='name'
                                    name='name'
                                    type='text'
                                    disabled
                                    defaultValue={detailUserUpdate?.name}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor='email'>Email address</FormLabel>
                                <Input disabled id='email' type='email' defaultValue={detailUserUpdate?.email} />
                            </FormControl>
                        </VStack>
                        <Checkbox onChange={() => handleCheck()} isChecked={checkAdmin} marginTop="20px">Is Admim</Checkbox>

                        <br />

                        <Button
                            onClick={() => handleSubmit()}
                            isLoading={loadingUpdate}
                            isDisabled={
                                (detailUserUpdate.role === "admin")
                                    ? checkAdmin
                                        ? true
                                        : false
                                    : !checkAdmin
                                        ? true
                                        : false
                            }
                            marginTop="20px"
                            colorScheme="teal"
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Center>


        </>
    );
}

EditUser.getLayout = function getLayout(page: React.ReactNode) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

EditUser.typeAuth = "loged"

export default EditUser