import auth from '@/middleware/auth'
import { IUserInfor } from '@/models/common'
import Users from '@/models/userModel'
import { connectDB } from '@/utils'
import { UpdateQuery } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const uploadInfor = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "PATCH") return res.status(400).json({ err: "Method mot valid." })
    try {
        const result: any = await auth(req, res)
        const {name, avatar} = req.body
        
        //Update image and namge
        await Users.findOneAndUpdate(
            {_id: result.id}, 
            {name, avatar} as UpdateQuery<IUserInfor>
        )

        //Get user infor after update
        const getUser = await Users.findById(result.id).select("-password")
        
        //Reterun user
        res.status(200).json({
            msg: "Update Success!",
            user: getUser
        })
       
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}


export default uploadInfor