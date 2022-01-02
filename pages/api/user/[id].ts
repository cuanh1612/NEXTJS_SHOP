import auth from '@/middleware/auth'
import userModel from '@/models/userModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const updateDeleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "PATCH":
            return await updateUser(req, res)
        case "DELETE":
            return await deleteUser(req, res)
        default:
            return res.status(400).json({ err: "Method mot valid." })
    }
}

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if (result.role !== 'admin' || !result.root)
            return res.status(400).json({ err: 'Authentication is not valid.' })

        //Get id user udpate and get role update
        const { id } = req.query
        const { role } = req.body

        //Update user's role and res message success
        await userModel.findOneAndUpdate({ _id: id }, { role })

        return res.status(200).json({
            msg: `Update User ${id} Success!`
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if (result.role !== 'admin' || !result.root)
            return res.status(400).json({ err: 'Authentication is not valid.' })

        //Get id user delete
        const { id } = req.query

        // delete user and res message success
        await userModel.deleteOne({_id: id})

        return res.status(200).json({
            msg: `Deleted User ${id} Success!`
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}


export default updateDeleteUser