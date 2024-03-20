import React, { useState } from 'react'
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner, Button } from 'reactstrap'
import { useEffect } from 'react';
import Range from '../../../components/RangeSlider';
import '../../../../@core/components/autocomplete';
import "../../Home/homev2.scss";
import MakeToOrderForm from './MakeToOrderForm';
import { useQuery } from 'react-apollo';
import { GET_ALL_PARAMETERS } from '../../Parameters/query';
import { GET_ALL_SHAPES } from '../../Shapes/query';

const MoreFiltersModal = (props) => {
    const { model, setModel, data, _FilterArr, MoreFilterArr, handleFilter, reset, handelGlobalFilterReset, TableMin, setTableMin, TableMax, setTableMax, PriceMin, setPriceMin, PriceMax, setPriceMax, DepthMin, setDepthMin, DepthMax, setDepthMax, RatioMin, setRatioMin, RatioMax, setRatioMax, shapes } = props
    const [paramData, setParamData] = useState([])
    const [modalOrder, setmodalOrder] = useState(false)
    const [allShapes, setAllShapes] = useState([])
    const [colors, setColors] = useState([])
    const [clarity, setClarity] = useState([])


    useEffect(async () => {
        const cut = data?.filter(d => d?.paramName === "CUT")[0]
        const Fluorescence = data?.filter(d => d?.paramName === "FLUORESCENCE INTENSITY")[0]
        const table = data?.filter(d => d?.paramName === "TABLE")[0]
        const culet = data?.filter(d => d?.paramName === "CULET")[0]
        const price = data?.filter(d => d?.paramName === "PRICE")[0]
        const depth = data?.filter(d => d?.paramName === "DEPTH")[0]
        const ratio = data?.filter(d => d?.paramName === "RATIO")[0]
        const certificate = data?.filter(d => d?.paramName === "CERTIFICATE")[0]
        setParamData({ cut, Fluorescence, table, culet, price, depth, ratio, certificate })
    }, [data])


    const ApplyFilter = () => {
        _FilterArr(MoreFilterArr)

    }
    const handleOrder = () => {
        setmodalOrder(true)
    }
 

    useEffect(() => {
        setAllShapes(props?.allShapes);
        setColors(data?.find(d => d?.paramName === "COLOR")?.value || [])
        setClarity(data?.find(d => d?.paramName === "CLARITY")?.value || [])

    }, [data]);
    return (
        <div >
            <Modal className="modal-filters" isOpen={model} toggle={() => setModel(!model)}>
                <ModalHeader toggle={() => setModel(!model)}  >
                    <p className='fs-1 fw-bold my-2'>ADVANCED FILTER</p>
                </ModalHeader>
                {/* <hr></hr> */}
                <ModalBody >
                    {/* <div className='fileter-class'> */}
                    <Row>
                        <Col md={6} sm={6}>
                            <div className='content-margin'>
                                <div className="filter-header align-items-center ">
                                    {/* <p>{paramData?.cut?.paramName?.toLowerCase()}</p> */}
                                    <p className='ms-1 '> {"Cut"}</p>
                                    {/* <img src={reset} width={25} className="cursor-pointer  me-1" onClick={() => { handelGlobalFilterReset("CUT") }} /> */}
                                </div>
                                <div className="filter-card checkBoxs-card border-css">
                                    {/* <hr></hr> */}
                                    <div className="otherData">
                                        <ul className='listed-box row mx-0 mt-1 mb-0'>
                                            {paramData?.cut?.value?.map((val, i) => {
                                                const filterData = MoreFilterArr?.find(val => val?.parameter === paramData?.cut?.paramName)?.value || [];
                                                return (<div className='col-lg-6' key={"d" + i}>
                                                    <li>
                                                        <div>
                                                            <label className="check-boxs">{val?.toLowerCase()}
                                                                {filterData?.includes(val) ?
                                                                    <input type="checkbox" onChange={e => { handleFilter(e.target.checked, paramData?.cut?.type, paramData?.cut?.paramName, val, "", "More filter") }}
                                                                        className={`globalFilter-${paramData?.cut?.paramName}`}
                                                                        checked={true}
                                                                    />
                                                                    :
                                                                    <input type="checkbox" onChange={e => { handleFilter(e.target.checked, paramData?.cut?.type, paramData?.cut?.paramName, val, "", "More filter") }}
                                                                        className={`globalFilter-${paramData?.cut?.paramName}`}
                                                                    />
                                                                }
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </div>
                                                    </li>
                                                </div>)
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} sm={6}>
                            <div className='ms-1'>
                                <div className="filter-header ">
                                    {/* <p>{paramData?.certificate?.paramName?.toLowerCase()} (Type of lab)</p> */}
                                    <p className='ms-1 '>{"By Reports"}</p>
                                    {/* <img src={reset} width={25} className="cursor-pointer ms-1 me-1" onClick={() => { handelGlobalFilterReset(paramData?.certificate?.paramName) }} /> */}
                                </div>
                                <div className="filter-card checkBoxs-card border-css" >
                                    {/* <hr></hr> */}
                                    <div className="otherData">
                                        <ul className='listed-box row mt-1 mb-0'>
                                            {
                                                paramData?.certificate?.value?.slice(0, 2)?.map((val, i) => {
                                                    const filterData = MoreFilterArr?.find(a => a?.parameter === paramData?.certificate?.paramName)?.value || [];
                                                    return (<div className='col-lg-6' key={"certificate" + i}>
                                                        <li>
                                                            <div>
                                                                <label className="check-boxs ms-1">{val}
                                                                    {filterData?.includes(val) ?
                                                                        <input type="checkbox" onChange={e => { handleFilter(e.target.checked, paramData?.certificate?.type, paramData?.certificate?.paramName, val, "", "More filter") }}
                                                                            className={`globalFilter-${paramData?.certificate?.paramName}`}
                                                                            checked={true}
                                                                        />
                                                                        :
                                                                        <input type="checkbox" onChange={e => { handleFilter(e.target.checked, paramData?.certificate?.type, paramData?.certificate?.paramName, val, "", "More filter") }}
                                                                            className={`globalFilter-${paramData?.certificate?.paramName}`}
                                                                        />
                                                                    }
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </div>
                                                        </li>
                                                    </div>)
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>

                        <Col md={6} sm={6} >
                            <div className="filter-card content-margin">
                                <div className="filter-header d-flex justify-content-between align-items-center">
                                    <p> Length & Width {paramData?.ratio?.paramName?.toLowerCase()} (L/W)</p>
                                    {/* <img src={reset} width={25} className="cursor-pointer ms-1" onClick={() => { handelGlobalFilterReset(paramData?.ratio?.paramName); setRatioMin(0); setRatioMax(0) }} /> */}
                                    {/* <img src={reset} width={25} className="cursor-pointer ms-1" onClick={d => { handelGlobalFilterReset(paramData?.ratio?.paramName); setRatioMax(0); setRatioMin(0); }} /> */}
                                </div>
                                {/* <hr></hr> */}
                                <div className="otherData">
                                    <div className='filter-diamond'>
                                        {/* <p>The proportional relationship between your diamond's length and width. A perfect round diamond would measure equally 1-to-1, so its LxW ratio would measure as 1.</p> */}
                                        {
                                            <Range
                                                min={RatioMin}
                                                max={RatioMax}
                                                step={0.1}
                                                setMin={setRatioMin}
                                                setMax={setRatioMax}
                                                miniumRange={0}
                                                sign="%"
                                                maximumRange={10}
                                                //  handleFilter={handleFilter}
                                                handleFilter={handleFilter}

                                                // handleFilter={handleFilter}
                                                paramName={paramData?.ratio?.paramName}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} sm={6}>
                            <div className="filter-card">
                                <div className="filter-header">
                                    <p>Diamond {paramData?.price?.paramName?.toLowerCase()}</p>
                                    {/* <img src={reset} width={25} className="cursor-pointer ms-1" onClick={() => { handelGlobalFilterReset(paramData?.price?.paramName); setPriceMin(0); setPriceMax(0) }} /> */}
                                </div>
                                {/* <hr></hr> */}
                                <div className="otherData">
                                    <div className='filter-diamond'>
                                        {/* <p> Many factors impact diamond price. With CVD Mart's Diamond Price Match Guarantee you can be confident you'll get the best price for a diamond. Tip: Tradition tells you to budget 2-3 months' salary for your ring. We say, just do you.</p> */}
                                        <Range
                                            min={PriceMin}
                                            max={PriceMax}
                                            step={100}
                                            setMin={setPriceMin}
                                            setMax={setPriceMax}
                                            miniumRange={0}
                                            sign="$"
                                            maximumRange={50000}
                                            handleFilter={handleFilter}
                                            paramName={paramData?.price?.paramName}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6} sm={6}>
                            <div className="filter-card content-margin">
                                <div className="filter-header d-flex justify-content-between align-items-center">
                                    <p>{paramData?.table?.paramName?.toLowerCase()} (%)</p>
                                    {/* <img src={reset} width={25} className="cursor-pointer ms-1" onClick={() => {
                                        handelGlobalFilterReset(paramData?.table?.paramName); setTableMin(0); setTableMax(0);
                                    }} /> */}
                                </div>
                                {/* <hr></hr> */}
                                <div className="otherData">
                                    <div className='filter-diamond'>
                                        {/* <p>Table percentage tells you how big a diamond’s topmost facet (aka table) is in comparison to its diameter (aka girdle). When that ratio is in the right range, a diamond will sparkle more.</p> */}
                                        <Range
                                            min={TableMin}
                                            max={TableMax}
                                            step={0.1}
                                            setMin={setTableMin}
                                            setMax={setTableMax}
                                            miniumRange={0}
                                            sign="%"
                                            maximumRange={10}
                                            handleFilter={handleFilter}
                                            // handleFilter={handleFilter}
                                            paramName={paramData?.table?.paramName}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} sm={6}>
                            <div className="filter-card">
                                <div className="filter-header ">
                                    <p>Total {paramData?.depth?.paramName?.toLowerCase()} (%)</p>
                                    {/* <img src={reset} width={25} className="cursor-pointer ms-1" onClick={() => { handelGlobalFilterReset(paramData?.depth?.paramName); setDepthMax(0); setDepthMin(0); }} /> */}
                                </div>
                                {/* <hr></hr> */}
                                {/* <div className="otherData"> */}
                                <div className='filter-diamond'>
                                    {/* <p > Depth percentage correlates with a diamond's sparkle factor. It is measured by dividing the diamond height by its diameter. For maximum sparkle, the depth percentage of a round diamond should be between 54% and 66%.</p> */}
                                    <Range
                                        min={DepthMin}
                                        max={DepthMax}
                                        step={1}
                                        setMin={setDepthMin}
                                        setMax={setDepthMax}
                                        miniumRange={0}
                                        sign="%"
                                        maximumRange={100}
                                        handleFilter={handleFilter}
                                        paramName={paramData?.depth?.paramName}
                                    />
                                </div>
                                {/* </div> */}
                            </div>
                        </Col>

                    </Row>
                    {/* </div> */}
                    {/* <Col md={6}>
                            <div className="filter-card">
                                <div className="filter-header d-flex justify-content-between align-items-center">
                                    <p>{paramData?.Fluorescence?.paramName?.toLowerCase()}</p>
                                    <img src={reset} width={25} className="cursor-pointer ms-1" onClick={() => { handelGlobalFilterReset("FLUORESCENCE INTENSITY") }} />
                                </div>
                                <hr></hr>
                                <div className="otherData">
                                    <ul className='listed-box row mx-0 mt-0 mb-0'>
                                        {paramData?.Fluorescence?.value?.map((val, i) => {
                                            const filterData = FilterArr?.find(val => val?.parameter === paramData?.Fluorescence?.paramName)?.value || [];
                                            return (<div className='col-lg-4' key={"d" + i}>
                                                <li>
                                                    <div>
                                                        <label className="check-boxs">{val?.toLowerCase()}
                                                            {filterData?.includes(val) ?
                                                                <input type="checkbox" onChange={e => { handleFilter(e.target.checked, paramData?.Fluorescence?.type, paramData?.Fluorescence?.paramName, val) }}
                                                                    className={`globalFilter-${paramData?.Fluorescence?.paramName}`}
                                                                    checked={true}
                                                                />
                                                                :
                                                                <input type="checkbox" onChange={e => { handleFilter(e.target.checked, paramData?.Fluorescence?.type, paramData?.Fluorescence?.paramName, val) }}
                                                                    className={`globalFilter-${paramData?.Fluorescence?.paramName}`}
                                                                />
                                                            }
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>
                                                </li>
                                            </div>)
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </Col> */}
                    <Row className='mt-2'>
                        <Col md={6} sm={6}>
                            <div className='mb-2 mt-2 d-flex justify-content-end '>
                                <button className='apply-btn rounded px-5' onClick={() => {
                                    setModel(!model)
                                    ApplyFilter()
                                }}>APPLY FILTER</button>

                            </div>
                        </Col>
                        <Col md={6} sm={6}>
                            <div className='mb-2 mt-2 me-1 d-flex  justify-content-start'>
                                <Button color='secondary' outline onClick={() => {
                                    setModel(false)
                                    setmodalOrder(!modalOrder)
                                }}>GENERATE CUSTOM ORDER</Button>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            <MakeToOrderForm
                modal={modalOrder}
                setModal={setmodalOrder}
                shapes={allShapes}
                colors={colors}
                clarity={clarity}
            />
        </div>
    )
}

export default MoreFiltersModal