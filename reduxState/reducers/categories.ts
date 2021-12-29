import { ICategory, IMessage } from '@/models/common'
import { categoryAction } from '@/reduxState/actionTypes/categoriesAction'

import {
    CATEGORIES_ADD_PENDING,
    CATEGORIES_ADD_REJECT,
    CATEGORIES_ADD_SUCCESS,
    CATEGORIES_MESSAGE_CLEAR,
    CATEGORIES_GET_PENDING,
    CATEGORIES_GET_REJECT,
    CATEGORIES_GET_SUCCESS
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
            return {
                ...state,
                loading: true
            }
        case CATEGORIES_ADD_SUCCESS:
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