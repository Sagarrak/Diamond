//library
import { Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";

const Index = (props) => {
	const { modelNo,
		modal,
		setModal,
		updateButtonHandler,
		addButtonHandler,
		nextButtonHandler,
		PreviousButtonHandler,
		toggleHandler,
		loading,
		updateId,
		modalTitle,
		productCategory,
		control,
		setNextPage,
		updateid,
		setupdateid,
		nextPage, name } = props;

	const spinnerStuff = {
		zIndex: 999,
	};

	if (loading) {
		document.getElementsByName;
	}
	return (
		<Fragment>
			<Modal
				isOpen={modal}
				toggle={() => !loading && toggleHandler()}
				className={"modal-dialog-centered modal-lg"}
				backdrop={"static"}
			>
				<ModalHeader toggle={() => !loading && toggleHandler()}>
					{modalTitle}
					{props.title}
				</ModalHeader>
				{loading ? <ModalBody style={{ pointerEvents: "none" }}>{props.children}</ModalBody> : <ModalBody>{props.children}</ModalBody>}
				<ModalFooter className={nextPage ? nextPage !== "Previous" ? "justify-content-between" : '' : ''} >
					{loading ? (
						<Spinner />						
						
					) : updateId ? (
						<>
							{control?._defaultValues?.categoryId?.name !== "Matching Pair" ?
								<Button color="primary" onClick={(e) => updateButtonHandler(e)} outline>
									Update
								</Button>
								: <Button color="primary" onClick={(e) => {
									setupdateid(true)
									nextButtonHandler(e)
								}} outline hidden={nextPage == "Next"}>
									Next
								</Button>
							}
							{nextPage === "Next" && (
								<>
									<Button color="primary" onClick={(e) => PreviousButtonHandler(e)} outline>
										Previous
									</Button>
									<Button color="primary" onClick={(e) => updateButtonHandler(e)} outline >
										Update
									</Button>
								</>

							)}

						</>
					) : (
						<>
							{productCategory?.label !== "Matching Pair" ?

								<Button color="primary" onClick={(e) => addButtonHandler(e)} outline hidden={control?._formValues?.categoryId?.name === "Matching Pair"}>
									Submit
								</Button>

								: <Button color="primary" onClick={(e) => {
									nextButtonHandler(e)
								}} outline hidden={nextPage == "Next"}>
									Next
								</Button>
							}
							{nextPage === "Next" && (
								<>
									<Button color="primary" onClick={(e) => PreviousButtonHandler(e)} outline hidden={control?._formValues?.categoryId?.name === "Matching Pair"} >
										Previous
									</Button>
									<Button color="primary" onClick={(e) => addButtonHandler(e)} outline hidden={control?._formValues?.categoryId?.name === "Matching Pair"} >
										Submit
									</Button>
								</>

							)}
						</>
					)}
				</ModalFooter>
			</Modal>
		</Fragment>
	);
};

export default Index;
