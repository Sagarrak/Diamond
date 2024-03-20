// ** Reactstrap Imports
import { Card, CardBody, CardText, Row, Col, Table } from 'reactstrap'
import Select from 'react-select';
import Logo from "../../../../assets/images/pages/header-logo.png"
import moment from "moment"
import { useMutation } from 'react-apollo';
import { UPDATE_INVOICE_PRODUCT_STATUS } from '../../../pages/Invoice/mutation';
import { FormatError } from '../../../../@core/components/common/FormatError'
import { toast } from 'react-toastify';
import ImageComp from '../../ImageComp';

const PreviewCard = ({ data, refetch }) => {

  const totalDiscount = data?.invoiceProducts?.map(data => (parseFloat(data?.discount || 0) * (parseFloat(data?.price) * parseInt(data?.quantity))) / 100).reduce((prev, curr) => prev + curr, 0);
  const subTotal = data?.invoiceProducts?.map(data => parseFloat(data?.price) * parseInt(data?.quantity)).reduce((prev, curr) => prev + curr, 0);
  const [statusData] = useMutation(UPDATE_INVOICE_PRODUCT_STATUS);

  const handleStatus = (status, pid) => {
    const input = {
      invoiceId: data?.id,
      productId: pid,
      status: status
    }

    statusData({ variables: { input } }).then((response) => {
      if (response?.data?.updateInvoiceProductStatus?.status) {
        refetch();
        toast.success("Status updated successfully")
      }
    }).catch(err => {
      toast.error(FormatError(err))
    })

  }

  // return data !== null ? (
  return (
    <Card className='invoice-preview-card'>
      <CardBody className='invoice-padding pb-0'>
        {/* Header */}
        <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
          <div>
            <div className='logo-wrapper'>
              <img src={Logo} alt="forevery" width={140} />
            </div>
            <CardText className='mb-25'>Wallasey Ave, North York,</CardText>
            <CardText className='mb-25'>ON M9M 1E1, Canada</CardText>
            <CardText className='mb-0'>+1 (613) 630-1301</CardText>
          </div>
          <div className='mt-md-0 mt-2'>
            <h4 className='invoice-title'>
              Invoice <span className='invoice-number'>#{data?.invoiceNo}</span>
            </h4>
            <div className='invoice-date-wrapper'>
              <p className='invoice-date-title'>Date Issued:</p>
              <p className='invoice-date'>{moment(data?.createdAt).format("DD/MM/YYYY")}</p>
            </div>
          </div>
        </div>
        {/* /Header */}
      </CardBody>

      <hr className='invoice-spacing' />

      {/* Address and Contact */}
      <CardBody className='invoice-padding pt-0'>
        <Row className='invoice-spacing'>
          <Col className='p-0' xl='8'>
            <h6 className='mb-2'>Invoice To: {data?.userEmail}</h6>
            <h6 className='mb-25'>{data?.userId?.fullName}</h6>
          </Col>
          <Col className='p-0 mt-xl-0 mt-2' xl='4'>
            <h6 className='mb-2'>Payment Details:</h6>
            <table>
              <tbody>
                <tr>
                  <td className='pe-1'>Total Due:</td>
                  <td>
                    <span className='fw-bold'>${data?.totalAmount.toFixed(2)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </CardBody>
      {/* /Address and Contact */}

      {/* Invoice Description */}
      <Table responsive >
        <thead>
          <tr>
            <th className='py-1'>Products</th>
            <th className='py-1'>Price</th>
            <th className='py-1'>Quantity</th>
            <th className='py-1'>Discount</th>
            <th className='py-1'>Total</th>
            <th className='py-1 min-width'>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            data?.invoiceProducts?.map((invoice, i) => {              
              const discountPrice = (parseFloat(invoice?.discount) * (parseFloat(invoice?.price) * parseInt(invoice?.quantity))) / 100;
              return (
                <tr key={invoice?.id}>
                  <td className='py-1'>
                    <div className="d-flex align-items-center pb-1">
                      <div style={{ width: '90px', height: '90px' }}>
                        <ImageComp src={invoice?.productId?.image} width='100%' height='100%' />
                      </div>
                      <div>
                        <p className='card-text fw-bold mx-1'>{invoice?.productId?.productName}</p>
                        <p className='card-text text-nowrap mx-1'><span className='fw-bold'>Description :</span> {invoice?.productId?.description}</p>
                        <p className='card-text text-nowrap mx-1'><span className='fw-bold'>Lab Comment :</span>{invoice?.productId?.labComment}</p>
                      </div>
                    </div>
                  </td>
                  <td className='py-1'>
                    <span className='fw-bold'>${invoice?.price}</span>
                  </td>
                  <td className='py-1'>
                    <span className='fw-bold'>{invoice?.quantity}</span>
                  </td>
                  <td className='py-1'>
                    <span className='fw-bold'>${discountPrice ? discountPrice : 0} ({invoice?.discount || 0}%)</span>
                  </td>
                  <td className='py-1'>
                    <span className='fw-bold'>${invoice?.total.toFixed(2)}</span>
                  </td>
                  <td className='py-1'>
                    <Select
                      defaultValue={data?.productStatus ? { label: data?.productStatus, value: data?.productStatus } : { label: "Set Status", value: '' }}
                      onChange={(select) => { handleStatus(select?.value, data?.productId?.id) }}
                      options={[{ label: 'AVAILABLE', value: 'AVAILABLE' }, { label: 'HOLD', value: 'HOLD' }, { label: 'SOLD', value: 'SOLD' }]}
                      // menuPortalTarget={document.body}
                      
                    />
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
      {/* /Invoice Description */}

      {/* Total & Sales Person */}
      <CardBody className='invoice-padding pb-0'>
        <Row className='invoice-sales-total-wrapper'>
          <Col className='mt-md-0 mt-3' md='6' order={{ md: 1, lg: 2 }}>
            <CardText className='mb-0'>
            </CardText>
          </Col>
          <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
            <div className='invoice-total-wrapper'>
              <div className='invoice-total-item'>
                <p className='invoice-total-title'>Subtotal:</p>
                <p className='invoice-total-amount'>${data?.totalAmount.toFixed(2)}</p>
              </div>
            
              <div className='invoice-total-item' hidden={totalDiscount===0}>
                <p className='invoice-total-title'>Total discount:</p>
                <p className='invoice-total-amount'>${totalDiscount}</p>
              </div>
              <hr className='my-50' />
              <div className='invoice-total-item'>
                <p className='invoice-total-title'>Total:</p>
                <p className='invoice-total-amount'>${data?.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
      {/* /Total & Sales Person */}

      <hr className='invoice-spacing' />

      {/* Invoice Note */}
      <CardBody className='invoice-padding pt-0'>
        {data?.notes && 
        <Row>
          <Col sm='12'>
            <span className='fw-bold'>Note: </span>
            <span> {data?.notes} </span>
          </Col>
        </Row>
}
      </CardBody>
      {/* /Invoice Note */}
    </Card>
  )
  // ) : null
}

export default PreviewCard
