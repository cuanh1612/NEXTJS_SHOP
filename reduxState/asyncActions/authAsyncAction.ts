import { IUserInfor } from '@/models/common'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { postData } from '@/utils'
import {
    auth_signup_pending,
    auth_signup_success,
    auth_signup_reject,
    auth_signin_pending,
    auth_signin_success,
    auth_signin_reject
} from '@/reduxState/actionTypes/authAction'
import Cookie from 'js-cookie'
import jwt, { Secret } from 'jsonwebtoken'


//Sign up account user
export const signUpUser = ({ name, email, password, cf_password }: IUserInfor) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(auth_signup_pending())
    const res = await postData('auth/signup', { name, email, password, cf_password })

    if (res.err) {
        dispatch(auth_signup_reject(res.err))
    } else {
        dispatch(auth_signup_success({ name, email, password, cf_password }))
    }
}

//Sign in account user
export const signInUser = ({ email, password }: IUserInfor) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(auth_signin_pending())
    const res = await postData('auth/signin', { email, password })
    console.log("coookie tra ve", res);
    

    if (res.err) {
        dispatch(auth_signin_reject(res.err))
    } else {
        dispatch(auth_signin_success(res.user, res.access_token, {
            description: "Sign in account success.",
            status: "success"
        }))

        //Set cookie to save refresh token in path api/auth/accessToken
        Cookie.set('refreshtoken', res.refresh_token, {
            path: '/api/auth/accessToken',
            expires: 7
        })

        //Save is login in local
        localStorage.setItem('firstLogin', 'true')
    }
}