import { ICategory, IMessage } from '@/models/common'
import {
    CATEGORIES_ADD_PENDING,
    CATEGORIES_ADD_SUCCESS,
    CATEGORIES_ADD_REJECT,
    CATEGORIES_GET_PENDING,
    CATEGORIES_GET_REJECT,
    CATEGORIES_GET_SUCCESS,
    CATEGORIES_MESSAGE_CLEAR
} from '@/reduxState/actions'

export const categories_add_pending = () => {
    return ({
        type: CATEGORIES_ADD_PENDING
    } as const)
}

export const categories_add_success = (categories: ICategory[], message: IMessage) => {
    return ({
        type: CATEGORIES_ADD_SUCCESS,
        payload: {
            categories: categories,
            message
        }
    } as const)
}

export const categories_add_reject = (message: IMessage) => {
    return ({
        type: CATEGORIES_ADD_REJECT,
        payload: {
            message: message
        }
    } as const)
}

export const categories_message_clear = () => {
    return ({
        type: CATEGORIES_MESSAGE_CLEAR
    } as const)
}

export const categories_get_pending = () => {
    return ({
        type: CATEGORIES_GET_PENDING
    } as const)
}

export const categories_get_success = (categories: ICategory) => {
    return ({
        type: CATEGORIES_GET_SUCCESS,
        payload: {
            categories: categories
        }
    } as const)
}

export const categories_get_reject = (message: IMessage) => {
    return ({
        type: CATEGORIES_GET_REJECT,
        payload: {
            message: message
        }
    } as const)
}

export type categoryAction = ReturnType<
    typeof categories_add_pending |
    typeof categories_add_success |
    typeof categories_add_reject |
    typeof categories_message_clear|
    typeof categories_get_pending|
    typeof categories_get_success|
    typeof categories_get_reject
>