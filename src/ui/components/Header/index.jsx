//library
import React from 'react';
import { Plus, Upload, RefreshCw, Download } from 'react-feather';
import { useMutation } from "react-apollo";
import { Button, Col, Input, Row, Label } from 'reactstrap';
//components
import { PaginationDropDown } from '../Pagination/PaginationDropDown';
import { IMPORT_PRODUCTS } from "../../pages/Products/mutation";//
import { toast } from 'react-toastify';
import { FormatError } from '../../../@core/components/common/FormatError';
import { useState } from 'react';
import ComponentSpinner from '../../../@core/components/spinner/Loading-spinner';
import Select from "../../components/Select";


const Index = ({
	limit,
	addData,
	title,
	importData,
	modal,
	importToggleHandler,
	setLimit,
	setSearchText,
	setCurrentPage,
	productCategories,
	setProductCategory,
	importCategoryHandler,
	categoryModal,
	matchingModal,
	looselayoutModal,
	matchingToggleHandler,
	looselayoutToggleHandler,
	productCategory,
	layoutToggleHandler,
	layoutsModal,
	uploadHandler,
	exportToExcel

}) => {
	const changeLimit = (e) => {
		e.preventDefault();
		setLimit(parseInt(e?.target?.value));
		setCurrentPage(0);
	};

	//function is being called on search of value
	const SearchHandling = (e) => {
		setSearchText(e?.target?.value);
		setCurrentPage(0);
	};

	return (
		<div className="invoice-list-table-header w-100 pe-1 py-1">
			<Row>
				<Col lg="4" className="d-flex align-items-center  lg-1">
					<div className="d-flex align-items-center me-2 ps-1 w-25">
						<PaginationDropDown title="Show" limit={limit} changeLimit={(e) => changeLimit(e)} />
					</div>
				</Col>

				<Col lg="8" className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0 ">
					{setSearchText && (
						<div className="d-flex align-items-center ">
							<label htmlFor="search-invoice">Search</label>
							<Input id="search-invoice" className="ms-50  w-100" type="text" onChange={SearchHandling} placeholder={"Search " + title + "..."} />
						</div>
					)}
					{productCategories && (
						<div className="mb-1 ms-2">
							<label className="login-label fw-bold" style={{ marginBottom: 5, marginLeft: "20px" }}>
								Add Product
								{/* <span className="text-danger">&#42;</span> */}
							</label>
							<Select options={productCategories} placeholder="Select category" onChange={(e) => {
								setProductCategory(e)
								if (e?.label === "Certified Diamond") {
									importCategoryHandler(!categoryModal)
								}
								else if (e?.label === "Matching Pair") {
									matchingToggleHandler(!matchingModal);
								}
								else if (e?.label === "Loose Diamonds") {
									looselayoutToggleHandler(!looselayoutModal)
								}
								else {
									layoutToggleHandler(!layoutsModal)
								}
							}} />
						</div>
					)}
					{title !== "Product" && addData && (
						<>
							<Button
								color="primary"
								className="btn btn-primary d-flex  align-items-center ms-2"
								onClick={() => {
									addData();
								}}
							>
								<Plus />
								Add {title}
							</Button>
						</>
					)}
					{uploadHandler && (
						<>
							<Button
								color="primary"
								className="btn btn-primary d-flex  align-items-center ms-2"
								onClick={() => {
									uploadHandler();
								}}
							>
								<Plus />
								Upload {title}
							</Button>
						</>
					)}

					{importData && (
						<>
							{/* <Button
								color="primary"
								className="btn btn-primary d-flex align-items-center ms-2"
								// tag={Label}
								onClick={() => importToggleHandler(!modal)}
							>
								<Upload />
								Import {title}
							</Button> */}
							<Button
								color="primary"
								className="btn btn-primary d-flex align-items-center ms-2"
								// tag={Label}
								onClick={() => exportToExcel()}
							>
								<Download />
								Export {title}
							</Button>
							{/* {!addData && (
								<Button color="primary" className="btn btn-primary d-flex align-items-center ms-2" onClick={() => importToggleHandler(!modal)}>
									<RefreshCw style={{ marginRight: "5px" }} />
									Reset {title}
								</Button>
							)} */}
						</>
					)}
				</Col>
			</Row>
		</div>
	);
};

export default Index;
