//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useQuery } from "react-apollo";
import _ from 'lodash';
//components
import Table from "../../../components/Table";
import { paymentTableColumns } from "../../../components/Constant";//
import ComponentSpinner from "../../../../@core/components/spinner/Loading-spinner";
import { GET_ALL_INVOICES } from "../query";//
import Header from "../../../components/Header";//
import PreviewPayment from "./PreviewPayment";
import { useLocation } from "react-router-dom";


const Index = () => {
    const [loader, setLoader] = useState(false);
    const [modal, setModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allUsers, setAllUsers] = useState([])
    const [invoiceData, setInvoiceData] = useState({})
    const { pathname } = useLocation()
    //query
    const filters = pathname?.includes("rejected-payments") ? { isPaymentApprovedByAdmin: "rejected" } : { isPaymentApprovedByAdmin: "pending" };
    const { loading, data, refetch } = useQuery(GET_ALL_INVOICES, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: JSON.stringify({ isPaymentDoneByUser: true, ...filters }),
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    });
    useEffect(() => {
        setLoader(loading);
    }, [loading]);

    useEffect(() => {
        if (data?.getAllInvoices) {
            setLoader(false);
            setAllUsers(data?.getAllInvoices || []);
        }
    }, [data]);
    // function for  open and close model
    const toggleHandler = () => {
        setModal(!modal);
    };

    // function for edit invoice

    const handleOnClick = (data) => {
        setModal(true);
        setInvoiceData(data)
    }

    //function for handling sort
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
                        title={"Invoice"}
                        // addData={() => addBankData()}
                        // SearchHandling={(e) => SearchHandling(e)}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}
                    />
                    <Table
                        columns={paymentTableColumns}
                        data={allUsers?.data || []}
                        currentPage={currentPage}
                        totalRecords={allUsers?.count || 0}
                        limit={limit}
                        viewData={handleOnClick}
                        // deleteData={deleteUser}
                        onSort={handleSort}
                        handlePagination={0}
                        setModal={setModal}
                        modal={modal}
                    // handleOnClick={handleOnClick}
                    />
                </CardBody>
                <Modal
                    isOpen={modal}
                    toggle={toggleHandler}
                    className={'modal-dialog-centered modal-xl'}>
                    <ModalHeader toggle={() => toggleHandler()}>
                    </ModalHeader>
                    <ModalBody>
                        <PreviewPayment data={invoiceData} refetch={refetch} setModal={setModal} modal={modal} />
                    </ModalBody>
                </Modal>

            </Card>
        </Fragment>
    );
};
export default Index;