import React, { Fragment, useEffect, useState } from 'react'
import { GET_ALL_NOTIFICATION, GET_SUBSCRIPTION, GET_NOTIFICATION_WITHOUT_PAGINATION } from './query'
import { useQuery, useSubscription } from 'react-apollo'
import { Card, CardBody, Table } from 'reactstrap';
import Header from '../../components/Header'

const Notification = () => {
    const [allNotificationdata, setallNotificationdata] = useState("")
    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);

    const userRes = localStorage.getItem("UserRes")

    const { data, loading, refetch } = useQuery(GET_ALL_NOTIFICATION, {
        variables: {
            page: 1,
            limit: 100,
            sort: { key: "createdAt", type: -1 },
            filter: "{}",
            search: "",
        },
        fetchPolicy: "cache-and-network",


    })
    const { data: alldata, loading: Loading, refetch: Refetch } = useQuery(GET_NOTIFICATION_WITHOUT_PAGINATION, {
        variables: {
            userId: JSON.parse(userRes)?.id

        },
        fetchPolicy: "cache-and-network",


    })
    const { } = useSubscription(GET_SUBSCRIPTION)

    useEffect(() => {
        if (data?.getAllNotifications) {
            setallNotificationdata(data?.getAllNotifications)

        }

    }, [data])

    return (
        <Fragment>
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody style={{ flex: "unset", height: "inherit" }}>
                    <Header
                        limit={limit}
                        title={"Notification"}
                        // refetch={refetch}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}
                    />
                    <Table
                        // columns={productTableColumns}
                        data={allNotificationdata?.data || []}
                        // currentPage={currentPage}
                        totalRecords={allNotificationdata?.count || 0}
                        limit={limit}
                    // deleteData={DeleteProduct}
                    // onSort={handleSort}
                    // handlePagination={handlePagination}
                    // multiSelectRow={onSelectedRowsChange}
                    />
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default Notification