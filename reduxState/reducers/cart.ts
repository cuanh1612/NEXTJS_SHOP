import { IMessage, IProduct } from '@/models/common'
import { cartAction } from '@/reduxState/actionTypes/CartAction'

import {
    CART_ADD_PENDING,
    CART_ADD_SUCCESS,
    CART_ADD_REJECT,
    CART_SAVE_NEW,
    CART_ADD_MESSAGE,
    CART_CLEAR_ALL,
    CART_MESSAGE_CLEAR
} from '@/reduxState/actions'

export interface ICartInitialState {
    products: IProduct[] | [],
    message: IMessage | null,
    loading: boolean
}


const initialState: ICartInitialState = {
    products: [],
    message: null,
    loading: false
}

const cartReducer = (state = initialState, action: cartAction) => {
    switch (action.type) {
        case CART_ADD_PENDING:
            return {
                ...state,
                loading: true,
            }
        case CART_ADD_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload.producs,
                message: {
                    description: "Added product success.",
                    status: "success"
                }
            }
        case CART_ADD_REJECT:
            return {
                ...state,
                loading: false,
                message: action.payload.message
            }
        case CART_SAVE_NEW:
            return {
                ...state,
                products: action.payload.products
            }
        case CART_ADD_MESSAGE:
            return {
                ...state,
                message: action.payload.message
            }
        case CART_MESSAGE_CLEAR:
            return {
                ...state,
                message: null
            }
        case CART_CLEAR_ALL:
            return {
                ...state,
                products: []
            }
        default:
            return {
                ...state
            }
    }
}

export default cartReducer