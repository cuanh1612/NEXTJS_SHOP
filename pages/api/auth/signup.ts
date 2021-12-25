import Users from '@/models/userModel'
import { connectDB, validSignUp } from '@/utils'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const register = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") return res.status(400).json({ err: "Method mot valid." })
    try {
        const { name, email, password, cf_password } = req.body

        //Check valid infor sign up
        const errMsg = validSignUp({ name, email, password, cf_password })
        if (errMsg) return res.status(400).json({ err: errMsg })

        //Check email exist in system
        const user = await Users.findOne({ email })
        if (user) return res.status(400).json({ err: "This email already exists." })

        const passwordHash = await bcrypt.hash(password, 12)

        const NewUser = new Users({
            name,
            email,
            password: passwordHash,
            cf_password
        })

        await NewUser.save()

        return res.status(200).json({
            msg: "Register Success!"
        })
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default register