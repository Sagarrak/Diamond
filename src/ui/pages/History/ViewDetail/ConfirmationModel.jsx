import React from 'react'
import { Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap'
import memojiImg from "../../../../assets/images/avatars/memoji.png";
import { digitalOceanURL } from '../../../common/common';
import { useMutation } from 'react-apollo';
import { ACCEPT_INVOICE } from '../mutation';
import { toast } from 'react-toastify';
import { FormatError } from '../../../../@core/components/common/FormatError';


const ConfirmationModel = ({ setModal, modal, invoiceUrl, invoiceNo,refetch }) => {
    const [addStatus, { loading}] = useMutation(ACCEPT_INVOICE);

    const submitStatus = (status) => {
        addStatus({
            variables: { invoiceNo: invoiceNo.toString(), acceptStatus: status },
        })
            .then(async (data) => {
                if (data?.data?.acceptInvoice?.status) {
                    await refetch();
                    toast.success("Order updated successfully");
                    setModal(false)
                }
            })
            .catch((err) => {
                return toast.warn(FormatError(err));
            });
    };
    return (
        <Modal Modal
            isOpen={modal}
            backdrop="static"
            toggle={() => setModal(!modal)} className="d-flex align-items-center justify-content-center h-100 confirmation-modal"
        >
            <ModalBody className='p-0'>
                <div className='text-center'>
                    <div className='memoji-img '>
                        <img src={memojiImg} alt="err" className='w-100 h-100' />
                    </div>
                    <div className='f-20 text-black mt-5 pt-2 mb-3'>
                        Owner Has Approved your request of product Please view invoice and Either Accept Or Reject the status To continue with payment process
                    </div>

                    <div>
                        <a href={digitalOceanURL + (invoiceUrl)} target="_blank">
                            <button className="common-button mb-3">VIEW INVOICE</button>
                        </a>
                    </div>
                    {
                        loading ? <Spinner /> :
                            <div className='d-flex align-items-center justify-content-center'>
                                <button className='f-20 text-white reject-btn btn confirmation-btn me-1' onClick={() => submitStatus("rejected")}>Reject</button>
                                <button className='f-20 text-white aceept-btn btn confirmation-btn' onClick={() => submitStatus("accepted")}>Accept</button>
                            </div>
                    }
                </div>
            </ModalBody>
        </Modal >
    )
}

export default ConfirmationModel