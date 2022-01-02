import jwt, { Secret } from "jsonwebtoken"

export const createAccessToken = (payload: object) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '14m' })
}

export const createRefreshToken = (payload: object) => {
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '7d' })
    const result: any = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as Secret, { ignoreExpiration: true })

    return token
}
