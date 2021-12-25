import Users from '@/models/userModel'
import { connectDB, createAccessToken, createRefreshToken } from '@/utils'
import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const signin = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") return res.status(400).json({ err: "Method mot valid." })
    try {
        const { email, password } = req.body

        //Check email exist in system
        const user = await Users.findOne({ email })
        if (!user) return res.status(400).json({ err: "This email does not exists." })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ err: "Incorrect passwrod." })

        //Create accsess and refresh token
        const access_token = createAccessToken({ id: user._id })
        const refresh_token = createRefreshToken({ id: user._id })

        return res.status(200).json({
            msg: 'Sign In Success!',
            access_token,
            refresh_token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root
            }
        })
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default signin