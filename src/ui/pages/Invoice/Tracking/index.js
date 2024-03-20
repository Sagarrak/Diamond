//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import _ from 'lodash';

//components
import Table from "../../../components/Table";
import { paymentTableColumns } from "../../../components/Constant";//
import ComponentSpinner from "../../../../@core/components/spinner/Loading-spinner";
import PreviewInvoice from '../../../components/invoice/preview';
import { GET_ALL_INVOICES } from "../query";//
import Header from "../../../components/Header";//
import { FormatError } from "../../../../@core/components/common/FormatError";
import PreviewPayment from "../Payments/PreviewPayment";
// import PreviewPayment from "./PreviewPayment";


function index() {
    const [loader, setLoader] = useState(false);
    const [modal, setModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allUsers, setAllUsers] = useState([])
    const [invoiceData, setInvoiceData] = useState({})


    //query
    const { loading, data, refetch } = useQuery(GET_ALL_INVOICES, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            // filter: JSON.stringify({}),
            filter: JSON.stringify({ isPaymentApprovedByAdmin: "accepted" }),
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
                        title={"Tracking"}
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
                    className={'modal-dialog-centered modal-xl'}
                >
                    <ModalHeader toggle={() => toggleHandler()}>
                    </ModalHeader>
                    <ModalBody>
                        <PreviewPayment type="tracking" data={invoiceData} refetch={refetch} />
                    </ModalBody>
                </Modal>

            </Card>
        </Fragment>

    )
}

export default index