import { IMessage, Iorder } from '@/models/common'
import {
    ORDER_ADD_LIST,
    ORDER_ADD_MESSAGE,
    ORDER_MESSAGE_CLEAR,
    ORDER_UPDATE_ITEM_PENDING,
    ORDER_UPDATE_ITEM_SUCCESS,
} from '@/reduxState/actions'
import { orderAction } from '@/reduxState/actionTypes/orderAction'


export interface IOrderInitialState {
    orders: Iorder[],
    message: IMessage | null,
    loading: boolean
}


const initialState: IOrderInitialState = {
    orders: [],
    message: null,
    loading: false
}

const orderReducer = (state = initialState, action: orderAction) => {
    switch (action.type) {
        case ORDER_UPDATE_ITEM_PENDING:
            return {
                ...state,
                loading: true
            }
        case ORDER_ADD_LIST:
        case ORDER_UPDATE_ITEM_SUCCESS:
            return {
                ...state,
                orders: action.payload.orders,
                loading: false
            }
        case ORDER_ADD_MESSAGE:
            return {
                ...state,
                message: action.payload.message
            }
        case ORDER_MESSAGE_CLEAR:
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

export default orderReducer