import { UseToast } from '@/hooks';
import { MainLayout } from '@/layouts';
import { NextPageWithLayout } from '@/models/common';
import { auth_save_user } from '@/reduxState/actionTypes/authAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectOrder } from '@/reduxState/store';
import { imageUpload, patchData, validSignUp as validUpdate } from '@/utils';
import { Avatar, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, FormControl, FormLabel, Grid, GridItem, Input, Table, TableCaption, Tbody, Td, Tfoot, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { orderAddList } from '@/reduxState/asyncActions/orderAsyncAction'
import { getData } from '@/utils'
import { order_message_clear } from '@/reduxState/actionTypes/orderAction';
import OrderItem from '@/components/common/OrderItem';
import OrderList from '@/components/common/OrderList';

export interface IProfileProps {
}

const Profile: NextPageWithLayout = (props: IProfileProps) => {
    //dispatch
    const dispatch = useDispatch()

    //Get data current user and accesstoken
    const { currentUser, accessToken } = useAppSelector(state => selectAuth(state))

    //Get erro from order redux and show message when have 
    const { message: messageOrder, orders } = useAppSelector(state => selectOrder(state))
    React.useEffect(() => {
        if (messageOrder) toast.showToast("Inform get orders:", messageOrder.description, messageOrder.status)
        dispatch(order_message_clear())
        return
    }, [messageOrder])

    //Get orders by dispatch
    React.useEffect(() => {
        dispatch(orderAddList(accessToken as string))
    }, [])

    //State loading for update infor 
    const [loadProfile, setLoadProfile] = React.useState(false)

    //Setup toast
    const toast = UseToast()

    //State detai profile
    const [dataProfile, setDataProfile] = React.useState({
        name: currentUser?.name,
        avatar: currentUser?.avatar,
        email: currentUser?.email,
        password: '',
        cf_password: ''
    })

    //Set again data profile when updated
    React.useEffect(() => {
        setDataProfile({
            name: currentUser?.name,
            avatar: currentUser?.avatar,
            email: currentUser?.email,
            password: '',
            cf_password: ''
        })
    }, [currentUser])

    //Handle change profile
    const changeProfile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setDataProfile({
            ...dataProfile,
            [e.target.name]: e.target.value
        })
    }

    //Handle change image
    const changeAvata: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
            setDataProfile({
                ...dataProfile,
                avatar: reader.result
            })
        }
        if (e.target.files) {
            if (!e.target.files[0]) return
            if (e.target.files[0].size > 1024 * 1024) //1Mb
                return toast.showToast("Inform Change Avatar:", "The largest image size is 1mb.", "error")
            reader.readAsDataURL(e.target.files[0])
        }
    }

    //Handle update profile 
    const handleUpdateProfile = async () => {
        //Set Loading profile true
        setLoadProfile(true)

        //Update password
        if (dataProfile.password !== "") {
            const errMsg = validUpdate({
                name: dataProfile.name,
                email: dataProfile.email as string,
                password: dataProfile.password,
                cf_password: dataProfile.cf_password
            })

            if (errMsg) {
                setLoadProfile(false)
                return toast.showToast("Inform Update:", errMsg, "error")
            }

            await patchData('user/resetPassword', { password: dataProfile.password }, accessToken as string).then(res => {
                setLoadProfile(false)
                if (res.err) return toast.showToast("Inform Update:", res.err, "error")
                return toast.showToast("Inform Update:", "Update password success!", "success")
            })
            return
        }

        //Update image and user name
        if (dataProfile.name !== currentUser?.name && dataProfile.name !== "" || dataProfile.avatar !== currentUser?.avatar) return updateInfor()

        setLoadProfile(false)
        return toast.showToast("Inform Update:", "Please change infor profile.", "warning")
    }

    //Update Image and user name
    const updateInfor = async () => {
        //Check username is empaty
        if (dataProfile.name === "") return toast.showToast("Inform Update:", "Please enter username!", "warning")

        //Upimage to cloudinary
        const media = await imageUpload([dataProfile.avatar])

        //If have url cloudinary
        if (media) {
            //Update name and image to dabase
            await patchData(
                'user',
                {
                    name: dataProfile.name, avatar: media[0].url
                },
                accessToken as string
            ).then(async (res) => {
                setLoadProfile(false)
                if (res.err) return toast.showToast("Inform Update:", res.err, "error")
                await dispatch(auth_save_user(res.user))
                return toast.showToast("Inform Update:", "Upadate profile success!", "success")
            })
        }
    }


    return (
        <>
            <Head>
                <title>Profile Page</title>
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
                        {currentUser && currentUser.role === "user" ? "User" : "Admin"} Profile
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>



            <Grid
                templateColumns='repeat(5, 1fr)'
                gap={4}
            >
                {/* Detail profile */}
                <GridItem colSpan={[5, 5, 5, 2]} border="1px solid teal" borderRadius="md" overflow="hidden" position="relative">
                    <Box position="relative">
                        <Box height="150px" position="relative">
                            <Image objectFit="cover" objectPosition="center" layout='fill' src={`https://source.unsplash.com/random/?forest`} alt='background profile' />
                        </Box>
                        <Box position="absolute" bottom="-35px" left="10px">
                            <Box position="relative">
                                <Avatar
                                    size='lg'
                                    name='Christian Nwamba'
                                    src={dataProfile?.avatar}
                                    border="2px solid white"
                                />
                                <Box
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    as="label"
                                    width="65px" height="100%"
                                    htmlFor="avatar"
                                    cursor="pointer"
                                />
                                <Input
                                    id="avatar"
                                    type='file'
                                    accept="image/*"
                                    display="none"
                                    onChange={(e) => changeAvata(e)}
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
                                    defaultValue={dataProfile?.name}
                                    onChange={(e) => changeProfile(e)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor='email'>Email address</FormLabel>
                                <Input disabled id='email' type='email' defaultValue={dataProfile?.email} />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor='password'>New Password</FormLabel>
                                <Input
                                    id='password'
                                    type='password'
                                    name="password"
                                    onChange={(e) => changeProfile(e)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor='cf_password'>Conform Password</FormLabel>
                                <Input
                                    id='cf_password'
                                    type='password'
                                    name="cf_password"
                                    onChange={(e) => changeProfile(e)}
                                />
                            </FormControl>
                        </VStack>

                        <Button isLoading={loadProfile} marginTop="20px" colorScheme="teal" onClick={handleUpdateProfile}>
                            Save Change
                        </Button>
                    </Box>
                </GridItem>

                {/* List orders */}
                <GridItem colSpan={[5, 5, 5, 3]}  >
                    <OrderList orders={orders}/>
                </GridItem>
            </Grid>
        </>
    );
}


Profile.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

Profile.typeAuth = "loged"

export default Profile