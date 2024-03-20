import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../../Home/Header/Header';
import "../jewellery.scss";
import Footer from '../../../../components/Footer';
import { JewelryCategories } from '../GQL/queries';
import { useQuery } from 'react-apollo';
const Products = () => {
    const { id } = useParams()
    const { data, loading } = useQuery(JewelryCategories)
    const jewelryCategories = useMemo(() => data?.jewelryCategoriesWithoutPaginations, [data])
    return (
        <div className='home-page'>
            <div >
                <Header />
                <div className="container" style={{ paddingTop: "160px" }}>
                    <div>
                        <div className="title my-5">
                            <h1 className='product-desc-title text-center'>Jewellery Showcase</h1>
                            <div className="jewelries">
                                <div className="jewelry-categories-section">
                                    <ul className='d-flex justify-content-center align-items-center gap-5'>
                                        {
                                            jewelryCategories?.map((data) => {
                                                return <li key={data?.id} className='jewelry-categories'>{data?.title}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className="jewelries"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer contactsLetter={true} />
            </div>
        </div>
    )
}

export default Products