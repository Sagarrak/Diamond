// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Third Party Components
import axios from 'axios'

// ** Reactstrap Imports
import { Alert, Row, Col } from 'reactstrap'

// ** Invoice Edit Components
import HoldRequestEditCard from './EditHoldRequestCard'

const HoldRequestEdit = ({ data, refetch, closeModal, setLoaderData }) => {

    return data !== null && data !== undefined ? (
        <div className='invoice-edit-wrapper'>
            <HoldRequestEditCard data={data} refetch={refetch} closeModal={closeModal} setLoaderData={setLoaderData} />
        </div>
    ) : (
        <Alert color='danger'>
            <h4 className='alert-heading'>Request Status not found</h4>
            <div className='alert-body'>
                {/* Invoice with id: {data?.id} doesn't exist. Check list of all invoices:{' '} */}
                {/* <Link to='/apps/invoice/list'>Invoice List</Link> */}
            </div>
        </Alert>
    )
}

export default HoldRequestEdit
