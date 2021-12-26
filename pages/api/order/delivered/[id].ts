import auth from '@/middleware/auth'
import Orders from '@/models/orderModel'
import { connectDB } from '@/utils'
import { UpdateQuery } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const paymentOrder = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "PATCH") return res.status(400).json({ err: "Method mot valid." })
    try {
        const result = await auth(req, res)
        
        //Get Id order
        const {id} = req.query
        
        //Update order to payment
        await Orders.findOneAndUpdate({_id: id}, {
            delivered: true
        } as UpdateQuery<{}>)

        return res.status(200).json({
            msg: `Mark order ${id} delivered success!`
        })
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default paymentOrder