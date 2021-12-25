import auth from '@/middleware/auth'
import { IUserInfor } from '@/models/common'
import Users from '@/models/userModel'
import { connectDB } from '@/utils'
import bcrypt from 'bcrypt'
import { UpdateQuery } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method !== "PATCH") return res.status(400).json({ err: "Method mot valid." })
    try {
        const result: any = await auth(req, res)
        const {password} = req.body
        const passwordHash = await bcrypt.hash(password, 12)

        await Users.findOneAndUpdate(
            {_id: result.id}, 
            {password: passwordHash} as UpdateQuery<IUserInfor>
        )

        res.json({msg: "Update Success!"})
       
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}


export default resetPassword