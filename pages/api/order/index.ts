import auth from '@/middleware/auth'
import { IProduct } from '@/models/common'
import Orders from '@/models/orderModel'
import Products from '@/models/productModel'
import { connectDB } from '@/utils'
import { UpdateQuery } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
    
    if (req.method !== "POST") return res.status(400).json({ err: "Method mot valid." })
    
    try {
        const result: any = await auth(req, res)
        
        const {address, mobile, cart, total} = req.body as {
            address: string,
            mobile: number,
            cart: IProduct[],
            total: number
        }  
        

        const newOrder = new Orders({
            user: result.id, address, mobile, cart, total
        })

        
        cart.filter(item => {
            return sold(item._id, item.quantity, item.inStock, item.sold )
        })

        await newOrder.save()

        return res.status(200).json({
            msg: 'Order success! we will contact you to confirm the order.',
            newOrder: newOrder
        })
        
       
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

const sold = async(id: string, quantity: number, oldInStock: number, oldSold: number) => {
    await Products.findOneAndUpdate({_id: id}, {
        inStock: oldInStock - quantity,
        sold: quantity + oldSold
    } as UpdateQuery<{inStock: number, sold: number}>)

}

export default createOrder