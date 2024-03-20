import React, { useEffect, useState } from 'react'
import CompareContext from './CompareContext'
function WishListState(props) {
    const productIDs = localStorage.getItem("compareProducts") ? JSON.parse(localStorage.getItem("compareProducts")) : []
    const [compareProducts, setCompareProducts] = useState(productIDs)
    useEffect(() => {
        localStorage?.setItem("compareProducts", JSON.stringify(compareProducts))
    }, [compareProducts])
    return (
        <CompareContext.Provider value={{ compareProducts, setCompareProducts }}>
            {props.children}
        </CompareContext.Provider>
    )
}

export default WishListState

