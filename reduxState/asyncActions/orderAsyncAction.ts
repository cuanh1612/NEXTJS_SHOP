import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { order_add_list, order_add_message, order_update_item_pending, order_update_item_success } from "@/reduxState/actionTypes/orderAction"
import { getData } from "@/utils"
import { IMessage, Iorder } from "@/models/common"

//Add new liskt order
export const orderAddList = (accessToken: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const res = await getData("order/getOrders", accessToken)

    if(res.err){
        return dispatch(order_add_message({
            description: res.err,
            status: "error"
        }))
    }
    
    dispatch(order_add_list(res.orders as Iorder[]))
}

//Update one order when disorder update payment
export const orderUpdateItem = (orders: Iorder[], id: string, order: Iorder) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    //Set loading when pending update
    dispatch(order_update_item_pending())

    //Find order to update, if order exist in order list will update
    const newOrders = orders.map(item => (item._id === id ? order : item))
    
    //Update order list in redux
    dispatch(order_update_item_success(newOrders))
}