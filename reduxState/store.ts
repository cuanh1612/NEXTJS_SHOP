import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import AuthReducer from './reducers/auth'
import CartReducer from './reducers/cart'
import OrderReducer from './reducers/order'
import thunk from 'redux-thunk'
import { IAuthInitialState } from '@/reduxState/reducers/auth'
import { ICartInitialState } from '@/reduxState/reducers/cart'
import { IOrderInitialState } from '@/reduxState/reducers/order'

interface IRootReducer {
    auth: IAuthInitialState,
    cart: ICartInitialState,
    order: IOrderInitialState
}

const rootReducer = combineReducers({
    auth: AuthReducer,
    cart: CartReducer,
    order: OrderReducer
})

export const store = createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

//Export select auth
export const selectAuth = (state: IRootReducer) => state.auth

//Export select cart
export const selectCart = (state: IRootReducer) => state.cart

//Export select order
export const selectOrder = (state: IRootReducer) => state.order