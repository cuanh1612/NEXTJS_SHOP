import auth from '@/middleware/auth'
import categoryModel from '@/models/categoryModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const categoryApi = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "PATCH":
            return await updateCategory(req, res)
        case "DELETE":
            return await delteCategory(req, res)
        default:
            return res.status(400).json({ err: "Method mot valid." })
    }
}

const updateCategory = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if (result.role !== 'admin' || !result.root)
            return res.status(400).json({ err: 'Authentication is not valid.' })

        //Get id and name to update
        const { name } = req.body
        const { id } = req.query

        if (!name) return res.status(400).json({ err: "Name can not be left blank." })

        await categoryModel.findOneAndUpdate({ _id: id }, { name })

        return res.status(200).json({
            msg: "Success! Updated category.",
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

const delteCategory = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if (result.role !== 'admin' || !result.root)
            return res.status(400).json({ err: 'Authentication is not valid.' })
        
        //Get id
        const {id} = req.query

        await categoryModel.findByIdAndDelete(id)
        //Return categories
        return res.status(200).json({
            msg: "Success! Deleted category.",
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default categoryApi