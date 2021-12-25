import Products from '@/models/productModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const getProductDetail = async (req: NextApiRequest, res: NextApiResponse) => {
    //Return err when method not valid
    if (req.method !== "GET") return res.status(400).json({ err: "Method mot valid." })

    //Get Id product
    const { id } = req.query

    try {
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

export default getProductDetail

