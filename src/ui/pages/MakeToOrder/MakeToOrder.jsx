//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
//components
import Table from "../../components/Table";
import { makeToOrderTableColumns } from "../../components/Constant";//
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { ConfirmationModal } from "../../components/Alert";//
import { FormatError } from "../../../@core/components/common/FormatError";//
import { GET_ALL_MAKE_TO_ORDER, DELETE_MAKE_TO_ORDER } from "./gql"
import OrderModel from "./OrderModel";
import Header from "../../components/Header";//
const MakeToOrder = () => {
    // initial states
    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allContacts, setAllContacts] = useState([])
    const [modal, setModal] = useState(false)
    const [viewData, setViewData] = useState([])
    const [deleteMakeToOrder] = useMutation(DELETE_MAKE_TO_ORDER)


    //query
    const { loading, data, refetch } = useQuery(GET_ALL_MAKE_TO_ORDER, {
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
        setLoader(loading);
    }, [loading]);

    useEffect(() => {
        if (data?.getAllMakeToOrders) {
            setLoader(false);
            setAllContacts(data?.getAllMakeToOrders);
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
    //function for handling sort
    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };

    //function is being called on delete of shape
    const deleteProdcut = async (id) => {
        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deleteMakeToOrder({
                variables: {
                    deleteMakeToOrderId: id,
                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteMakeToOrder) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal(
                            "success",
                            "Deleted!",
                            "Record has been deleted.",
                            ""
                        );
                    } else {
                        toast.error("Record not deleted");
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
            <OrderModel
                modal={modal}
                setModal={setModal}
                data={viewData}
            />
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody style={{ flex: "unset", height: "inherit" }}>
                    <Header
                        limit={limit}
                        changeLimit={(e) => changeLimit(e)}
                        title={"contacts"}
                        // addData={() => addShapeData()}
                        SearchHandling={(e) => SearchHandling(e)}
                    />
                    <Table
                        columns={makeToOrderTableColumns}
                        data={allContacts?.data || []}
                        currentPage={currentPage}
                        totalRecords={allContacts?.count || 0}
                        limit={limit}
                        deleteData={deleteProdcut}
                        viewData={(setViewData)}
                        onSort={handleSort}
                        modal={modal}
                        setModal={setModal}
                        handlePagination={handlePagination}
                    />
                </CardBody>
            </Card>
        </Fragment>
    );
};
export default MakeToOrder;