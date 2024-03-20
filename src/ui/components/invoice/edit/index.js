
import { Alert } from 'reactstrap'

// ** Invoice Edit Components
import EditCard from './EditCard'

const InvoiceEdit = ({ data, refetch, closeModal, setLoaderData }) => {

  return data !== null && data !== undefined ? (
    <div className='invoice-edit-wrapper'>
      <EditCard data={data} refetch={refetch} closeModal={closeModal} setLoaderData={setLoaderData} />
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Invoice not found</h4>
      <div className='alert-body'>
        Invoice with id: {data?.id} doesn't exist. Check list of all invoices
      </div>
    </Alert>
  )
}

export default InvoiceEdit
