
//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Row, Col, CardTitle, CardText, Form, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

//components
import Table from "../../components/Table";
import { holdRequestTableColumns } from "../../components/Constant";//
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import CommanModal from "../../components/Modal";//
import { ConfirmationModal } from "../../components/Alert";//
import { FormatError } from "../../../@core/components/common/FormatError";//
import { SEND_HOLD_REQUEST, DELETE_HOLD_REQUEST } from "../HoldRequest/mutation";//
import { GET_ALL_HOLD_REQUEST_VENDOR } from "./query";//
import Header from "../../components/Header";//
import HoldRequestEdit from '../../components/invoice/edit/HoldRequestEdit'


const HoldRequest = () => {
    const [loader, setLoader] = useState(false);
    const [modal, setModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allHoldRequest, setAllHoldRequest] = useState([])
    const [holdRequestData, setHoldRequestData] = useState({})
    const [loaderData, setLoaderData] = useState(false)
    const {
        control,
        reset,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { loading, data, refetch } = useQuery(GET_ALL_HOLD_REQUEST_VENDOR, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    });

    const [deleteholdRequest] = useMutation(DELETE_HOLD_REQUEST);

    useEffect(() => {
        setLoader(loading);
    }, [loading]);

    useEffect(() => {
        if (data?.getVendorHoldRequests) {
            setLoader(false);
            setAllHoldRequest(data?.getVendorHoldRequests);
        }
    }, [data]);

    // function for  open and close model
    const toggleHandler = () => {
        setModal(!modal)
        reset({});
    };

    // function for edit invoice

    const handleOnClick = (data) => {
        setModal(true);
        setHoldRequestData(data)
    }


    //function is being called on change page
    const handlePagination = (page) => {
        setLoader(true);
        setCurrentPage(page?.selected);
    };
    //function is being called on search of value

    //function for handling sort
    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };
    const deleteHoldRequest = async (shapeId) => {
        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deleteholdRequest({
                variables: {
                    deleteHoldRequestId: shapeId,
                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteHoldRequest) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal(
                            "success",
                            "Deleted!",
                            "Hold Request has been deleted.",
                            ""
                        );
                    } else {
                        toast.error("Hold Request not deleted");
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
                        title={"hold request"}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}


                    />
                    <Table
                        columns={holdRequestTableColumns}
                        data={allHoldRequest?.data || []}
                        currentPage={currentPage}
                        totalRecords={allHoldRequest?.count || 0}
                        limit={limit}
                        deleteData={deleteHoldRequest}
                        viewData={handleOnClick}
                        onSort={handleSort}
                        noAction={true}
                        handlePagination={handlePagination}

                    // handleOnClick={handleOnClick}
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
                    {
                        loaderData ?
                            <ModalBody style={{ pointerEvents: 'none' }}>
                                <HoldRequestEdit
                                    data={holdRequestData}
                                    refetch={() => refetch()}
                                    closeModal={toggleHandler}
                                    setLoaderData={setLoaderData}
                                />
                            </ModalBody>
                            :
                            <ModalBody>
                                <HoldRequestEdit
                                    data={holdRequestData}
                                    refetch={() => refetch()}
                                    closeModal={toggleHandler}
                                    setLoaderData={setLoaderData}
                                />
                            </ModalBody>
                    }
                </Modal>
            </Card>
        </Fragment>
    )
}

export default HoldRequest