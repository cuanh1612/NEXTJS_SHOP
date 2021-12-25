import { IMessage, IProduct } from '@/models/common'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import {
    cart_add_pending,
    cart_add_success,
    cart_add_reject,
    cart_save_new,
    cart_add_message,
    cart_clear_all
} from '@/reduxState/actionTypes/CartAction'


//Add product to cart
export const addProductCart = (product: IProduct, cart: IProduct[] | []) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(cart_add_pending())

    //Check product in stock
    if (product.inStock === 0) {
        return dispatch(cart_add_reject({
            description: "This product is out of stock.",
            status: "error"
        }))
    } else {

        //Check product exist in cart
        const check = cart.every(item => {
            return item._id !== product._id
        })
        if (!check) {
            return dispatch(cart_add_reject({
                description: "The product has been added to cart.",
                status: "warning"
            }))
        } else {
            dispatch(cart_add_success([...cart, { ...product, quantity: 1 }]))
        }
    }
}

//Add new message to cart reducer
export const addMessageCart = (message: IMessage) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(cart_add_message(message))
}

//Clear all cart
export const cartClearAll = () => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(cart_clear_all())
}


export const decreaseProduct = (cart: IProduct[], id: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const newCart = [...cart]
    newCart.forEach(product => {
        if(product._id === id) product.quantity -= 1
    })

    dispatch(cart_save_new(newCart))
}

export const increaseProduct = (cart: IProduct[], id: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const newCart = [...cart]
    newCart.forEach(product => {
        if(product._id === id) product.quantity += 1
    })

    dispatch(cart_save_new(newCart))
}
