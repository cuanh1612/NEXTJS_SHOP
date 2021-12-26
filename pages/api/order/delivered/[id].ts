import auth from '@/middleware/auth'
import { Iorder } from '@/models/common'
import Orders from '@/models/orderModel'
import { connectDB } from '@/utils'
import { UpdateQuery } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const paymentOrder = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "PATCH") return res.status(400).json({ err: "Method mot valid." })
    try {
        const result = await auth(req, res)

        //Check if user is admin
        if (result?.role !== "admin")
            return res.status(400).json({ err: 'Authentication is not valid.' })

        //Get Id order        
        const { id } = req.query

        //Get order 
        const order: Partial<Iorder> = await Orders.findOne({ _id: id })
        
        //Check if order delivered
        if (order.paid) {
            //Update order to payment
            await Orders.findOneAndUpdate({ _id: id }, {
                delivered: true
            } as UpdateQuery<{}>)

            return res.status(200).json({
                msg: `Mark order ${id} delivered success!`,
                result: {
                    delivered: true
                }
            })
        } else {
            //Update order to payment
            await Orders.findOneAndUpdate({ _id: id }, {
                paid: true,
                dateOfPayment: new Date().toISOString(),
                method: 'Receive Cash',
                delivered: true
            } as UpdateQuery<{}>)

            return res.status(200).json({
                msg: `Mark order ${id} delivered success!`,
                result:{
                    paid: true,
                    dateOfPayment: new Date().toISOString(),
                    method: 'Receive Cash',
                    delivered: true
                }
            })
        }

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default paymentOrder