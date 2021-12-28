import { IMessage, Iorder, IUserInfor } from '@/models/common'
import {
    USERS_GET_PENDING,
    USERS_GET_SUCCESS,
    USERS_GET_REJECT,
    USERS_MESSAGE_CLEAR,
    USER_UPDATE_ITEM_PENDING,
    USER_UPDATE_ITEM_SUCCESS,
    USERS_DELETE_PENDING,
    USERS_DELETE_SUCCESS,
    USERS_DELETE_REJECT
} from '@/reduxState/actions'
import { usersAction } from '@/reduxState/actionTypes/usersAction'


export interface IUsersInitialState {
    users: IUserInfor[],
    message: IMessage | null,
    loading: boolean
}


const initialState: IUsersInitialState = {
    users: [],
    message: null,
    loading: false
}

const usersReducer = (state = initialState, action: usersAction) => {
    switch (action.type) {
        case USER_UPDATE_ITEM_PENDING:
        case USERS_DELETE_PENDING:
            return {
                ...state,
                loading: true
            }
        case USERS_GET_PENDING:
            return {
                ...state,
                loading: true
            }
        case USERS_GET_SUCCESS:
        case USER_UPDATE_ITEM_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users
            }
        case USERS_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users,
                message: action.payload.message
            }
        case USERS_GET_REJECT:
            return {
                ...state,
                users: [],
                loading: false,
                message: action.payload.message
            }
        case USERS_DELETE_REJECT:
            return {
                ...state,
                loading: false,
                message: action.payload.message
            }
        case USERS_MESSAGE_CLEAR:
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

export default usersReducer