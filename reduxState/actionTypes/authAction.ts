import { IMessage, IUserInfor } from '@/models/common'
import {
    AUTH_SIGNUP_PENDING,
    AUTH_SIGNUP_SUCCESS,
    AUTH_SIGNUP_REJECT,
    AUTH_SIGNIN_PENDING,
    AUTH_SIGNIN_SUCCESS,
    AUTH_SIGNIN_REJECT,
    AUTH_LOGOUT_SUCCESS,
    AUTH_MESSAGE_CLEAR,
    AUTH_FIRST_LOGIN,
    AUTH_SAVE_USER
} from '@/reduxState/actions'

// Action for signup
export const auth_signup_pending = () => {
    return ({
        type: AUTH_SIGNUP_PENDING
    } as const)
}

export const auth_signup_success = (user: IUserInfor) => {
    return ({
        type: AUTH_SIGNUP_SUCCESS,
        payload: {
            currentUser: user
        }
    } as const)
}

export const auth_signup_reject = (error: any) => {
    return ({
        type: AUTH_SIGNUP_REJECT,
        payload: {
            error: error
        }
    } as const)
}

// Action for signin
export const auth_signin_pending = () => {
    return ({
        type: AUTH_SIGNIN_PENDING
    } as const)
}

export const auth_signin_success = (user: IUserInfor, accessToken: string, message: IMessage|null) => {    
    return ({
        type: AUTH_SIGNIN_SUCCESS,
        payload: {
            currentUser: user,
            accessToken: accessToken,
            message: message
        }
    } as const)
}

export const auth_signin_reject = (error: any) => {
    return ({
        type: AUTH_SIGNIN_REJECT,
        payload: {
            error: error
        }
    } as const)
}

//Auth action for log out
export const auth_save_user = (user: IUserInfor) => {
    return ({
        type: AUTH_SAVE_USER,
        payload: {
            currentUser: user
        }
    } as const)
}

//Auth action for save user update
export const auth_logout_success = () => {
    return ({
        type: AUTH_LOGOUT_SUCCESS,
        payload: {
            message: {
                description: "Log out account success.",
                status: "success"
            }
        }
    } as const)
}

//Auth action for log out
export const auth_first_login = () => {
    return ({
        type: AUTH_FIRST_LOGIN
    } as const)
}


export const auth_message_clear = () => {
    return ({
        type: AUTH_MESSAGE_CLEAR
    } as const)
}

export type authAction = ReturnType<
    typeof auth_signup_pending |
    typeof auth_signup_success |
    typeof auth_signup_reject |
    typeof auth_signin_pending |
    typeof auth_signin_success |
    typeof auth_signin_reject |
    typeof auth_message_clear |
    typeof auth_logout_success |
    typeof auth_first_login |
    typeof auth_save_user
>