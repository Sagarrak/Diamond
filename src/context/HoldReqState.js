import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo';
import { GET_ALL_HOLD_REQUEST } from '../ui/pages/HoldRequest/query';
import HoldReqContext from './HoldReqContext';
function HolReqState(props) {
    // ** Query
    const [holdReqData, setHoldReqData] = useState([])
    const { loading: holdReqLoading, data, refetch: holdReqRefetch, } = useQuery(GET_ALL_HOLD_REQUEST, {
        variables: {
            page: 1,
            limit: 1000,
            sort: { key: "createdAt", type: -1 },
            filter: "{}",
            search: ''
        },
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => { if (data?.getAllHoldRequests) { setHoldReqData(data?.getAllHoldRequests) } }, [data])
    return (
        <HoldReqContext.Provider value={{ holdReqData, holdReqLoading, holdReqRefetch }}>
            {props.children}
        </HoldReqContext.Provider>
    )
}

export default HolReqState

