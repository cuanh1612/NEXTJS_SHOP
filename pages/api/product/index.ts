import auth from '@/middleware/auth'
import Products from '@/models/productModel'
import { connectDB } from '@/utils'
import mongoose from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const productApi = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "GET":
            return await getProducts(req, res)
        case "POST":
            return await createProduct(req, res)
        default:
            return res.status(400).json({ err: "Method mot valid." })
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    try {        
        const features = new APIfeatures(Products.find(), req.query)
        .filtering().sorting().pagination()

        //Get products 
        const products = await features.query

        //Get Numbers of products
        const numberProducts = await (await Products.find()).length       

        //Res products and number products
        return res.status(200).json({
            status: 'success',
            result: numberProducts,
            products
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        //Check auth with middleware
        const result: any = await auth(req, res)

        //Check if user is admin
        if (result.role !== 'admin' || !result.root)
            return res.status(400).json({ err: 'Authentication is not valid.' })

        //Get infor of product to create
        const {
            title,
            price,
            inStock,
            description,
            category,
            content,
            images
        } = req.body

        console.log({
            title,
            price,
            inStock,
            description,
            category,
            content,
            images
        });


        //Check if data lack
        if (
            !title ||
            price === NaN ||
            inStock === NaN ||
            !description ||
            category === "all" ||
            !content ||
            images.length === 0
        )
            return res.status(400).json({ err: "Please add all the fields." })

        //Create new product
        const newProduct = new Products({
            title: title.toLowerCase(),
            price,
            inStock,
            description,
            category,
            content,
            images
        })

        //Save creaet
        await newProduct.save()

        //Res msg
        res.status(200).json({
            msg: 'Success! Created a new product'
        })

    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

//Class API for filter, pagination, sort products
class APIfeatures {
    //field
    query: mongoose.Query<any[], any, {}, any>
    queryString: any;

    constructor(query: mongoose.Query<any[], any, {}, any>, queryString: any) {
        this.query = query
        this.queryString = queryString
    }

    filtering() {
        const queryObj = { ...this.queryString }   
        
        const excludeFields = ['page', 'sort', 'limit']
        excludeFields.map(e => delete queryObj[e])
        
        if (queryObj.category !== "all")
            this.query.find({ category: queryObj.category })
        if (queryObj.title !== "all")
            this.query.find({ title: { $regex: queryObj.title } })
        
        this.query.find()

        return this
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join('')
            
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this
    }

    pagination() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 6
        const skip = (page - 1) * limit
        
        this.query = this.query.skip(skip).limit(limit)

        return this
    }
}

export default productApi