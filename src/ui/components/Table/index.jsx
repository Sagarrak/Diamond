//library
import React, { Fragment } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Eye, EyeOff, Trash, Copy } from "react-feather";
import { Pagination } from "../Pagination";
//css
import "../../scss/common.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useEffect } from "react";
import { useState } from "react";
const data = localStorage.getItem("UserRes");
let userData = JSON.parse(data);
import { digitalOceanURL } from '../../common/common'
import { UncontrolledTooltip } from "reactstrap";


const userType = localStorage.getItem("utype");

const customStyles = {
    rows: {
        style: {
            border: "1px solid #f3f2f7",
            backgroundColor: "transparent",
        },
    },
    headCells: {
        style: {
            minHeight: "40px",
            backgroundColor: '#f3f2f7'
        },
    },
    table: {
        style: {
            padding: "1rem",
            backgroundColor: "transparent",
            minHeight: 200
        },
    },
};

const Index = (props) => {

    const { columns, data, editData, deleteData, onSort, handlePagination, totalRecords, limit, viewData, currentPage, setKYCdata, setModalKyc, noAction, setModal, modal, copyURL, toolTipMsg, multiSelectRow } = props;
    // handleOnClick,
    const [newColumn, setNewColumn] = useState(columns);


    // const KYCField = {
    //     name: "KYC",
    //     allowOverflow: true,
    //     sortable: false,
    //     cell: (row) => {
    //         return (row?.isKyc ? <Eye className="cursor-pointer" onClick={e => { setModalKyc(true); setKYCdata(row) }} /> : <EyeOff />)
    //     }
    // };

    useEffect(() => {
        if (!noAction && !columns.find((column) => column?.name === "Action")) {
            setNewColumn([
                {
                    name: "Action",
                    allowOverflow: true,
                    sortable: false,
                    cell: (row) => {
                        return (
                            <div className="d-flex">
                                {viewData && <Eye className="me-1 cursor-pointer" id={`ss${viewData?.id}`} onClick={() => { viewData(row); setModal(!modal) }} size={17} />}
                                {editData && <Edit className="me-1 cursor-pointer" size={17} onClick={() => editData(row)} />}
                                {copyURL &&
                                    <>
                                        <Copy className="me-1 cursor-pointer" size={20} onClick={() => copyURL(`${digitalOceanURL}${row?.url}`)} id="copyText" />
                                        <UncontrolledTooltip placement="top" target={"copyText"}>
                                            {toolTipMsg}
                                        </UncontrolledTooltip>
                                    </>
                                }
                                {deleteData && < Trash onClick={() => { deleteData(row?.id); }} className="text-danger cursor-pointer" size={17} />}
                            </div>

                        );
                    },
                }, ...columns,
            ])
        }
    }, [columns])

    // if (
    //     !columns.find((column) => column?.name === "Action")
    // ) {
    //     columns = [
    //         ...columns,
    //         {
    //             name: "Action",
    //             allowOverflow: true,
    //             sortable: false,
    //             cell: (row) => {
    //                 return (
    //                     <div className="d-flex">
    //                         {viewData && <Eye className="me-1 cursor-pointer" onClick={() => viewData(row)} size={17} />}
    //                         {editData && <Edit className="me-1 cursor-pointer" size={17} onClick={() => editData(row)} />}
    //                         <Trash onClick={() => deleteData(row?.id)} className="text-danger cursor-pointer" size={17} />
    //                     </div>   
    //                 );
    //             },
    //         },
    //     ]
    //     if (userData?.userType === "AssociateVendor") columns = columns?.filter(column => column?.name !== "Action")
    //     setKYCdata && columns.push(KYCField)
    // }
    return (
        <Fragment>
            <div className="react-dataTable">
                <DataTable
                    noHeader
                    className="react-dataTable"
                    columns={newColumn}
                    sortIcon={<ChevronDown size={10} />}
                    data={data}
                    customStyles={customStyles}
                    onSort={onSort}
                    selectableRows={multiSelectRow ? true : false}
                    onSelectedRowsChange={multiSelectRow}
                // onRowClicked={handleOnClick}
                />
            </div>
            <Pagination
                currentPage={currentPage}
                handlePagination={handlePagination}
                totalRecords={totalRecords}
                limit={limit}
            />
        </Fragment>
    );
};

export default Index;
