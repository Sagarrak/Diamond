import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo';
import { GET_ALL_NOTIFICATIONS } from '../ui/pages/Notification/query'
import NoticationContext from './NotificationContext';

function NotificationState(props) {
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [allNotification, setallNotification] = useState("")


    const userId = localStorage.getItem("UserRes")
    const id = JSON.parse(userId)?.id

    const { data, loading, refetch } = useQuery(GET_ALL_NOTIFICATIONS, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: { key: "createdAt", type: -1 },
            filter: JSON.stringify({ userId: id }),
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    })
    useEffect(() => {
        if(data?.getAllNotifications){
            setallNotification(data?.getAllNotifications)
        }
     
    }, [data])
    


    return (
        <NoticationContext.Provider value={{ allNotification, loading, refetch }}>
            {props.children}
        </NoticationContext.Provider>
    )
}

export default NotificationState