import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import {  useQuery } from "react-apollo";

//components
import Table from "../../components/Table";
import { UploadHistoryColumns } from "../../components/Constant";//
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { GET_ALL_UPLOAD_HISTORY } from "./query";//
import Header from "../../components/Header";//


function UploadHistory() {
    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allUploadHistory, setAllUploadHistory] = useState([])


    const { loading, data, refetch } = useQuery(GET_ALL_UPLOAD_HISTORY, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: "",
        },
        fetchPolicy: "cache-and-network",
    });


    useEffect(() => {
        setLoader(loading);
    }, [loading]);

    useEffect(() => {
        if (data?.getAuditLogs) {
            setLoader(false);
            setAllUploadHistory(data?.getAuditLogs);
        }
    }, [data]);

    //function is being called on limit change
    const changeLimit = (e) => {
        e.preventDefault();
        setLoader(true);
        setLimit(parseInt(e?.target?.value));
        setCurrentPage(0);
    };
    //function is being called on change page
    const handlePagination = (page) => {
        setLoader(true);
        setCurrentPage(page?.selected);
    };
    //function is being called on search of value
    const SearchHandling = (e) => {
        setSearchText(e?.target?.value);
        setCurrentPage(0);
    };


    return (
        <Fragment>
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody style={{ flex: "unset", height: "inherit" }}>
                    <Header
                        limit={limit}
                        setLimit={setLimit}
                        changeLimit={(e) => changeLimit(e)}
                        title={"upload history"}
                        SearchHandling={(e) => SearchHandling(e)}
                        setCurrentPage={setCurrentPage}
                    />
                    <Table
                        columns={UploadHistoryColumns}
                        data={allUploadHistory?.data || []}
                        currentPage={currentPage}
                        totalRecords={allUploadHistory?.count || 0}
                        limit={limit}
                        noAction={true}
                        handlePagination={handlePagination}

                    />
                </CardBody>



            </Card>
        </Fragment>
    )
}

export default UploadHistory
