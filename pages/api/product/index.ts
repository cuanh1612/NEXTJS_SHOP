import Products from '@/models/productModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import auth from '@/middleware/auth'

connectDB()

const productApi = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "GET":
            return await getProducts(req, res)
        case "POST":
            return await createProduct(req, res)
        default:
            return res.status(400).json({ err: "Method mot valid." })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const products = await Products.find()

        return res.status(200).json({
            status: 'success',
            result: products.length,
            products
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if (result.role !== 'admin' || !result.root)
            return res.status(400).json({ err: 'Authentication is not valid.' })

        //Get infor of product to create
        const {
            title,
            price,
            inStock,
            description,
            category,
            content,
            images
        } = req.body

        console.log({
            title,
            price,
            inStock,
            description,
            category,
            content,
            images
        });


        //Check if data lack
        if (
            !title ||
            price === NaN ||
            inStock === NaN ||
            !description ||
            category === "all" ||
            !content ||
            images.length === 0
        )
            return res.status(400).json({ err: "Please add all the fields." })

        //Create new product
        const newProduct = new Products({
            title: title.toLowerCase(),
            price,
            inStock,
            description,
            category,
            content,
            images
        })

        //Save creaet
        await newProduct.save()

        //Res msg
        res.status(200).json({
            msg: 'Success! Created a new product'
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default productApi