import Products from '@/models/productModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import auth from '@/middleware/auth'

connectDB()

const productApi = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "GET":
            return await getProductDetail(req, res)
        case "PUT":
            return await updateProduct(req, res)
        default:
            return res.status(400).json({ err: "Method mot valid." })
    }
}

const getProductDetail = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Get Id product
        const { id } = req.query

        //Get and check product detail has exist
        const product = await Products.findById(id)

        if (!product) return res.status(400).json({ err: 'This product does not exist.' })

        //res product detail
        return res.status(200).json({
            product
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if (result.role !== 'admin' || !result.root)
            return res.status(400).json({ err: 'Authentication is not valid.' })

        //Get id product to update
        const { id } = req.query

        //Get infor of product to update
        const {
            title,
            price,
            inStock,
            description,
            category,
            content,
            images
        } = req.body

        //Check if data lack
        if (
            !title ||
            !price ||
            !inStock ||
            !description ||
            category === "all" ||
            !content ||
            images.length === 0
        )
            return res.status(400).json({ err: "Please add all the fields." })

        await Products.findOneAndUpdate({ _id: id }, {
            title,
            price,
            inStock,
            description,
            category,
            content,
            images
        })

        //Res message success
        res.status(200).json({
            msg: 'Success! Udated a product.'
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default productApi

