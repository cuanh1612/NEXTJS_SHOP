import auth from '@/middleware/auth'
import Orders from '@/models/orderModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "GET") return res.status(400).json({ err: "Method mot valid." })
    try {
        //Check authen
        const result: any = await auth(req, res)
        
        //Check role if role is user will return orders of this user
        //If role is admin will return list all orders
        let orders;
        if(result.role !== 'admin'){
            orders = await Orders.find({user: result.id}).populate('user', '-password')
        }else{
            orders = await Orders.find().populate('user', '-password')
        }

        return res.status(200).json({orders})
       
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default createOrder