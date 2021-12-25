import { IMessage, IProduct, IUserInfor } from '@/models/common'
import {
    CART_ADD_PENDING,
    CART_ADD_SUCCESS,
    CART_ADD_REJECT,
    CART_SAVE_NEW,
    CART_ADD_MESSAGE,
    CART_CLEAR_ALL,
    CART_MESSAGE_CLEAR
} from '@/reduxState/actions'

// Action for add cart
export const cart_add_pending = () => {
    return ({
        type: CART_ADD_PENDING
    } as const)
}

export const cart_add_success = (products: IProduct[]) => {
    return ({
        type: CART_ADD_SUCCESS,
        payload: {
            producs: products
        }
    } as const)
}

export const cart_save_new = (cart: IProduct[]) => {
    return ({
        type: CART_SAVE_NEW,
        payload: {
            products: cart
        }
    } as const)
}

export const cart_add_reject = (message: IMessage) => {
    return ({
        type: CART_ADD_REJECT,
        payload: {
            message: message
        }
    } as const)
}

export const cart_add_message = (message: IMessage) => {
    return ({
        type: CART_ADD_MESSAGE,
        payload: {
            message: message
        }
    } as const)
}

export const cart_clear_all = () => {
    return ({
        type: CART_CLEAR_ALL
    } as const)
}

export const cart_message_clear = () => {
    return ({
        type: CART_MESSAGE_CLEAR
    } as const)
}

export type cartAction = ReturnType<
    typeof cart_add_pending |
    typeof cart_add_success |
    typeof cart_add_reject |
    typeof cart_message_clear |
    typeof cart_save_new |
    typeof cart_add_message |
    typeof cart_clear_all
>