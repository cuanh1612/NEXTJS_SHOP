import { connectDB } from '@/utils'
import Cookie from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'

connectDB()

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies= new Cookie(req, res)
    if (req.method !== "GET") return res.status(400).json({ err: "Method mot valid." })
    try {
        //Set cookie to save refresh token in path api/auth/accessToken
        await cookies.set('refreshtoken', null, {
            maxAge: 0
        })

        return res.status(200).json({
            msg: 'Logout Success!',
        })
    } catch (error: any) {
        return res.status(500).json({ err: "System has some wrong!" })
    }
}

export default logout