import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { useQuery } from "react-apollo";

import Table from "../../components/Table";
import { vendorOrderHistory } from "../../components/Constant";//
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";

import { GET_ALL_VENDOR_ORDER_HISTORY } from "./query";//
import Header from "../../components/Header";//

function OrderHistory() {

    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState('');    
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allVendorOrderHistory, setAllVendorOrderHistory] = useState([])



    const { loading, data, refetch } = useQuery(GET_ALL_VENDOR_ORDER_HISTORY, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    });
    useEffect(() => {
        if (data?.getVendorOrderHistories) {
            setLoader(false)
            setAllVendorOrderHistory(data?.getVendorOrderHistories)

        }
    }, [data])

    //function is being called on change page
    const handlePagination = (page) => {
        setLoader(true);
        setCurrentPage(page?.selected);
    };
    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };

    return (
        <Fragment>
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody style={{ flex: "unset", height: "inherit" }}>
                    <Header
                        limit={limit}
                        // changeLimit={(e) => changeLimit(e)}
                        title={"order history"}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        // SearchHandling={(e) => SearchHandling(e)}
                        setCurrentPage={setCurrentPage}
                    />
                    <Table
                        columns={vendorOrderHistory}
                        data={allVendorOrderHistory?.data || []}
                        currentPage={currentPage}
                        totalRecords={allVendorOrderHistory?.count || 0}
                        limit={limit}
                        onSort={handleSort}
                        noAction={true}
                        handlePagination={handlePagination}
                        setCurrentPage={setCurrentPage}


                    />
                </CardBody>


            </Card>
        </Fragment>
    )
}

export default OrderHistory