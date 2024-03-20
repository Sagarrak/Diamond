// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from "react-apollo";
import { toast } from "react-toastify";

// ** Reactstrap Imports
import { Card, CardBody, Button, Spinner } from 'reactstrap'
import { ADD_INVOICE } from './Mutation'
import { FormatError } from '../../../../@core/components/common/FormatError';

const EditActions = ({ inputParams, refetch, closeModal, setLoaderData }) => {
  const [loader, setLoader] = useState(false)
  const [addInvoiceMutation, { loading }] = useMutation(ADD_INVOICE);
  const [productStatus, setProductStatus] = useState("HOLD")
  // useEffect(() => { setLoaderData(true) }, [])
  const addInvoice = () => {
    setLoader(true)
    setLoaderData(true);

    addInvoiceMutation({
      variables: {
        input: { ...inputParams, productStatus },
      },
    })
      .then(({ data }) => {
        if (data?.addInvoice?.status) {
          refetch()
          closeModal()
          refetch();
          toast.success("Invoice generated successfully");
          setLoader(false)
          setLoaderData(false);
        } else {
          toast.warn(data?.addInvoice?.message);
          closeModal()
          setLoader(false)
          setLoaderData(false);
        }
      })
      .catch((error) => {
        toast.warn(FormatError(error));
        closeModal()
        setLoader(false)
        setLoaderData(false);
      });
  }

  return (
    <Fragment>
      <Card className='invoice-action-wrapper'>
        <CardBody>
          <Button color='primary' block className='' onClick={() => { addInvoice() }}>
            Send Invoice&nbsp;{loader && <Spinner color='light' size='sm' className='mr-2' />} </Button>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default EditActions
