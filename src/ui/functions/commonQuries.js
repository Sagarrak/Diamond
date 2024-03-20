import { useQuery } from 'react-apollo'
import { GET_PRODUCT } from '../pages/Products/query';
import {GET_JEWELLERY} from '../pages/Jewellery/product/query'

export const GetSingleProduct = (handle) => {
    const { data, loading, refetch } = useQuery(GET_PRODUCT, {
        variables: { handle: handle },
        fetchPolicy: 'cache-and-network',
    })

    return { data, loading, refetch }
}

export const GetSingleJewellery=(handle)=>{
    const { data, loading, refetch } = useQuery(GET_JEWELLERY, {
        variables: { getJewelleryId: handle },
        fetchPolicy: 'cache-and-network',
    })

    return { data, loading, refetch }

}