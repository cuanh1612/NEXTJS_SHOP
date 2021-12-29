import auth from '@/middleware/auth'
import categoryModel from '@/models/categoryModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const categoryApi = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "POST":
            return await createCategory(req, res)
        case "GET":
            return await getCategories(req, res)
        default:
            return res.status(400).json({ err: "Method mot valid." })
    }
}

const createCategory = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if (result.role !== 'admin' || !result.root)
            return res.status(400).json({ err: 'Authentication is not valid.' })

        const {name} = req.body

        if(!name) return res.status(400).json({err: "Name can not be left blank."})

        const newCategory = await new categoryModel({name})

        return res.status(200).json({
            msg: "Success! Created a new category.",
            newCategory
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

const getCategories = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Get all categories
        const categories = await categoryModel.find()

        //Return categories
        return res.status(200).json({
            categories
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default categoryApi