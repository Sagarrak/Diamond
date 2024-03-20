import React from 'react'
import { Controller } from 'react-hook-form';
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap';

const ImportProductModal = (props) => {
    const { Select, productCategories, importToggleHandler, IMPloading, importModal, onChangeImport, handleImport, control, errors, register, setImpCategory, setOwner } = props;
    return (
        <Modal
            isOpen={importModal}
            toggle={() => importToggleHandler()}
            className={"modal-dialog-centered modal-lg"}
            backdrop={IMPloading ? "static" : undefined}
        >
            <ModalHeader toggle={() => !IMPloading && importToggleHandler()}>Import Inventory</ModalHeader>
            <ModalBody>
                <Row>
                    <Col sm="12">
                        <Form className={`auth-login-form mt-2 ${IMPloading && "pe-none"}`}>
                            <Row>
                                <Col sm="12">
                                    <div className="mb-1">
                                        <Label className="login-label" style={{ marginBottom: 5 }}>
                                            Product Category<span className="text-danger">&#42;</span>
                                        </Label>
                                        <Select
                                            options={productCategories}
                                            placeholder="Select category"
                                            onChange={e => setImpCategory(e)}
                                        />
                                    </div>
                                </Col>
                                <Col sm="12">
                                    <Label className="form-label" htmlFor="inputFile">
                                        Select File<span className="text-danger">&#42;</span>
                                    </Label>
                                    <Input
                                        type="file"
                                        id="inputFile"
                                        name="fileInput"
                                        accept=".xlsx"
                                        onChange={(e) => onChangeImport(e)}
                                    />
                                </Col>
                                <Col sm="12">
                                    <div className="mb-1">
                                        <Label className='ownerName' htmlFor='owner' style={{ marginBottom: 5 }}>
                                            Step 3: Owner Name <span className="text-danger">&#42;</span>
                                        </Label>

                                        <Controller
                                            name='owner'
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Input
                                                        type="text"
                                                        {...register("owner",
                                                            {
                                                                required: true,
                                                            })
                                                        }
                                                        invalid={errors?.owner && true}
                                                        required
                                                        {...field}
                                                        placeholder="Owner Name"
                                                        onChange={(e) => setOwner(e)}
                                                    />
                                                );
                                            }}
                                        />
                                        {errors.owner && <FormFeedback> Owner Name is required </FormFeedback>}
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" outline onClick={(e) => handleImport(e)} disabled={IMPloading}>
                    {IMPloading ? (
                        <>
                            Importing &nbsp; <Spinner size="sm" />
                        </>
                    ) : (
                        "Import"
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default ImportProductModal