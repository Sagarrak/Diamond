//library
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { useMutation, useQuery, useSubscription } from "react-apollo";
import { toast } from "react-toastify";
//components
import Table from "../../components/Table";
import { notificationTableColumns } from "../../components/Constant";//
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { ConfirmationModal } from "../../components/Alert";//
import { FormatError } from "../../../@core/components/common/FormatError";//
import { DELETE_NOTIFICATION } from "./mutation"
import Header from "../../components/Header";//
import { GET_ALL_NOTIFICATIONS } from "./query";
import Notificationlist from "./Notificationlist";
import classNames from "classnames";
import { GET_SUBSCRIPTION } from "../AssociateVendors/query";
import NotificationContext from "../../../context/NotificationContext";
const Index = () => {
    // initial states
    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allNotification, setAllNotification] = useState([])

    const userId = localStorage.getItem("UserRes")
    const id = JSON.parse(userId)?.id

    //query
    const { loading: notificatioloading, data: notifications } = useSubscription(GET_SUBSCRIPTION)

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
        notifications?.createNotification &&refetch()

    }, [notifications])
    useEffect(() => {
        setLoader(loading);
    }, [loading]);

    useEffect(() => {
        if (data?.getAllNotifications) {
            setLoader(false);
            setAllNotification(data?.getAllNotifications);
        }
    }, [data]);


    return (
        <Fragment>
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody className="email-application pb-1" style={{ flex: "unset" }}>
                    <div
                        style={{ height: "88.8%" }}>
                        <div className="content-body">
                            <div className={classNames("body-content-overlay")}></div>

                            <Notificationlist
                                data={allNotification?.data}
                                setSearchText={setSearchText}
                                pageCount={Math.ceil(allNotification?.count / limit)}
                                setCurrentPage={setCurrentPage}
                                setLimit={setLimit}
                                limit={limit}
                                refetch={refetch}
                                currentPage={currentPage}
                                totalRecords={allNotification?.count}
                            />
                        </div>

                    </div>

                </CardBody>

            </Card>
        </Fragment>
    );
};
export default Index;