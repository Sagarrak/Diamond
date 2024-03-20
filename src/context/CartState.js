import React from 'react'
import { useQuery } from 'react-apollo';
import { GET_CART_ITEMS } from '../ui/components/Session/queries';
import CartContext from './CartContext';
function CartState(props) {
    // ** Query
    const {
        loading: cartLoading,
        data: cartData,
        refetch: cartRefetch,
    } = useQuery(GET_CART_ITEMS, {
        fetchPolicy: "no-cache",
    });


    return (
        <CartContext.Provider value={{ cartData, cartLoading, cartRefetch }}>
            {props.children}
        </CartContext.Provider>
    )
}

export default CartState

