//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { DELETE_INVOICE } from './mutation';
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import _ from 'lodash';

//components
import Table from "../../components/Table";
import { invoiceTableColumns } from "../../components/Constant";//
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import UserInfoCard from '../../components/User';
import PreviewInvoice from '../../components/invoice/preview';
import { ConfirmationModal } from "../../components/Alert";//
import { GET_ALL_INVOICES } from "./query";//
import Header from "../../components/Header";//
import { FormatError } from "../../../@core/components/common/FormatError";


const Index = () => {
    const [loader, setLoader] = useState(false);
    const [modal, setModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allUsers, setAllUsers] = useState([])
    const [invoiceData, setInvoiceData] = useState({})

    const {
        control,
        reset,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm();
    //query
    const { loading, data, refetch } = useQuery(GET_ALL_INVOICES, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    });

    // Mutation
    const [deleteInvoice] = useMutation(DELETE_INVOICE);


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
    // function for add bank
    const addBankData = () => {
        setModal(true);
        reset({});
    };

    // function for edit invoice

    const handleOnClick = (data) => {
        setModal(true);
        setInvoiceData(data)
    }

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
    //function for handling sort
    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };

    //function is being called on delete of user

    const deleteUser = async (userId) => {
        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deleteInvoice({
                variables: {
                    deleteInvoiceId: userId,
                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteInvoice) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal(
                            "success",
                            "Deleted!",
                            "Invoice has been deleted.",
                            ""
                        );
                    } else {
                        toast.error("Invoice not deleted");
                        setLoader(false);
                    }
                })
                .catch((error) => {
                    toast.error(FormatError(error));
                    setLoader(false);
                });
        }
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
                        columns={invoiceTableColumns}
                        data={allUsers?.data || []}
                        currentPage={currentPage}
                        totalRecords={allUsers?.count || 0}
                        limit={limit}
                        viewData={handleOnClick}
                        deleteData={deleteUser}
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
                        {/* <UserInfoCard data={invoiceData} /> */}
                        <PreviewInvoice data={invoiceData} refetch={refetch} />
                    </ModalBody>
                </Modal>

            </Card>
        </Fragment>
    );
};
export default Index;