import { MainLayout } from '@/layouts';
import { IUserInfor, NextPageWithLayout } from '@/models/common';
import { useAppSelector } from '@/reduxState/hooks';
import { selectAuth, selectCategories } from '@/reduxState/store';
import { imageUpload } from '@/utils';
import { AspectRatio, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Center, FormControl, FormLabel, Grid, GridItem, HStack, Image, Input, Select, SimpleGrid, Stack, Textarea, Tooltip } from '@chakra-ui/react';
import { UseToast } from 'hooks/useToast';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { BsFillFileEarmarkImageFill } from 'react-icons/bs';
import { IoIosRemoveCircle } from 'react-icons/io';
import { getData, postData, putData } from 'utils/fetchData';

export interface ICreateProductProps {
    user: IUserInfor
}

interface IProductUpdate {
    title: string,
    price: number,
    inStock: number,
    description: string,
    content: string,
    category: string
}

const CreateProduct: NextPageWithLayout = (props: ICreateProductProps) => {
    //Router
    const router = useRouter()

    //Get id product when update porduct 
    const { id } = router.query

    //Toast 
    const toast = UseToast()

    //State
    const [images, setImages] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [onEdit, setOnEdit] = React.useState(false)

    //Initial state infor product
    const [product, setProduct] = React.useState<IProductUpdate>({
        title: "",
        price: 0,
        inStock: 0,
        description: "",
        content: "",
        category: "all"
    })

    //Check if has id product update will set onEdit = true
    React.useEffect(() => {
        if (id) {
            setOnEdit(true)
            getData(`product/${id[0]}`).then(res => {
                setProduct(res.product)
                setImages(res.product.images)
            })
        } else {
            setOnEdit(false)
            setProduct({
                title: "",
                price: 0,
                inStock: 0,
                description: "",
                content: "",
                category: "all"
            })
            setImages([])
        }
    }, [id])

    //Get detail infor of product
    const {
        title,
        price,
        inStock,
        description,
        category,
        content } = product

    //Update state when input chang value
    const handleChangeinput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { name, value } = e.target
        if (name === "price" || name === "inStock") {
            setProduct({
                ...product,
                [name]: parseFloat(value) ? parseFloat(value) : 0
            })
        } else {
            setProduct({
                ...product,
                [name]: value
            })
        }
    }

    //Update state when texera change value
    const handleChangeTexara: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const { name, value } = e.target

        setProduct({
            ...product,
            [name]: value
        })
    }

    //Update state when select change value
    const handleChangeSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const { name, value } = e.target

        setProduct({
            ...product,
            [name]: value
        })
    }

    //Select categories from redux
    const { categories } = useAppSelector(state => selectCategories(state))

    //Select infor current user
    const { currentUser, accessToken } = useAppSelector(state => selectAuth(state))


    //Handle add / change image product
    const addImageProduct: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        let newImages: any[] = []
        let num = 0

        //Set reader to conver image to base 64
        const reader = new FileReader()
        reader.onload = () => {
            setImages([
                ...images,
                reader.result
            ])
        }

        //Chech if has image
        if (e.target.files?.length === 0) {
            return toast.showToast(
                'Inform Upload Image:',
                'Files does not exist.',
                "warning"
            )
        }

        if (e.target.files) {
            const filesLength: number = e.target.files.length as number
            for (let i = 0; i < filesLength; i++) {
                if (e.target.files[i].size > 1024 * 1024) //1Mb
                    return toast.showToast("Inform Change Avatar:", "The largest image size is 1mb.", "error")
                num += 1
                if (num <= 5) newImages.push(e.target.files[i])
                if (num > 5) return toast.showToast(
                    'Inform Upload Image:',
                    'Only up to 5 images can be uploaded.',
                    "warning"
                )
            }
        }
        setImages(newImages)
    }

    //Handle delete images upload
    const handleDeleteImgs = (index: number) => {
        const newImagesProduct = [...images]
        newImagesProduct.splice(index, 1)
        setImages(newImagesProduct)
    }

    //Handle submmit
    const handleSummit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        //Not submmit
        e.preventDefault()

        //Set loading submit
        setLoading(true)

        // Check role is admin
        if (currentUser?.role !== "admin") {
            setLoading(false)

            return toast.showToast(
                'Inform Create Product:',
                'Authentication is x not valid.',
                "warning"
            )
        }

        //Check data lack
        if (
            !title ||
            price === NaN ||
            inStock === NaN ||
            !description ||
            category === "all" ||
            !content ||
            images.length === 0
        ) {
            setLoading(false)

            return toast.showToast(
                'Inform Create Product:',
                'Please add alcl the fields.',
                "warning"
            )
        }

        // Check number of images product
        if (images.length < 2) {
            setLoading(false)

            return toast.showToast(
                'Inform Create Product:',
                'Add at least two product images.',
                "warning"
            )
        }

        //Up Images to cloudinary
        let mediaImages: any[] = []
        const imgNewURL = images.filter(img => !img.url)
        const imgOldURL = images.filter(img => img.url)

        //Check img not yet old url cloudinary (not yet upload to cloud)
        if (imgNewURL.length > 0) mediaImages = await imageUpload(imgNewURL)

        //Create or update porduct
        let res
        if (onEdit) {
            //Update
            res = await putData(`product/${id}`, { ...product, images: [...imgOldURL, ...mediaImages] }, accessToken as string)
        } else {
            //Create
            res = await postData('product', { ...product, images: [...imgOldURL, ...mediaImages] }, accessToken as string)
        }

        if (res.err) {
            setLoading(false)

            return toast.showToast(
                'Inform Create - Update Product:',
                res.err,
                "error"
            )
        }

        //Set data to initial
        setProduct({
            title: "",
            price: 0,
            inStock: 0,
            description: "",
            content: "",
            category: "all"
        })

        //Clear Images
        setImages([])

        //Set loading when excersice 
        setLoading(false)

        return toast.showToast(
            'Inform Create Product:',
            res.msg,
            "success"
        )
    }


    return (
        <>
            <Head>
                <title>Create Product</title>
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
                        Manage Product
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Center>
                <form onSubmit={(e) => handleSummit(e)}>
                    <Stack padding="20px" border="1px solid teal" borderRadius="md" overflow="hidden" position="relative">
                        <FormControl>
                            <FormLabel htmlFor='title'>Title Product</FormLabel>
                            <Input
                                id='title'
                                name="title"
                                type='text'
                                onChange={(e) => handleChangeinput(e)}
                                value={title}
                            />
                        </FormControl>

                        <SimpleGrid columns={2} spacing={10}>
                            <FormControl>
                                <FormLabel htmlFor='price'>Price</FormLabel>
                                <Input
                                    min={0}
                                    id='price'
                                    name='price'
                                    onChange={(e) => handleChangeinput(e)}
                                    value={price}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor='inStock'>inStock</FormLabel>
                                <Input
                                    id='inStock'
                                    min={0}
                                    name="inStock"
                                    onChange={(e) => handleChangeinput(e)}
                                    value={inStock}
                                />
                            </FormControl>
                        </SimpleGrid>

                        <FormControl>
                            <FormLabel htmlFor='content'>Content</FormLabel>
                            <Textarea
                                id='content'
                                name="content"
                                placeholder='Enter content of product'
                                onChange={(e) => handleChangeTexara(e)}
                                value={content}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor='description'>Description</FormLabel>
                            <Textarea
                                id='description'
                                name="description"
                                placeholder='Enter content of product'
                                onChange={(e) => handleChangeTexara(e)}
                                value={description}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor='category'>Category</FormLabel>
                            <Select
                                id='category'
                                name='category'
                                value={category}
                                onChange={(e) => handleChangeSelect(e)}
                            >
                                <option value='all'>All Category</option>
                                {
                                    categories.map(category => (
                                        <option value={category._id} key={category._id}>
                                            {category.name}
                                        </option>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor='imagesProduct'>Add Images</FormLabel>
                            <Tooltip label="Add Images Product">
                                <HStack
                                    as="label"
                                    htmlFor='imagesProduct'
                                    display="flex"
                                    border="1px solid teal"
                                    width="40px"
                                    height="40px"
                                    justifyContent="center"
                                    borderRadius="md"
                                    cursor="pointer"
                                >
                                    <BsFillFileEarmarkImageFill />
                                </HStack>
                            </Tooltip>

                            <Input
                                onChange={(e) => addImageProduct(e)}
                                type="file"
                                id="imagesProduct"
                                name="imagesProduct"
                                display="none"
                                multiple
                                accept="image/*"
                            />
                        </FormControl>

                        <Box></Box>
                        <Grid templateColumns='repeat(4, 1fr)' gap={6}>
                            {
                                images.map((img, index) => (
                                    <GridItem
                                        key={index}
                                        colSpan={index === 0 ? 4 : 1}
                                        position="relative">
                                        <AspectRatio
                                            ratio={1 / 1}
                                        >
                                            <Image
                                                src={img.url ? img.url : URL.createObjectURL(img)}
                                                alt='Images product'
                                                objectFit='cover'
                                                width={index === 0 ? "400px" : "100px"}
                                                height={index === 0 ? "400px" : "100px"}
                                                border="1px solid teal"
                                                borderRadius="md"
                                            />
                                        </AspectRatio>

                                        <Box
                                            color="red"
                                            position="absolute"
                                            top="-2" right="-2"
                                            fontSize="20px"
                                            cursor="pointer"
                                            onClick={() => handleDeleteImgs(index)}
                                        >
                                            <IoIosRemoveCircle />
                                        </Box>
                                    </GridItem>
                                ))
                            }
                        </Grid>

                        <Box></Box>

                        <Button isLoading={loading} type="submit" colorScheme="teal">
                            {
                                onEdit
                                    ? `Save Product`
                                    : `Create Product`
                            }
                        </Button>
                    </Stack>
                </form>
            </Center>
        </>
    );
}

CreateProduct.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const res = await getData('auth/accessToken', "", context.req.headers.cookie)

    if (res.status === 401) {
        return {
            redirect: {
                destination: "/signin",
                permanent: false
            }
        }
    }

    if (res.err || !res.user || res.user.role !== "admin") {
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

export default CreateProduct
