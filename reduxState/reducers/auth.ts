import { IMessage, IUserInfor } from '@/models/common'
import { authAction } from '@/reduxState/actionTypes/authAction'

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

export interface IAuthInitialState {
    currentUser: IUserInfor | null,
    loading: boolean,
    isLogin: boolean,
    message: IMessage | null,
    accessToken: string | null,
    firstLoading: boolean
}


const initialState: IAuthInitialState = {
    currentUser: null,
    loading: false,
    isLogin: false,
    message: null,
    accessToken: null,
    firstLoading: false
}

const authReducer = (state = initialState, action: authAction) => {
    switch (action.type) {
        case AUTH_SIGNUP_PENDING:
        case AUTH_SIGNIN_PENDING:
            return {
                ...state,
                loading: true,
            }
        case AUTH_SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                message: {
                    description: "Sign up account success.",
                    status: "success"
                }
            }
        case AUTH_SIGNIN_SUCCESS:
            return {
                ...state,
                currentUser: action.payload?.currentUser,
                loading: false,
                isLogin: true,
                accessToken: action.payload?.accessToken,
                message: action.payload?.message,
            }
        case AUTH_LOGOUT_SUCCESS:
            return {
                ...state,
                currentUser: null,
                loading: false,
                isLogin: false,
                accessToken: null,
                message: action.payload?.message,
            }
        case AUTH_SIGNUP_REJECT:
        case AUTH_SIGNIN_REJECT:
            return {
                ...state,
                loading: false,
                message: {
                    description: action.payload?.error,
                    status: "error"
                }
            }
        case AUTH_FIRST_LOGIN:
            return {
                ...state,
                firstLoading: true
            }
        case AUTH_SAVE_USER:
            return{
                ...state,
                currentUser: action.payload.currentUser
            }
        case AUTH_MESSAGE_CLEAR:
            return {
                ...state,
                message: null
            }
        default:
            return {
                ...state
            }
    }
}

export default authReducer