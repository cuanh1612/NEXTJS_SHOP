import Users from '@/models/userModel'
import { connectDB } from '@/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { createAccessToken } from '@/utils'
import jwt, { Secret } from 'jsonwebtoken'
import { IUserInfor } from '@/models/common'
import Cookie from 'cookies'

connectDB()

const accessToken = async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = new Cookie(req, res)
    if (req.method !== "GET") return res.status(400).json({ err: "Method mot valid." })
    try {
        //Check live refresh token
        const rf_token = await cookies.get('refreshtoken')
             
        if (!rf_token) return res.status(401).json({ err: "Please login now!", status: 401 })

        //Check refresh verify
        const result: any = await jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET as Secret, { ignoreExpiration: true })
        
        if (!result) return res.status(401).json({ err: 'Your token is incorrect or has expired.', status: 401 })
        const exp = new Date(result.exp * 1000).toDateString()
        const timeNow = new Date().toDateString()
        if (exp < timeNow) return res.status(401).json({ err: "Please login now!", status: 401})
        
        //Check user exist in system
        const user: IUserInfor = await Users.findById(result.id)
        if (!user) return res.status(400).json({ err: 'User does not exist.' })

        //Create new access token
        const access_token = createAccessToken({ id: user._id })

        res.status(200).json({
            access_token,
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

export default accessToken