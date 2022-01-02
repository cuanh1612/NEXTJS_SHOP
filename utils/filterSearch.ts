import { NextRouter } from "next/router";

export interface initialFilter{
    router: NextRouter, 
    page: number, 
    category?: string, 
    sort?: string, 
    search?: string
} 
export const filterSearch = ({router, page, category, sort, search}: initialFilter) => {

    console.log('sfsasfsafsfsdfdfs');
    
    //Get path name
    const path = router.pathname
    //Get query to nextpage or loadmore product
    const query = router.query

    //Set query when have param passed
    if(category) query.category = category
    if(page) query.page = page.toString()
    if(search) query.search = search
    if(sort) query.sort = sort

    //Push to path name (next page or loadmore by change query)
    router.push({
        pathname: path,
        query: query
    })
}
