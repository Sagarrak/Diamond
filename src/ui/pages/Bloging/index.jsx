import React from 'react'
import Header from '../Home/Header/Header';
import Footer from "../../components/Footer/index";
import { Link, useHistory } from 'react-router-dom';
import BackArrow from '../../components/Back';
import './blog.scss';
import '../../scss/common.scss';
import ImageComp from '../../components/ImageComp';
import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'reactstrap';
import { GET_ALL_BLOG } from '../Blog/query';
import { useQuery } from 'react-apollo';
import { Pagination } from '../../components/Pagination';
import { digitalOceanURL } from '../../common/common';
const Blog = () => {

    const history = useHistory();
    const [page, setPage] = useState(1);
    const [blogsCount, setBlogsCount] = useState(0);
    const [limit,setLimit] = useState(6);
    const [loader,setLoader] = useState(3);
    const [blogs, setBlogs] = useState([]);
    // const [loading, setLoading] = useState([]);

    const indexOfLastPost = page * limit;
    const indexOfFirstPost = indexOfLastPost - limit;
    // const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

    const [currentPage, setcurrentPage] = useState(0)

    //query
    const { loading, data, refetch } = useQuery(GET_ALL_BLOG, {
        variables: {
            page: currentPage + 1,
            limit: limit,
        },
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
        if (data?.getBlogs) {
            setLoader(false);
            setBlogs(data?.getBlogs);
        }
    }, [data]);

    // useEffect(() => {
    //     setLoading(true)
    //     const options = {
    //         method: 'POST',
    //         url: 'https://api-ap-south-1.hygraph.com/v2/cl8js79vq11b901t0gyat3sm0/master',
    //         headers: { 'content-type': 'application/json' },
    //         data: {
    //             query: `{
    //           blogs(first : ${limit}, skip: ${indexOfFirstPost} ) {
    //             id
    //             title
    //             tagLine
    //             image {url}
    //             contents {html}
    //           }
    //         }`
    //         }
    //     };
    //     const options2 = {
    //         method: 'POST',
    //         url: 'https://api-ap-south-1.hygraph.com/v2/cl8js79vq11b901t0gyat3sm0/master',
    //         headers: { 'content-type': 'application/json' },
    //         data: { query: `{blogs() {id}}` }
    //     };

    //     axios
    //         .request(options)
    //         .then(function (response) {
    //             if (response?.data?.data?.blogs) {
    //                 setLoading(false)
    //                 setBlogs(response?.data?.data?.blogs)
    //             }
    //         })
    //         .catch(function (error) {
    //             console.error(error);
    //         });

    //     axios
    //         .request(options2)
    //         .then(function (response) {
    //             if (response?.data?.data?.blogs) {
    //                 setLoading(false)
    //                 setBlogsCount((response?.data?.data?.blogs)?.length)
    //             }
    //         })
    //         .catch(function (error) {
    //             console.error(error);
    //         });
    // }, [page])

    const paginate = ({ selected }) => {
        setPage(selected + 1);
    };

    const handlePagination = (page) => {
        setLoader(true);
        setcurrentPage(page?.selected);
      };

    return (
        loading ?
            <div className="d-flex justify-content-center align-items-center position-relative"><Spinner className='position-absolute' style={{ top: "50%", left: "50%" }} size={"lg"} /></div>
            :
            <div className='home-page'>
                <div className="banner-img-wrap">
                    <div className="banner-img">
                        <Header />
                        <div className="container Blogpage">
                            <div className="d-flex align-items-center mb-2 mt-lg-0 mt-2">
                                <BackArrow history={history} />
                                <h3 className="product-desc-title m-0"> <Link to="/">Home </Link> / Blogs</h3>
                            </div>

                            <div className="blogs mt-2">
                                <div className="row">
                                    {
                                        blogs?.data?.map(data => {
                                            return <div className="col-xl-3 col-md-6 col-12 mt-2" key={data?.id}>
                                                <div className="card blog-card" >
                                                    <div className='card-img-top'>
                                                        <ImageComp src={`${digitalOceanURL}${data?.image}`} className="w-100 h-100 object-cover" alt="BlogImgFirst" />
                                                    </div>
                                                    <div className="card-body">
                                                        <h5 className="blog-card-text outfit-bold  mb-2 text-elipsis">{data?.content}</h5>
                                                        {/* <p className="text÷-sm-content"> {data?.tagLine} </p> */}
                                                        <Link className="btn-sm" to={`/blogs/${data?.id}`}>Read more..</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                handlePagination={handlePagination}
                                totalRecords={blogs?.count}
                                limit={limit}
                            />
                          

                        </div>
                    </div>
                </div>

                <Footer />
            </div>
    )
}

export default Blog