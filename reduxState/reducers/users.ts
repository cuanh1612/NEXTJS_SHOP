import { IMessage, Iorder, IUserInfor } from '@/models/common'
import {
    USERS_GET_PENDING,
    USERS_GET_SUCCESS,
    USERS_GET_REJECT,
    USERS_MESSAGE_CLEAR
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
        case USERS_GET_PENDING:
            return {
                ...state,
                loading: true
            }
        case USERS_GET_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users
            }
        case USERS_GET_REJECT:
            return {
                ...state,
                users: [],
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