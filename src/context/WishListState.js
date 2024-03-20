import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo';
import { GET_ALL_WHISH_LIST } from '../ui/pages/Home/query';
import WishListContext from './WishListContext';
function WishListState(props) {
    // ** Query
    const [wishListData, setWishListData] = useState([])
    const {
        loading: wishListLoading,
        data,
        refetch: wishListRefetch,
    } = useQuery(GET_ALL_WHISH_LIST, {
        variables: {
            page: 1,
            limit: 500,
            sort: {
                key: "createdAt",
                type: -1
            }
        },
        fetchPolicy: "cache-and-network",
    });


    useEffect(() => {
        if (data) {
            setWishListData(data)
        }
    }, [data])
    return (
        <WishListContext.Provider value={{ wishListData, wishListLoading, wishListRefetch }}>
            {props.children}
        </WishListContext.Provider>
    )
}

export default WishListState

