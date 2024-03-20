import React, { useEffect, useState } from 'react';
import Header from '../../Home/Header/Header';
import Footer from '../../../components/Footer';
import BackArrow from "../../../components/Back";
import { Link, useHistory } from 'react-router-dom';
import "../../Home/homev2.scss";
import "../../Bloging/blog.scss";

import jwelleryIcon from "../../../../../src/assets/images/pages/jwellery-logo-icon.png";
import { Pagination } from '../../../components/Pagination';
import ImageComp from '../../../components/ImageComp';
import { digitalOceanURL } from '../../../common/common';
import { GET_ALL_EDUCATIONS } from '../query'
import { useQuery } from 'react-apollo';


const Index = () => {
  const [currentPage, setcurrentPage] = useState(0)
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [Loader, setLoader] = useState(false);
  const history = useHistory();
  const [educationData, seteducationData] = useState("")

  const { loading, data, refetch } = useQuery(GET_ALL_EDUCATIONS, {
    variables: {
      page: currentPage + 1,
      limit: limit,
    },
    fetchPolicy: "cache-and-network",
  });


  useEffect(() => {
    if (data?.getEducations) {
      seteducationData(data?.getEducations)

    }

  }, [data])

  const handlePagination = (page) => {
    setLoader(true);
    setcurrentPage(page?.selected);
  };
  return (
    <div className='home-page'>
      <div className='banner-img-wrap'>
        <div className="banner-img d-flex align-items-center justify-content-center flex-column">
          <Header />
          <div className="container Blogpage">
            <div className="d-flex align-items-center mb-2 mt-lg-0 mt-2">
              <BackArrow history={history} />
              <h3 className="product-desc-title m-0"> <Link to="/">Home </Link> / Education</h3>
            </div>

            <div className="blogs mt-2">
              <div className="row">
                {
                  educationData?.data?.map(data => {
                    return <div className="col-xl-3 col-md-6 col-12 mt-2" key={data?.id}>
                      <div className="card blog-card" >
                        <div className='card-img-top'>
                          <ImageComp src={`${digitalOceanURL}${data?.image}`} className="w-100 h-100 object-cover" alt="BlogImgFirst" />
                        </div>
                        <div className="card-body">
                          <h5 className="blog-card-text outfit-bold text-elipsis mb-3">{data?.content}</h5>
                          {/* <p className="text÷-sm-content"> {data?.tagLine} </p> */}
                          <Link className="btn-sm " to={`/education/${data?.id}`}>Read more..</Link>
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
              totalRecords={educationData?.count}
              limit={limit}
            />


          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Index