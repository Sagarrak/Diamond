//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Row, Col, CardTitle, CardText, Form, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select';
import _ from 'lodash';


//components
import Table from "../../components/Table";
import { enquiryTableColumns } from "../../components/Constant";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { ConfirmationModal } from "../../components/Alert";
import { FormatError } from "../../../@core/components/common/FormatError";
import { DELETE_ENQUIRY } from "./mutation";
import { GET_ALL_ENQUIRIES } from "./query";
import Header from "../../components/Header";
import InvoiceEdit from '../../components/invoice/edit'

const Index = () => {
    // initial states
    const [loader, setLoader] = useState(false);
    const [modal, setModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allEnquiries, setAllEnquiries] = useState([])
    const [invoiceData, setInvoiceData] = useState({})
    const [loaderData, setLoaderData] = useState(false)

    //query
    const { loading, data, refetch } = useQuery(GET_ALL_ENQUIRIES, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    });
    

    //mutation
    const [deleteEnquiry] = useMutation(DELETE_ENQUIRY);

    useEffect(() => {
        setLoader(loading);
    }, [loading]);

    useEffect(() => {
        if (data?.getAllEnquiries) {
            setLoader(false);
            setAllEnquiries(data?.getAllEnquiries);
        }
    }, [data]);

    const toggleHandler = () => setModal(!modal);
    const handlePagination = (page) => { setLoader(true); setCurrentPage(page?.selected); };
    const handleSort = (e) => { setLoader(true); const type = sort.type == -1 ? 1 : -1; setSort({ key: e?.sortField, type }) };
    const deleteProduct = async (shapeId) => {
        let Status = await ConfirmationModal("warning", "Are you sure?", "You won't be able to revert this!", "Yes, delete it!");
        if (Status) {
            setLoader(true);
            deleteEnquiry({ variables: { deleteEnquiryId: shapeId } })
                .then(async ({ data }) => {
                    if (data?.deleteEnquiry) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal("success", "Deleted!", "Enquiry has been deleted.", "");
                    } else {
                        toast.error("Enquiry not deleted");
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
                        title={"enquiry"}
                        // SearchHandling={(e) => SearchHandling(e)}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}

                    />
                    <Table
                        columns={enquiryTableColumns}
                        data={allEnquiries?.data || []}
                        currentPage={currentPage}
                        totalRecords={allEnquiries?.count || 0}
                        limit={limit}
                        deleteData={deleteProduct}
                        viewData={setInvoiceData}
                        onSort={handleSort}
                        handlePagination={handlePagination}
                        modal={modal}
                        setModal={setModal}
                    />
                </CardBody>
                <Modal
                    isOpen={modal}
                    toggle={toggleHandler}
                    className={'modal-dialog-centered modal-xl'}
                    backdrop={loaderData ? "static" : undefined}
                >
                    <ModalHeader toggle={() => !loaderData && toggleHandler()}>
                    </ModalHeader>
                    <ModalBody style={loaderData ? { pointerEvents: 'none' } : { pointerEvents: 'unset' }}>
                        <InvoiceEdit
                            data={invoiceData}
                            refetch={() => refetch()}
                            closeModal={toggleHandler}
                            setLoaderData={setLoaderData}
                        />
                    </ModalBody>
                </Modal>
            </Card>
        </Fragment>
    );
};
export default Index;