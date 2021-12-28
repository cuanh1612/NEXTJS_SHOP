import { IMessage, Iorder, IProduct, IUserInfor } from '@/models/common'
import {
    USERS_GET_PENDING,
    USERS_GET_REJECT,
    USERS_GET_SUCCESS,
    USERS_MESSAGE_CLEAR,
    USER_UPDATE_ITEM_PENDING,
    USER_UPDATE_ITEM_SUCCESS,
    USERS_DELETE_PENDING,
    USERS_DELETE_SUCCESS,
    USERS_DELETE_REJECT
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

export const user_update_item_pending = () => {
    return ({
        type: USER_UPDATE_ITEM_PENDING
    } as const)
}

export const user_update_item_success = (users: IUserInfor[]) => {
    return ({
        type: USER_UPDATE_ITEM_SUCCESS,
        payload: {
            users
        }
    } as const)
}

export const user_delete_pending = () => {
    return ({
        type: USERS_DELETE_PENDING
    } as const)
}

export const user_delete_success = (users: IUserInfor[], message: IMessage) => {
    return ({
        type: USERS_DELETE_SUCCESS,
        payload: {
            users,
            message
        }
    } as const)
}

export const user_delete_reject = (message: IMessage) => {
    return ({
        type: USERS_DELETE_REJECT,
        payload: {
            message
        }
    } as const)
}



export type usersAction = ReturnType<
    typeof users_get_pending |
    typeof users_get_success |
    typeof users_get_reject |
    typeof users_message_clear |
    typeof user_update_item_pending |
    typeof user_update_item_success |
    typeof user_delete_pending |
    typeof user_delete_success | 
    typeof user_delete_reject
>