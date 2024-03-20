// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Third Party Components
import axios from 'axios'

// ** Reactstrap Imports
import { Row, Col, Alert } from 'reactstrap'

// ** Invoice Preview Components
import PreviewCard from './PreviewCard'
import PreviewActions from './PreviewActions'
import AddPaymentSidebar from '../shared-sidebar/SidebarAddPayment'
import SendInvoiceSidebar from '../shared-sidebar/SidebarSendInvoice'

// ** Styles
import '@styles/base/pages/app-invoice.scss'

const InvoicePreview = ({ data, refetch }) => {
  // ** HooksVars
  const { id } = useParams()

  // ** States
  // const [data, setData] = useState(null)
  const [sendSidebarOpen, setSendSidebarOpen] = useState(false)
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)

  // ** Functions to toggle add & send sidebar
  const toggleSendSidebar = () => setSendSidebarOpen(!sendSidebarOpen)
  const toggleAddSidebar = () => setAddPaymentOpen(!addPaymentOpen)

  // ** Get invoice on mount based on id
  // useEffect(() => {
  //   axios.get(`/api/invoice/invoices/${id}`).then(response => {
  //     setData(response.data)
  //   })
  // }, [])

  // return data !== null && data.invoice !== undefined ? (
  return (
    <div className='invoice-preview-wrapper'>
      <Row className='invoice-preview'>
        <Col >
          <PreviewCard data={data} refetch={refetch} />
        </Col>
      </Row>
      {/* <SendInvoiceSidebar toggleSidebar={toggleSendSidebar} open={sendSidebarOpen} />
      <AddPaymentSidebar toggleSidebar={toggleAddSidebar} open={addPaymentOpen} /> */}
    </div>
  )
  // : (
  //   <Alert color='danger'>
  //     <h4 className='alert-heading'>Invoice not found</h4>
  //     <div className='alert-body'>
  //       Invoice with id: {id} doesn't exist. Check list of all invoices:{' '}
  //       <Link to='/apps/invoice/list'>Invoice List</Link>
  //     </div>
  //   </Alert>
  // )
}

export default InvoicePreview
