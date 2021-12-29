import { ICategory, IMessage, IProduct } from '@/models/common'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import {
    categories_add_pending,
    categories_add_success,
    categories_add_reject,
    categories_get_pending,
    categories_get_reject,
    categories_get_success,
    categories_update_pending,
    categories_update_reject,
    categories_update_success,
    categories_delete_item_pending,
    categories_delete_item_reject,
    categories_delete_item_success
} from '@/reduxState/actionTypes/categoriesAction'
import { deleteData, getData, patchData, postData } from 'utils/fetchData'


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


//Update category
export const updateCategories = (categories: ICategory[], name: string, idCatUpdate: string, accessToken: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    //Set loading for update category
    dispatch(categories_update_pending())

    //Update category in database
    await patchData(`categories/${idCatUpdate}`, {name}, accessToken).then(res => {
        // Check if has error
        if(res.err){
            return dispatch(categories_update_reject({
                description: res.err,
                status: "error"
            }))
        }

        // Create new categories and update category nedded
        const newArray = categories.map(categoryItem => {
            if(categoryItem._id === idCatUpdate){
                return {
                    ...categoryItem,
                    name
                }
            } else{
                return categoryItem
            }
        })

        return dispatch(categories_update_success(newArray, {
            description: "Updated category successfully.",
            status: "success"
        }))
    })
}


//Delete item category
export const deleteItemCategories = (categories: ICategory[], idDelete: string, accessToken: string) => async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    //Set loading for update category
    dispatch(categories_delete_item_pending())

    //Delete category in database
    await deleteData(`categories/${idDelete}`, accessToken).then(res => {
        // Check if has error
        if(res.err){
            return dispatch(categories_delete_item_reject({
                description: res.err,
                status: "error"
            }))
        }

        // Create new categories and delete category
        const newArray = categories.filter(category => category._id !== idDelete)

        return dispatch(categories_delete_item_success(newArray, {
            description: "Deleted category successfully.",
            status: "success"
        }))
    })
}