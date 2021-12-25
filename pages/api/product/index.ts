import Products from '@/models/productModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(400).json({ err: "Method mot valid." })
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

export default getProducts