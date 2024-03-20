import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from "react-apollo";
import { useParams } from 'react-router-dom';
import { GET_ALL_PARAMETERS } from '../Parameters/query'
import { GET_ALL_SHAPES } from '../Shapes/query'
import { GET_ALL_CATEGORIES } from '../Categories/query';
import Header from '../Home/Header/Header';
import './inventory.scss'
import { Row, Col, CardBody, Card, Button, UncontrolledTooltip } from 'reactstrap';
import reset from '../../../assets/images/images/reset.svg'
import { ChevronDown, X } from 'react-feather';
import FilteredData from './FilteredData';
import ImageComp from '../../components/ImageComp';
import refreshIcon from "../../../../src/assets/images/pages/refresh-icon.png";
// import moreShapesImage from "@src/assets/images/pages/moreShapesImage.svg";
import _ from 'lodash';
import AutoComplete from '@components/autocomplete'
import Footer from '../../components/Footer';
import MoreFiltersModal from './MakeToOrder/MoreFiltersModal';
import { SUGGESTIONS } from './query';
import SeoContent from './SeoContent';
import MakeToOrderForm from './MakeToOrder/MakeToOrderForm';


const CertifiedDiamond = () => {

    const LocalSelectedFilter = JSON.parse(localStorage?.getItem('LocalFilterArr'))
    const LocalSelectedShapeFilter = JSON.parse(localStorage?.getItem('LocalShapeFilterArr'))
    const LocalCategoryID = localStorage?.getItem('categoryID');
    const LocalCategoryName = localStorage?.getItem('categoryName');
    const [allCategories, _allCategories] = useState([])
    const [allParams, setAllParams] = useState([])
    const [searchString, setSearchString] = useState('');
    const [allShapes, setAllShapes] = useState([])
    const [shapesFilter, setShapesFilter] = useState([])
    const [groupedParams, setGroupedParams] = useState({})
    const [FilterArr, _FilterArr] = useState(LocalSelectedFilter || []);
    const [MoreFilterArr, _MoreFilterArr] = useState(LocalSelectedFilter || []);
    const [shapeFilterArr, _shapeFilterArr] = useState(LocalSelectedShapeFilter || []);
    const [pageType, _pageType] = useState('')
    const [filterModel, setFilterModel] = useState(false);
    const [shapeLimit] = useState(500);
    const [categoryId, setCategoryId] = useState(LocalCategoryID || '')
    const [categoryName, setCategoryName] = useState(LocalCategoryName || '')
    const [shapeOtherVisible, _shapeOtherVisible] = useState(true);
    const [DropDown, _DropDown] = useState([{ toggle: false }]);
    const urlParams = useParams();
    const [suggestions, setSuggestions] = useState([]);
    const [hoverOn, setHoverOn] = useState('');
    const [moreShapes, setMoreShapes] = useState(false);
    const [from, setFrom] = useState(0)
    const [to, setTo] = useState(0)
    const [height, setHeight] = useState(0)
    const [colors, setColors] = useState([])
    const [clarity, setClarity] = useState([])
    const ref = useRef(null)
    const localFilterData = JSON.parse(localStorage?.getItem("LocalFilterArr"));

    const localPrice = localFilterData?.filter(d => d?.parameter === "PRICE");
    const localTable = localFilterData?.filter(d => d?.parameter === "TABLE");
    const localDepth = localFilterData?.filter(d => d?.parameter === "DEPTH");
    const localRatio = localFilterData?.filter(d => d?.parameter === "RATIO");

    const [TableMin, setTableMin] = useState(localTable?.length > 0 ? localTable?.[0]?.value?.from : 0);
    const [TableMax, setTableMax] = useState(localTable?.length > 0 ? localTable?.[0]?.value?.to : 0);

    const [PriceMin, setPriceMin] = useState(localPrice?.length > 0 ? localPrice?.[0]?.value?.from : 0);
    const [PriceMax, setPriceMax] = useState(localPrice?.length > 0 ? localPrice?.[0]?.value?.to : 0);

    const [DepthMin, setDepthMin] = useState(localDepth?.length > 0 ? localDepth?.[0]?.value?.from : 0);
    const [DepthMax, setDepthMax] = useState(localDepth?.length > 0 ? localDepth?.[0]?.value?.to : 0);

    const [RatioMin, setRatioMin] = useState(localRatio?.length > 0 ? localRatio?.[0]?.value?.from : 0);
    const [RatioMax, setRatioMax] = useState(localRatio?.length > 0 ? localRatio?.[0]?.value?.to : 0);

    const [modal, setModal] = useState(false);
    const inputVar = {
        page: 1,
        limit: 1000,
        sort: { key: "createdAt", type: -1 },
        filter: "{}",
        search: ''
    }

    // ========================= Queries =========================
    const { data } = useQuery(GET_ALL_PARAMETERS, {
        variables: {
            page: 1,
            limit: 1000,
            sort: { key: "sortOrder", type: 1 },
            filter: "{}",
            search: ''
        },
        fetchPolicy: "no-cache",
    });

    const { data: catData } = useQuery(GET_ALL_CATEGORIES, {
        variables: inputVar,
        fetchPolicy: "no-cache",
    });

    const { data: shapeData } = useQuery(GET_ALL_SHAPES, {
        variables: {
            page: 1,
            limit: shapeLimit,
            sort: { key: "sortOrder", type: 1 },
            filter: "{}",
            search: ""
        },
        fetchPolicy: "cache-and-network",
    });
    const { data: suggestionsData } = useQuery(SUGGESTIONS, { variables: { "search": searchString, "limit": 10 }, fetchPolicy: "cache-and-network" });

    // settingUp page type
    const LocalType = localStorage?.getItem("visitedPages") ? JSON.parse(localStorage?.getItem("visitedPages")) : [];


    useEffect(() => {
        if (suggestionsData?.suggestion?.length > 0) {
            let data = []
            suggestionsData?.suggestion?.map(d => data.push({ title: d }))
            setSuggestions(data)
        }
    }, [suggestionsData])

    useEffect(() => {
        const LOCAL_CAT_ID = localStorage.getItem("categoryID")
        const LOCAL_CAT_Name = localStorage.getItem("categoryName")
        allCategories?.data?.map(d => {
            const arr = [...LocalType]
            if (arr?.length > 6) { arr?.splice(0, (arr?.length - 6)) }
            if (d?.alias === urlParams?.type) {
                arr.push(d?.name)
                _pageType(d?.name);
                localStorage?.setItem("visitedPages", JSON.stringify(arr))
            }
        })
        const certifiedCategory = allCategories?.data?.filter(d => d?.name === "Certified Diamond");
        setCategoryId((LOCAL_CAT_ID && LOCAL_CAT_ID != "undefined") ? LOCAL_CAT_ID : certifiedCategory?.[0]?.id)
        setCategoryName((LOCAL_CAT_Name && LOCAL_CAT_Name != "undefined") ? LOCAL_CAT_Name : certifiedCategory?.[0]?.name)
    }, [urlParams, allCategories])

    useEffect(() => {
        if (data?.getAllParameter?.data) {
            setAllParams(data?.getAllParameter?.data);
            let grouped = _.mapValues(_.groupBy(data?.getAllParameter?.data, 'category'), (clist) => clist.map(car => _.omit(car, 'category')));

            setColors(grouped?.Global?.find(d => d?.paramName === "COLOR")?.value || [])
            setClarity(grouped?.Global?.find(d => d?.paramName === "CLARITY")?.value || [])
            setGroupedParams(grouped)
        }
    }, [data]);

    useEffect(() => {
        if (pageType !== "Special Cut") {
            _shapeOtherVisible(true);
        } else {
            _shapeOtherVisible(false);
        }
    }, [pageType])

    // useEffect(() => {
    //     let grouped = _.mapValues(_.groupBy(allParams, 'category'), (clist) => clist.map(car => _.omit(car, 'category')));
    //     setGroupedParams(grouped)
    // }, [allParams])

    useEffect(() => {
        if (catData?.getAllCategories) _allCategories(catData?.getAllCategories);
    }, [catData])

    useEffect(() => {
        if (shapeData?.getAllShapes) setAllShapes(shapeData?.getAllShapes);
    }, [shapeData]);

    useEffect(() => {
        localStorage.setItem("LocalShapeFilterArr", JSON.stringify(shapeFilterArr))
        localStorage.setItem("LocalFilterArr", JSON.stringify(FilterArr))
        localStorage.setItem("categoryID", categoryId)
        localStorage.setItem("categoryName", categoryName)



        // Clearing Range based on their filter
        if (FilterArr?.filter(d => d?.parameter === "TABLE")?.length <= 0) { setTableMin(0); setTableMax(0); }
        if (FilterArr?.filter(d => d?.parameter === "RATIO")?.length <= 0) { setRatioMin(0); setRatioMax(0); }
        if (FilterArr?.filter(d => d?.parameter === "PRICE")?.length <= 0) { setPriceMin(0); setPriceMax(0); }
        if (FilterArr?.filter(d => d?.parameter === "DEPTH")?.length <= 0) { setDepthMin(0); setDepthMax(0); }
    }, [shapeFilterArr, FilterArr, categoryId])


    // Creating Shape Array
    const handleShapeFilter = (value) => {
        const arr = [...shapeFilterArr]
        const index = arr.findIndex(d => d == value);
        if (index >= 0 && index != undefined) arr?.splice(arr?.indexOf(value), 1);
        else arr.push(value);
        _shapeFilterArr(arr);
    }

    // * Creating Main array of all selected filter params
    const handleFilter = (status, type, parameter, value, to, key) => {
        // let values = key === "More filter" ? [...MoreFilterArr] : [...FilterArr];
        let values = key === "More filter" ? [...MoreFilterArr] : [...FilterArr];
        if (type === "List") {
            let index = values.findIndex(p => (p.parameter == parameter));
            if (index >= 0 && index != undefined) {
                // Handling Select All
                if (typeof value === 'object') {
                    if (status) values[index].value = value;
                    else values.splice(index, 1)
                } else {
                    if (status) {
                        values[index].value.push(value);
                    } else {
                        values[index].value = values[index].value.filter(val => val !== value);
                        values[index].value.length == 0 ? values.splice(index, 1) : null;
                    }
                }
            } else {
                if (status) {
                    const data = {
                        "parameter": parameter,
                        "value": typeof value === 'object' ? value : [value], // Handling Select All
                        "type": type
                    }
                    values.push(data)
                }
            }

        } else {
            const from = value;
            let index = values.findIndex(p => (p.parameter == parameter));

            if (index >= 0 && index != undefined) {
                (from == '' && to == '') ? values.splice(index, 1) : values[index].value.from = from; values[index].value.to = to;
            } else {
                if (from >= 0 && to) {
                    const data = { "parameter": parameter, "value": { "from": from, "to": to }, "type": type }
                    values.push(data)
                }
            }
            values = values.filter((item) => item.value.to != 0.1);
        }
        key === "More filter" ? _MoreFilterArr(values) : _FilterArr(values);
        // _FilterArr(values);
    }

    // ** Reset Global Filters
    const handelGlobalFilterReset = (parameter, parameter2) => {
        let values = [...FilterArr];
        if (parameter2) {
            let index = values.findIndex(p => (p.parameter == parameter2));
            if (index != undefined && index >= 0) values.splice(index, 1)
            Array.from(document.querySelectorAll(`.globalFilter-${parameter2}`)).forEach(
                input => { (input.value = ""); input.checked = false }
            );
            _FilterArr(values);
        }
        let index = values.findIndex(p => (p.parameter == parameter));
        if (index != undefined && index >= 0) values.splice(index, 1)
        Array.from(document.querySelectorAll(`.globalFilter-${parameter}`)).forEach(
            input => { (input.value = ""); input.checked = false }
        );
        _FilterArr(values);
        setFrom("")
        setTo("")


        // (min && max) ? (values[index]?.from == 0 && values[index]?.to == 0) : values;
    }

    const handleResetAll = () => {
        Array.from(document.querySelectorAll("input")).forEach(input => { (input.value = ""); input.checked = false });
        _FilterArr([]);
        _MoreFilterArr([]);
        _shapeFilterArr([]);
        setSearchString('')
        setTableMin(0)
        setTableMax(0)
        setPriceMin(0)
        setPriceMax(0)
        setDepthMin(0)
        setDepthMax(0)
        setRatioMin(0)
        setRatioMax(0)
        setFrom("")
        setTo("")
    }


    let shapesData = [...shapesFilter];
    shapeFilterArr?.map(d => { allShapes?.data?.map(e => { if (d === e.id) { shapesData?.push({ label: e?.shapeName, id: e?.id }) } }) });

    useEffect(() => {
        setHeight(ref.current.clientHeight);

    }, [shapeFilterArr, FilterArr])


    return (
        <div className='home-page certified-diamond'>
            <div className="banner-img-wrap">
                <div className="banner-img">
                    <div className='certified-diamond-data'>
                        <Header />
                        <div className='container'>
                            <div className='filters px-lg-0 px-1'>
                                <div className="searchBar container">
                                    <div className='d-flex mb-2 col-12 justify-content-between search-bar' >
                                        <AutoComplete
                                            suggestions={suggestions}
                                            className='form-control search-btn'
                                            filterKey='title'
                                            suggestionLimit={10}
                                            placeholder="For Example Type: F VS1"
                                            setSearchString={setSearchString}
                                            style={{ width: "88%" }}
                                        />
                                        <button className='col-3 col-xl-3 col-lg-12 col-md-12 col-sm-12 filters-btn' onClick={() => setFilterModel(true)}> More filters <ChevronDown /></button>
                                    </div>
                                    <MoreFiltersModal
                                        model={filterModel}
                                        setModel={setFilterModel}
                                        data={allParams}
                                        FilterArr={FilterArr}
                                        _FilterArr={_FilterArr}
                                        _MoreFilterArr={_MoreFilterArr}
                                        MoreFilterArr={MoreFilterArr}
                                        handleFilter={handleFilter}
                                        reset={reset}
                                        handelGlobalFilterReset={handelGlobalFilterReset}
                                        TableMin={TableMin}
                                        setTableMin={setTableMin}
                                        TableMax={TableMax}
                                        setTableMax={setTableMax}
                                        PriceMin={PriceMin}
                                        setPriceMin={setPriceMin}
                                        PriceMax={PriceMax}
                                        setPriceMax={setPriceMax}
                                        DepthMin={DepthMin}
                                        setDepthMin={setDepthMin}
                                        DepthMax={DepthMax}
                                        setDepthMax={setDepthMax}
                                        RatioMin={RatioMin}
                                        setRatioMin={setRatioMin}
                                        RatioMax={RatioMax}
                                        setRatioMax={setRatioMax}
                                        allShapes={allShapes}
                                    />
                                </div>
                                <Row className="main-filters" style={{ justifyContent: "center" }}>
                                    <div className='main-filters-col p-md-2 p-0'>
                                        <Card>
                                            <div className='shapecard-header-wrap'>
                                                <div className="shapeCard-header d-flex align-items-center justify-content-between">
                                                    <p className="shapeTitle">SELECT SHAPE</p>
                                                    <div className='d-flex align-items-center'>
                                                        <div className='ms-2 cursor-pointer' onClick={() => _shapeFilterArr([])}>
                                                            <img src={refreshIcon} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="shapes auto-height">
                                                    <div className='select-shape'>
                                                        {
                                                            moreShapes ?
                                                                <Row className='shape-row my-lg-0 my-md-1 my-0' style={{ justifyContent: "center" }}>
                                                                    {allShapes?.data?.filter(d => (!d?.isCommon || d?.isCommon === false))?.map((item, ind) => {
                                                                        if (ind < 19)
                                                                            return (
                                                                                <Col xl={2} lg={3} id={`UncontrolledTooltipExample${item?.id}`
                                                                                } className={`shapes ${shapeFilterArr && (shapeFilterArr.includes(item.id)) && (shapeFilterArr?.findIndex(d => d == item?.id) != undefined) ? 'active' : ""} `} onClick={() => handleShapeFilter(item?.id)} key={"shape-" + ind} >
                                                                                    <div className={`diamond-shape`}>
                                                                                        <div>
                                                                                            <ImageComp src={item?.shapeImage} width={100} height={100} />
                                                                                        </div>
                                                                                    </div>
                                                                                    <p className={`shape-name`} >{item?.shapeName}</p>
                                                                                    <UncontrolledTooltip placement="top" target={`UncontrolledTooltipExample${item?.id}`} style={{ background: "#656565", width: "130px", textTransform: "capitalize" }}>
                                                                                        {item?.shapeName?.toLowerCase()}
                                                                                    </UncontrolledTooltip>
                                                                                </Col>
                                                                            )
                                                                    })}
                                                                    <Col xl={2} lg={3} id={`manyMoreShapes`} className="shapes customShape" >
                                                                        <div className={`diamond-shape`} onClick={() => setMoreShapes(!moreShapes)}> <div> <p className='moreShape'>Main Shapes</p> </div> </div>
                                                                        <UncontrolledTooltip placement="top" target={`manyMoreShapes`} style={{ background: "#656565", width: "130px", textTransform: "capitalize" }}>View Main Shapes</UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                                :
                                                                <Row className='shape-row my-lg-0 my-md-1 my-0' style={{ justifyContent: "center" }}>
                                                                    {allShapes?.data?.filter(d => d?.isCommon === true || false)?.map((item, ind) => {
                                                                        return (
                                                                            <Col xl={2} lg={3} id={`UncontrolledTooltipExample${item?.id}`} className={`shapes ${shapeFilterArr && (shapeFilterArr.includes(item.id)) && (shapeFilterArr?.findIndex(d => d == item?.id) != undefined) ? 'active' : ""} `} onClick={() => handleShapeFilter(item?.id)} key={"shape-" + ind} >
                                                                                <div className={`diamond-shape`}>
                                                                                    <div>
                                                                                        <ImageComp src={item?.shapeImage} width={100} height={100} />
                                                                                    </div>
                                                                                </div>
                                                                                <p className={`shape-name`} >{item?.shapeName}</p>
                                                                                <UncontrolledTooltip placement="top" target={`UncontrolledTooltipExample${item?.id}`} style={{ background: "#656565", width: "130px", textTransform: "capitalize", overflow: "hidden" }}>
                                                                                    {item?.shapeName?.toLowerCase()}
                                                                                </UncontrolledTooltip>
                                                                            </Col>
                                                                        )
                                                                    })}

                                                                    <Col md={12}><hr /></Col>

                                                                    {allShapes?.data?.filter(d => d?.isCommon === false)?.map((item, ind) => {
                                                                        if (ind < 9)
                                                                            return (
                                                                                <Col xl={2} lg={3} id={`UncontrolledTooltipExample${item?.id}`
                                                                                } className={`shapes ${shapeFilterArr && (shapeFilterArr.includes(item.id)) && (shapeFilterArr?.findIndex(d => d == item?.id) != undefined) ? 'active' : ""} `} onClick={() => handleShapeFilter(item?.id)} key={"shape-" + ind} >
                                                                                    <div className={`diamond-shape`}>
                                                                                        <div>
                                                                                            <ImageComp src={item?.shapeImage} width={100} height={100} />
                                                                                        </div>
                                                                                    </div>
                                                                                    <p className={`shape-name`} >{item?.shapeName}</p>
                                                                                    <UncontrolledTooltip placement="top" target={`UncontrolledTooltipExample${item?.id}`} style={{ background: "#656565", width: "130px", textTransform: "capitalize" }}>
                                                                                        {item?.shapeName?.toLowerCase()}
                                                                                    </UncontrolledTooltip>
                                                                                </Col>
                                                                            )
                                                                    })}
                                                                    <Col xl={2} lg={3} id={`manyMoreShapes`} className="shapes customShape" >
                                                                        <div className={`diamond-shape`} onClick={() => setMoreShapes(!moreShapes)}> <div> <p className='moreShape'>More Shapes</p> </div> </div>
                                                                        <UncontrolledTooltip placement="top" target={`manyMoreShapes`} style={{ background: "#656565", width: "130px", textTransform: "capitalize" }}>View More Shapes</UncontrolledTooltip>
                                                                    </Col>
                                                                </Row>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className='main-filters-product p-md-2 p-0 d-flex flex-column'>
                                        <div className='d-flex  flex-row'>
                                            {groupedParams?.Global?.length > 0 && groupedParams?.Global?.length != undefined &&
                                                groupedParams?.Global?.map((data, index) => {
                                                    if (data?.type === "List") {
                                                        const filterData = FilterArr?.find(val => val?.parameter === data?.paramName)?.value || []
                                                        return (
                                                            // <Col lg={4} md={4} sm={12} x={12} className="me-5">
                                                            <div key={data?.paramName + index} className={`shapecard-wrap ${data?.paramName === "CLARITY" ? "Clarity-card" : ""}`} >
                                                                <Card lg={4} md={4} sm={4} x={4} className="shapecard-col">
                                                                    <div className="shapeCard-header">
                                                                        <div className='d-flex align-items-center justify-content-between'>
                                                                            <p className="shapeTitle">{(data?.paramName?.replace("RANGE", ""))}</p>
                                                                            <div className='d-flex align-items-center justify-content-end'>

                                                                                <label className="check-boxs" >
                                                                                    <input type="checkbox" onChange={e => handleFilter(e.target.checked, data?.type, data?.paramName, data?.value)}
                                                                                        className={`globalFilter-${data?.paramName}`} width={100} height={100} checked={filterData?.length === data?.value?.length || false}
                                                                                    />
                                                                                    <span className="checkmark"></span>
                                                                                </label>
                                                                                <img src={reset} width={25} className="cursor-pointer ms-1" onClick={() => { if (data?.paramName?.includes("CARATS")) { handelGlobalFilterReset(data?.paramName, "CARATS") } else handelGlobalFilterReset(data?.paramName) }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <CardBody style={{ maxHeight: "309.84px", overflow: "auto", lineHeight: "24px" }} className="fileter-card">
                                                                        <ul className='listed-box row mx-0 mt-0 mb-0 cardRow'>
                                                                            {
                                                                                data?.paramName?.includes("CARATS") && <div className='d-flex align-items-center' style={{ marginBottom: "8px" }}>
                                                                                    <input type="number" min={0} placeholder="From" onChange={e => setFrom(e.target.value)} className="globalFilter-CARATS" value={!from ? localFilterData?.map((d) => d?.value?.from) : from} />
                                                                                    <input type="number" min={0} placeholder="To" onChange={e => setTo(e.target.value)} className="globalFilter-CARATS" value={!to ? localFilterData?.map((d) => d?.value?.to) : to} />
                                                                                    <Button color='primary' className='caratsRange_apply' onClick={() => { handleFilter(true, "Number", "CARATS", from, to) }} >Apply</Button>
                                                                                </div>

                                                                            }
                                                                            {data?.value?.map((val, i) => {
                                                                                return (<div className='col-lg-6 col-md-6 col-sm-6 col-s-6 col-6' key={`checkBx${i}`}>
                                                                                    <li>
                                                                                        <div>
                                                                                            <label className="check-boxs" style={{ paddingBottom: "0px" }}>{val}
                                                                                                <input type="checkbox"
                                                                                                    onChange={e => { handleFilter(e.target.checked, data?.type, data?.paramName, val) }}
                                                                                                    className={`globalFilter-${data?.paramName}`} checked={filterData?.includes(val)}
                                                                                                />
                                                                                                <span className="checkmark"></span>
                                                                                            </label>
                                                                                        </div>
                                                                                    </li>
                                                                                </div>)
                                                                            })}
                                                                        </ul>
                                                                    </CardBody>
                                                                </Card>
                                                            </div>
                                                            // </Col>

                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                        <Row className="diamondTypes mb-2">
                                            <Col className="d-flex justify-content-start align-items-center flex-wrap">
                                                <MakeToOrderForm
                                                    modal={modal}
                                                    setModal={setModal}
                                                    shapes={shapeData?.getAllShapes}
                                                    colors={colors}
                                                    clarity={clarity}

                                                />
                                                {allCategories?.data?.map((types, index) => {
                                                    return (
                                                        <div className='advance-box' key={"d" + index} onClick={() => { if (types?.name != "Make to Order") { setCategoryId(types?.id); setCategoryName(types?.name) } else setModal(true) }}>
                                                            <div key={index} className={`cursor-pointer general-modal-btn inventory-tab-btn advance-btn ${categoryId === types?.id && 'active'}`} onMouseOver={() => { setHoverOn(types?.hoverImage) }} onMouseOut={() => { setHoverOn(types?.categoryImage) }} >
                                                                {
                                                                    (hoverOn === types?.hoverImage || categoryId === types?.id) ? <ImageComp src={types?.hoverImage} width={"20px"} style={{ marginRight: "5px" }} /> : <ImageComp src={types?.categoryImage} width={"20px"} style={{ marginRight: "5px" }} />
                                                                }
                                                                {types?.name}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </Col>
                                        </Row>
                                    </div>
                                </Row>
                            </div >

                            <div ref={ref} className='sticky-header'>
                                {(shapeFilterArr?.length > 0 || FilterArr?.length > 0) &&
                                    <div className='container Filters-container'>
                                        <div className="sticky-applied-filters d-flex align-items-center sticky-product justify-content-between mb-1">
                                            <div className='d-flex align-items-center Applied-Filters'>
                                                <p className='title'>Applied Filters : </p>
                                                <div className='d-flex justify-content-center filtered-data align-items-center'>
                                                    {
                                                        shapesData?.length > 0 &&
                                                        shapesData?.map((shapes, index) => {
                                                            return <p className='filter' key={shapes?.id + index?.toString()}> <label> {shapes?.label?.toLowerCase()}</label> <X onClick={() => handleShapeFilter(shapes?.id)} /> </p>
                                                        })
                                                    }
                                                    {
                                                        FilterArr?.map((drops, index) => {
                                                            if (drops?.type !== "Number") {
                                                                return <>
                                                                    {drops?.value?.length > 0 && drops?.value?.map((d, i) => {
                                                                        return <p className='filter' key={d + "ddo" + index}><label key={d + i.toString()}> {d} </label> <X onClick={() => handleFilter(false, "List", drops?.parameter, d)} /></p>
                                                                    })}
                                                                </>
                                                            } else {
                                                                return <p className='filter' key={index}><label> {(drops?.value?.from >= 0 && drops?.value?.to) && drops?.value?.from + "-" + drops?.value?.to} </label> <X onClick={() => handelGlobalFilterReset(drops?.parameter)} /></p>
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center'> <Button color='primary clear-all-btn' className='me-1 clear-btn' outline={true} onClick={handleResetAll}>Clear All</Button> </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className='container grid-view'>
                                <div className="products">
                                    <Card>
                                        <CardBody className='filter-six-grid'>
                                            <FilteredData
                                                height={height}
                                                LocalFilterArr={FilterArr}
                                                LocalShapeFilterArr={shapeFilterArr}
                                                searchString={searchString}
                                                categoryId={categoryId}
                                                categoryName={categoryName}
                                            />
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>

                            <SeoContent />

                        </div >
                    </div >
                </div >
            </div>
            <Footer showNewsLetter={false} />
        </div>
    )
}

export default CertifiedDiamond;

