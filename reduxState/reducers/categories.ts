import { ICategory, IMessage } from '@/models/common'
import { categoryAction } from '@/reduxState/actionTypes/categoriesAction'

import {
    CATEGORIES_ADD_PENDING,
    CATEGORIES_ADD_REJECT,
    CATEGORIES_ADD_SUCCESS,
    CATEGORIES_MESSAGE_CLEAR,
    CATEGORIES_GET_PENDING,
    CATEGORIES_GET_REJECT,
    CATEGORIES_GET_SUCCESS,
    CATEGORIES_UPDATE_PENDING,
    CATEGORIES_UPDATE_REJECT,
    CATEGORIES_UPDATE_SUCCESS,
    CATEGORIES_DELETE_ITEM_PENDING,
    CATEGORIES_DELETE_ITEM_REJECT, 
    CATEGORIES_DELETE_ITEM_SUCCESS
} from '@/reduxState/actions'

export interface ICategoriesInitialState {
    categories: ICategory[] | [],
    message: IMessage | null,
    loading: boolean
}


const initialState: ICategoriesInitialState = {
    categories: [],
    message: null,
    loading: false
}

const CategoriesReducer = (state = initialState, action: categoryAction) => {
    switch (action.type) {
        case CATEGORIES_ADD_PENDING:
        case CATEGORIES_GET_PENDING:
        case CATEGORIES_UPDATE_PENDING:
        case CATEGORIES_DELETE_ITEM_PENDING:
            return {
                ...state,
                loading: true
            }
        case CATEGORIES_ADD_SUCCESS:
        case CATEGORIES_UPDATE_SUCCESS:
        case CATEGORIES_DELETE_ITEM_SUCCESS:
            return {
                ...state,
                categories: action.payload.categories,
                loading: false,
                message: action.payload.message
            }
        case CATEGORIES_GET_SUCCESS:
            return {
                ...state,
                categories: action.payload.categories,
                loading: false
            }
        case CATEGORIES_ADD_REJECT:
        case CATEGORIES_GET_REJECT:
        case CATEGORIES_UPDATE_REJECT:
        case CATEGORIES_DELETE_ITEM_REJECT:
            return {
                ...state,
                loading: false,
                message: action.payload.message
            }
        case CATEGORIES_MESSAGE_CLEAR:
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

export default CategoriesReducer