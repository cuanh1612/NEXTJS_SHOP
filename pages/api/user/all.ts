import auth from '@/middleware/auth'
import { IUserInfor } from '@/models/common'
import Users from '@/models/userModel'
import { connectDB } from '@/utils'
import { UpdateQuery } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const getAllUsers = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(400).json({ err: "Method mot valid." })
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if(result.role !== 'admin')
            return res.status(400).json({err: 'Authentication is not valid.'})

        //If user has role is admin then get all user
        const users = await Users.find().select('-password')
        
        //Return list all users
        res.status(200).json({users})

       
       
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}


export default getAllUsers