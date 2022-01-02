import { useAppSelector } from '@/reduxState/hooks';
import { selectCategories } from '@/reduxState/store';
import { filterSearch } from '@/utils';
import { Box, Grid, GridItem, Input, Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface IFilterProps {
}

export default function Filter(props: IFilterProps) {
    //State for filter
    const [search, setSearch] = React.useState('')
    const [sort, setSort] = React.useState('')
    const [category, setCategory] = React.useState('')

    //Router
    const router = useRouter()
    const { category: categoryRouter, sort: sortRouter, search: searchRouter } = router.query

    //Select data category from Redux
    const { categories } = useAppSelector(state => selectCategories(state))

    //Update state when select change value Category
    const handleChangeSelectCat: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const { name, value } = e.target
        setCategory(value)
        if (value) {
            filterSearch({ router, category: value })
        }
    }

    //Update state when select change value Sort
    const handleChangeSelectSort: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const { name, value } = e.target
        setSort(value)
        if (value) {
            filterSearch({ router, sort: value })
        }
    }

    // Set again category when user change url and loadpage
    React.useEffect(() => {
        if (categoryRouter) {
            setCategory(categoryRouter as string)
        } else {
            setCategory('')
        }
    }, [categoryRouter])

    // Set again sort when user change url and loadpage
    React.useEffect(() => {
        if (sortRouter) {
            setSort(sortRouter as string)
        } else {
            setSort('')
        }
    }, [sortRouter])

    //Handle search
    React.useEffect(() => {
        filterSearch({ router, search: search ? search : 'all' })
    }, [search])


    return (
        <Box marginBottom="20px">
            <Grid templateColumns='repeat(8, 1fr)' gap={1}>
                <GridItem colSpan={[8, 8, 8, 2]}>
                    <Select
                        id='category'
                        name='category'
                        value={category}
                        onChange={(e) => handleChangeSelectCat(e)}
                    >
                        <option value="all">
                            All Products
                        </option>

                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </Select>
                </GridItem>


                <GridItem colSpan={[8, 8, 8, 4]}>
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='Search Product'
                    />
                </GridItem>


                <GridItem colSpan={[8, 8, 8, 2]}>
                    <Select
                        id='sort'
                        name='sort'
                        value={sort}
                        onChange={(e) => handleChangeSelectSort(e)}
                    >
                        <option value="-createdAt">
                            Newest
                        </option>
                        <option value="oldest">
                            Oldest
                        </option>
                        <option value="-sold">
                            Beast sales
                        </option>
                        <option value="-price">
                            Price: Hight-Low
                        </option>
                        <option value="price">
                            Price: Low-hight
                        </option>
                    </Select>
                </GridItem>
            </Grid>
        </Box>
    );
}
