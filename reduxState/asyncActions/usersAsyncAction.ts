import { IUserInfor } from "@/models/common"
import { getData } from "@/utils"
import { AnyAction } from "redux"
import { ThunkDispatch } from "redux-thunk"
import { users_get_pending, users_get_reject, users_get_success } from "../actionTypes/usersAction"

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
