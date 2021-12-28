import { IUserInfor } from "@/models/common"
import { getData, deleteData } from "@/utils"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { users_get_pending, users_get_reject, users_get_success, user_delete_pending, user_delete_reject, user_delete_success, user_update_item_pending, user_update_item_success } from "../actionTypes/usersAction"

//Get all users to manager for admin
export const getAllUsers = (accessToken: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    //Set loading when get all users pending
    dispatch(users_get_pending())

    //Get all users
    const res = await getData("user/all", accessToken)

    //Check if res has err
    if (res.err) {
        dispatch(users_get_reject({
            description: res.err,
            status: "error"
        }))
    } else {
        dispatch(users_get_success(res.users as IUserInfor[]))
    }
}

//Update one user item 
export const userUpdateItem = (users: IUserInfor[], id: string, user: IUserInfor) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    //Set loading when pending update
    dispatch(user_update_item_pending())

    //Find order to update, if order exist in order list will update
    const newUsers = users.map(item => (item._id === id ? user : item))

    //Update order list in redux
    dispatch(user_update_item_success(newUsers))
}

//Delete one user item 
export const userDeleteItem = (users: IUserInfor[], id: string, accessToken: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    console.log("id ne", id);
    
    //Set loading when pending delete
    dispatch(user_delete_pending())

    //Delete user in database
    await deleteData(`user/${id}`, accessToken).then(res => {
        if (!res.err) {
            //Find order to delete in redux, if order exist in order list will delete
            const newUsers = users.filter(item => (item._id !== id))

            //delete order list in redux
            return dispatch(user_delete_success(newUsers, {
                description: res.msg,
                status: "success"
            }))
        }

        return dispatch(user_delete_reject({
            description: res.err,
            status: "error"
        }))


    })
}