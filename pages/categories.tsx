import CategoriesItem from '@/components/common/CategoriesItem';
import { MainLayout } from '@/layouts';
import { ICategory, IUserInfor, NextPageWithLayout } from '@/models/common';
import { categories_message_clear } from '@/reduxState/actionTypes/categoriesAction';
import { addCategory, deleteItemCategories, updateCategories } from '@/reduxState/asyncActions/categoriesAsyncAction';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectCategories } from '@/reduxState/store';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Center, HStack, Input } from '@chakra-ui/react';
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

const Categories: NextPageWithLayout = ({ user }: IUsersProps) => {
    //router
    const router = useRouter()

    //Toast Hook
    const toast = UseToast()

    //Dispatch 
    const dispatch = useDispatch()

    //State
    const [nameCategory, setNameCategory] = React.useState("")
    const [idCatUpdate, setIdCatUpdate] = React.useState("")

    //Get data categories from redux
    const { categories, loading, message } = useAppSelector(state => selectCategories(state))

    //Get accessToken
    const { accessToken } = useAppSelector(state => selectAuth(state))

    //Handle create or update category
    const createUpdateCategory: React.FormEventHandler<HTMLFormElement> = async (e) => {
        //Not submit to server
        e.preventDefault()

        //Check valid name
        if (!nameCategory || nameCategory.length < 6) {
            return toast.showToast('Inform create category:', "The category name cannot be blank and has more than 6 characters.", "warning")
        }

        if (!idCatUpdate) {
            await dispatch(addCategory(categories, nameCategory, accessToken as string))
        }

        if (idCatUpdate) {
            await dispatch(updateCategories(categories, nameCategory, idCatUpdate, accessToken as string))
            setIdCatUpdate("")
        }
    }

    //Handle delete category
    const deleteCategory = async (idDelete: string) => {
        await dispatch(deleteItemCategories(categories, idDelete, accessToken as string))
    }

    //Check if has message category and show when has any message
    React.useEffect(() => {
        if (message) {
            toast.showToast('Inform Manage Categories:', message.description, message.status)
            dispatch(categories_message_clear())
            setNameCategory("")
        }
    }, [message, dispatch, toast])

    //Handle edit category
    const handleEditCategory = async (category: ICategory) => {
        await setIdCatUpdate(category._id)
        await setNameCategory(category.name)
    }



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
                <Box padding="20px" width="600px" border="1px solid teal" borderRadius="md" overflow="hidden" position="relative">
                    <form onSubmit={(e) => createUpdateCategory(e)}>
                        <HStack>
                            <Input placeholder='Enter Category Name ' size='md' value={nameCategory} onChange={(e) => setNameCategory(e.target.value)} />
                            <Button
                                colorScheme="teal"
                                isDisabled={
                                    (!nameCategory)
                                }
                                isLoading={loading}
                                type="submit"
                            >
                                {
                                    idCatUpdate
                                        ? `Update`
                                        : `Create`
                                }
                            </Button>
                        </HStack>
                    </form>

                    {
                        categories.map(category => (
                            <CategoriesItem
                                key={category._id}
                                category={category}
                                handleEditCategory={handleEditCategory}
                                deleteCategory={deleteCategory}
                                loading={loading}
                            />
                        ))
                    }
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookie = context.req.headers.cookie
    const res = await getData('auth/accessToken', "", cookie!)

    if (res.status === 401) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false
            }
        }
    }

    if (res.err || !res.user || res.user.role !== 'admin') {
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