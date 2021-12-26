import { IMessage, Iorder, IProduct, IUserInfor } from '@/models/common'
import {
    ORDER_ADD_LIST,
    ORDER_ADD_MESSAGE,
    ORDER_MESSAGE_CLEAR,
    ORDER_UPDATE_ITEM_PENDING,
    ORDER_UPDATE_ITEM_SUCCESS
} from '@/reduxState/actions'

// Action for add cart
export const order_add_list = (orders: Iorder[]) => {
    console.log(orders);

    return ({
        type: ORDER_ADD_LIST,
        payload: {
            orders
        }
    } as const)
}

export const order_add_message = (message: IMessage) => {
    return ({
        type: ORDER_ADD_MESSAGE,
        payload: {
            message
        }
    } as const)
}

export const order_message_clear = () => {
    return ({
        type: ORDER_MESSAGE_CLEAR
    } as const)
}

export const order_update_item_pending = () => {
    return ({
        type: ORDER_UPDATE_ITEM_PENDING
    } as const)
}

export const order_update_item_success = (orders: Iorder[]) => {
    return ({
        type: ORDER_UPDATE_ITEM_SUCCESS,
        payload: {
            orders
        }
    } as const)
}

export type orderAction = ReturnType<
    typeof order_add_list |
    typeof order_add_message |
    typeof order_message_clear |
    typeof order_update_item_success |
    typeof order_update_item_pending
>