import { IMessage, Iorder, IProduct, IUserInfor } from '@/models/common'
import {
    USERS_GET_PENDING,
    USERS_GET_REJECT,
    USERS_GET_SUCCESS,
    USERS_MESSAGE_CLEAR
} from '@/reduxState/actions'

export const users_get_pending = () => {
    return ({
        type: USERS_GET_PENDING,

    } as const)
}

export const users_get_success = (users: IUserInfor[]) => {
    return ({
        type: USERS_GET_SUCCESS,
        payload: {
            users: users
        }
    } as const)
}

export const users_get_reject = (message: IMessage) => {
    return ({
        type: USERS_GET_REJECT, 
        payload: {
            message: message
        }
    } as const)
}

export const users_message_clear = () => {
    return ({
        type: USERS_MESSAGE_CLEAR
    } as const)
}



export type usersAction = ReturnType<
    typeof users_get_pending |
    typeof users_get_success |
    typeof users_get_reject |
    typeof users_message_clear
>