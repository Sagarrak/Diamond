import { useEffect, useState } from 'react'
import { Hash, Trash } from 'react-feather'
import { Row, Col, Card, Input, Label, Button, CardBody, CardText, InputGroup, InputGroupText, Table } from 'reactstrap'
import 'react-slidedown/lib/slidedown.css'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/base/pages/app-invoice.scss'
import EditActions from './EditActions'
import moment from 'moment';
import Logo from "../../../../assets/images/pages/header-logo.png";
import { ConfirmationModal } from '../../Alert'
import { DELETE_ENQUIRY_ITEMID } from '../../../pages/Enquiry/mutation'
import { useMutation } from 'react-apollo'
import { toast } from 'react-toastify'

const InvoiceEditCard = ({ data, refetch, closeModal, setLoaderData }) => {
  const [notes, _notes] = useState('')
  const [products, _products] = useState([])
  // // console.log("🚀 ~ file: EditCard.js:18 ~ products:", products)
  const [inputParams, _inputParams] = useState({})
  const [totalValue, _totalValue] = useState(0)
  const [totalDiscount, _totalDiscount] = useState(0)
  const [subTotal, _subTotal] = useState(0)
  const [netAmount, setNetAmount] = useState(0)
  const [defaultCarats, setdefaultCarats] = useState()
  //mutation
  const [deleteEnquiryItemId] = useMutation(DELETE_ENQUIRY_ITEMID);

  useEffect(() => {
    if (data) {
      let input = {
        invoiceNo: data?.enquiryNo,
        invoiceId: data?.id,
        userEmail: data?.createdBy?.email,
        userName: data?.createdBy?.fullName,
        userId: data?.createdBy?.id,
        totalAmount: totalValue,
        subTotal,
        totalDiscount,
        notes
      }

      let details = []

      data?.items?.map((res) => {
        let total = parseFloat(res?.itemId?.PricePerCarat) * parseFloat(res?.carats);
        if (res?.itemId?.categoryId?.name === "Matching Pair") {
          total = (total + parseFloat(res?.itemId?.matchingPairId?.PricePerCarat) * parseFloat(res?.itemId?.matchingPairId?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value))
        }
        let newData = {
          productId: res?.itemId?.id,
          productName: res?.itemId?.productName,
          quantity: res?.quantity || 1,
          discount: res?.itemId?.discount || 0,
          price: res?.itemId?.totalPrice || 0,
          carats: `${res?.carats || 0}`,
          total: total || 0,
        }
        details.push(newData)
      })
      input.invoiceProducts = details;
      _products(details)
      _inputParams(input)
    }

  }, [data])


  useEffect(() => {
    if (products?.length > 0) {

      _inputParams({ ...inputParams, invoiceProducts: products })
      // const newVal = products.map(item => (item?.price * item?.quantity * (100 - item?.discount)) / 100).reduce((prev, next) => prev + next)
      // const newDiscount = products.map(item => (item?.price * item?.quantity * item?.discount) / 100).reduce((prev, next) => prev + next)
      // const newTotal = products.map(item => (item?.price * item?.quantity)).reduce((prev, next) => prev + next)      

      const total = products.reduce((prev, current) => { return prev + parseFloat(current.total); }, 0)
      // // console.log("🚀 ~ file: EditCard.js:75 ~ useEffect ~ total:", total)
      const newDiscount = 0;
      const newTotal = total;

      _totalValue(total)
      setNetAmount(total)
      _totalDiscount(newDiscount)
      _subTotal(newTotal)
      _inputParams({ ...inputParams, totalAmount: total, totalDiscount: newDiscount, subTotal: newTotal })
    }
  }, [products])



  // updating notes in input params


  useEffect(() => {
    if (notes != '' && notes != undefined) {
      _inputParams({ ...inputParams, notes })
    }
  }, [notes])

  const handleChange = (carat, id, carats, PricePerCarat, maxcarat) => {
    let data = [...products]
    const index = data?.findIndex(d => d?.productId === id);
    if (index >= 0) {
      if (carats > 0 && carats <= maxcarat) {
        data[index].carats = `${carats}`;
        data[index].total = parseFloat(carats) * parseFloat(PricePerCarat) || 0

      } else {
        setdefaultCarats(carat)
        data[index].carats = `${carat}`;
        toast.error(`Please enter minimum 0.1 and maximum ${maxcarat} carats`)
      }


    }
    _products(data)
  }

  //parseFloat(items?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value
  const deleteData = async (id, itemId) => {
    let Status = await ConfirmationModal("warning", "Are you sure?", "You won't be able to revert this!", "Yes, delete it!");
    if (Status) {
      deleteEnquiryItemId({ variables: { deleteEnquiryItemIdId: id, itemId: itemId } })
        .then(async ({ data }) => {
          if (data?.deleteEnquiryItemId) {
            refetch();
            await ConfirmationModal("success", "Deleted!", "Invoice ItemId has been deleted.", "");
            closeModal()

          } else {
            toast.error("Invoice ItemId not deleted");
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
        });
    }


  }

  return (
    <div className='invoice-edit-wrapper'>
      <Row className='invoice-edit'>
        <Col xl={9} md={8} sm={12}>
          <Card className='invoice-preview-card'>
            <CardBody className='invoice-padding pb-0'>
              <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                <div>
                  <div className='brand-logo mb-1'>
                    <img src={Logo} alt="logo" width={140} />
                  </div>
                  <p className='card-text mb-25'>Wallasey Ave, North York,</p>
                  <p className='card-text mb-25'>ON M9M 1E1, Canada</p>
                  <p className='card-text mb-0'>+1 (613) 630-1301</p>
                </div>
                <div className='invoice-number-date mt-md-0 mt-2'>
                  <div className='d-flex align-items-center justify-content-md-end mb-1'>
                    <h4 className='invoice-title'>Invoice</h4>
                    <InputGroup className='input-group-merge invoice-edit-input-group disabled'>
                      <InputGroupText>
                        <Hash size={15} />
                      </InputGroupText>
                      <Input
                        type='String'
                        className='invoice-edit-input'
                        value={data?.enquiryNo}
                        placeholder='53634'
                        disabled
                      />
                    </InputGroup>
                  </div>
                  <div className='mt-md-0 mt-2'>
                    <div className='invoice-date-wrapper'>
                      <p className='invoice-date-title'>Date Issued:</p>
                      <p className='invoice-date'>{moment(data?.createdAt).format("DD/MM/YYYY")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>

            <hr className='invoice-spacing' />

            <CardBody className='invoice-padding pt-0'>
              <Row className='invoice-spacing'>
                <Col className='p-0' xl='8'>
                  <h6 className='mb-2'>Invoice To:</h6>
                  <h6 className='mb-25'>{data?.userName}</h6>
                  <CardText className='mb-25'>{data?.userEmail}</CardText>
                </Col>
                <Col className='p-0 mt-xl-0 mt-2' xl='4'>
                  <h6 className='mb-2'>Payment Details:</h6>
                  <table>
                    <tbody>
                      <tr>
                        <td className='pe-1'>Total Due:</td>
                        <td>
                          <span className='fw-bolder'>${netAmount?.toFixed(2)}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </CardBody>
            <CardBody className='invoice-padding invoice-product-details'>
              <Table responsive>
                <thead>
                  <tr>
                    <th>StockId #</th>
                    <th>Category</th>
                    <th>Price per CT.</th>
                    <th>Carats</th>
                    <th>Net Amount ($)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((res) => {
                    if (res?.itemId?.categoryId?.name === "Matching Pair") {
                      return (
                        <>
                          <tr key={res?.id}>
                            <td><strong style={{ fontFamily: "OutfitRegular" }}>(pair) </strong>{res?.itemId?.productName}</td>
                            <td>{res?.itemId?.categoryId?.name}</td>
                            <td>{res?.itemId?.PricePerCarat?.toFixed(2)}</td>
                            <td>{res?.carats}</td>
                            <td>{(parseFloat(res?.carats) * parseFloat(res?.itemId?.PricePerCarat))?.toFixed(2)}</td>
                            {data?.items?.length == 1 ? '' : <td><Trash onClick={() => { deleteData(data?.id, res?.itemId?.id); }} className="text-danger cursor-pointer" size={17} /></td>}

                          </tr>
                          <tr key={res?.id}>
                            <td><strong style={{ fontFamily: "OutfitRegular" }}>(pair)</strong> {res?.itemId?.matchingPairId?.productName}</td>
                            <td>{res?.itemId?.matchingPairId?.categoryId?.name}</td>
                            <td>{res?.itemId?.matchingPairId?.PricePerCarat?.toFixed(2)}</td>
                            <td>{res?.itemId?.matchingPairId?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value}</td>
                            <td>{(parseFloat(res?.itemId?.matchingPairId?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value) * parseFloat(res?.itemId?.matchingPairId?.PricePerCarat))?.toFixed(2)}</td>
                            {data?.items?.length == 1 ? '' : <td><Trash onClick={() => { deleteData(data?.id, res?.itemId?.id); }} className="text-danger cursor-pointer" size={17} /></td>}
                          </tr>
                        </>
                      )
                    } else {
                      return (
                        <tr key={res?.id}>
                          <td>{res?.itemId?.productName}</td>
                          <td>{res?.itemId?.categoryId?.name}</td>
                          <td>{res?.itemId?.PricePerCarat?.toFixed(2)}</td>
                          <td>
                            {
                              res?.itemId?.categoryId?.name === "Layouts" || res?.itemId?.categoryId?.name === "Loose Diamonds" ?
                                <Input type='number' min={0} value={defaultCarats  ? defaultCarats : res?.carats} style={{ width: "80px" }} onChange={(e) => setdefaultCarats(e?.target?.value)} onBlur={e => {
                                  handleChange(res?.carats, res?.itemId?.id, e?.target?.value, res?.itemId?.PricePerCarat, parseFloat(res?.itemId?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value))

                                }} />
                                :
                                res?.carats
                            }
                          </td>
                          <td>{
                            res?.itemId?.categoryId?.name === "Layouts" || res?.itemId?.categoryId?.name === "Loose Diamonds" ?

                              (products?.filter(d => d?.productId === res?.itemId?.id)?.[0]?.total || (parseFloat(res?.carats) * parseFloat(res?.itemId?.PricePerCarat)))?.toFixed(2)
                              :
                              (parseFloat(res?.carats) * parseFloat(res?.itemId?.PricePerCarat))?.toFixed(2)
                          }</td>
                          {data?.items?.length == 1 ? '' : <td><Trash onClick={() => { deleteData(data?.id, res?.itemId?.id); }} className="text-danger cursor-pointer" size={17} /></td>}


                        </tr>
                      )
                    }
                  })
                  }

                </tbody >
              </Table>
            </CardBody>
            <CardBody className='invoice-padding'>
              <Row className='invoice-sales-total-wrapper'>
                <Col className='mt-md-0 mt-3' md={{ size: '6', order: 1 }} xs={{ size: 12, order: 2 }}>
                </Col>
                <Col className='d-flex justify-content-end' md={{ size: '6', order: 2 }} xs={{ size: 12, order: 1 }}>
                  <div className='invoice-total-wrapper'>
                    <hr className='my-50' />
                    <div className='invoice-total-item'>
                      <p className='invoice-total-title'>Total:</p>
                      <p className='invoice-total-amount'>${netAmount?.toFixed(2)}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
            <hr className='invoice-spacing mt-0' />
            <CardBody className='invoice-padding py-0'>
              <Row>
                <Col>
                  <div className='mb-2'>
                    <Label htmlFor='note' className='form-label fw-bold'>
                      Note:
                    </Label>
                    <Input type='textarea' rows='2' id='note' defaultValue={notes} onChange={(e) => { e?.preventDefault(); _notes(e?.target?.value) }} />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col xl={3} md={4} sm={12}>
          <EditActions inputParams={inputParams} refetch={refetch} closeModal={closeModal} setLoaderData={setLoaderData} />
        </Col>
      </Row>
    </div >
  )
}

export default InvoiceEditCard
