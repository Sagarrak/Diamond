import React, { useState, useEffect } from 'react'
import './blog.scss';
import BackArrow from '../../components/Back';
import Header from '../Home/Header/Header';
import ImageComp from '../../components/ImageComp';
import Footer from "../../components/Footer";
import axios from 'axios';
import moment from 'moment'
import { Link, useHistory, useParams } from 'react-router-dom';
import { GET_ALL_BLOG, GET_BLOG } from '../Blog/query';
import { useQuery } from 'react-apollo';
import { digitalOceanURL } from '../../common/common';

const BlogDescription = () => {
  const history = useHistory();
  const [blogs, setBlogs] = useState([])
  console.log("🚀 ~ file: BlogDescription.jsx:17 ~ BlogDescription ~ blogs:", blogs)
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [blogsAll, setBlogsAll] = useState([])

  const params = useParams()

  //query
  const { loading, data, refetch } = useQuery(GET_BLOG, {
    variables: {
      getBlogId: params?.id
    },

    fetchPolicy: "cache-and-network",
  });

  const { loading: blogLoading, data: blogAll, refetch: blogRefetch } = useQuery(GET_ALL_BLOG, {
    variables: {
      page: currentPage + 1,
      limit: limit,
    },
    fetchPolicy: "cache-and-network",
  });


  useEffect(() => {
    if (data?.getBlog) {
      setBlogs(data?.getBlog)
    }

  }, [data])

  useEffect(() => {
    if (blogAll?.getBlogs) {
      setBlogsAll(blogAll?.getBlogs?.data)
    }

  }, [blogAll])


  return (
    <div className='home-page'>
      <div className='banner-img-wrap'>
        <div className='banner-img'>
          
          <Header />
          <div className="container blog-top" >

            <div className="d-flex align-items-center mb-2 mt-lg-0 mt-2">
              <BackArrow history={history} />
              <h3 className="product-desc-title m-0 dottedText"> <Link to="/">Home</Link> / <Link to="/blogs">Blogs</Link> / {blogs?.blog?.title}</h3>
            </div>

            <div className="blog">

              <div className="row">
                <div className='image col-6'>
                  <ImageComp src={`${digitalOceanURL}${blogs?.blog?.image}`} width={`100%`} />
                </div>
                <div className="col-6" style={{
                  maxWidth: "550px",
                  maxHeight: "350px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}>
                  {
                    blogsAll?.map(data => {
                      return <div key={data?.id} className="d-flex align-items-center mb-1 cursor-pointer" style={{ width: "485px" }} onClick={d => { history?.push(`/blogs/${data?.id}`); window.location.reload(); }}>
                        <ImageComp src={`${digitalOceanURL}${data?.image}`} width={100} />
                        <div className="otherInfo ms-2">
                          <p className="title dottedText">{data?.content}</p>
                          <p className="date">{moment(data?.createdAt).format("DD MMM, YYYY")}</p>
                        </div>
                      </div>
                    })
                  }
                </div>
              </div>

              <div className="blogInfo mt-3">
                <div className="blogtitle">{blogs?.blog?.title}</div>
                <div className="blogConetent" dangerouslySetInnerHTML={{ __html: blogs?.blog?.content }}></div>
              </div>

            </div>
          </div>
          <Footer showNewsLetter={true} />

        </div>

      </div>
    </div>
  )
}

export default BlogDescription