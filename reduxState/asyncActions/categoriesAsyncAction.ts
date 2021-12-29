import { ICategory, IMessage, IProduct } from '@/models/common'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import {
    categories_add_pending,
    categories_add_success,
    categories_add_reject,
    categories_get_pending,
    categories_get_reject,
    categories_get_success
} from '@/reduxState/actionTypes/categoriesAction'
import { getData, postData } from 'utils/fetchData'


//Add category
export const addCategory = (categories: ICategory[], name: string, accessToken: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    //Set loading for add category
    dispatch(categories_add_pending())

    //Create category to database
    await postData('categories', {name}, accessToken).then(res => {
        // Check if has error
        if(res.err){
            return dispatch(categories_add_reject({
                description: res.err,
                status: "error"
            }))
        }

        categories.push(res.newCategory)

        return dispatch(categories_add_success(categories, {
            description: res.msg,
            status: "success"
        }))
    })
}

//Get all categories
export const getCategories = () => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    //Set loading for add category
    dispatch(categories_get_pending())

    //Create category to database
    await getData('categories').then(res => {
        // Check if has error
        if(res.err){
            return dispatch(categories_get_reject({
                description: res.err,
                status: "error"
            }))
        }

        return dispatch(categories_get_success(res.categories))
    })
}