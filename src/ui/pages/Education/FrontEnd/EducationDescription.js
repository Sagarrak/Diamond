import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo';
import { Link, useHistory, useParams } from 'react-router-dom';
import { digitalOceanURL } from '../../../common/common';
import Footer from '../../../components/Footer';
import ImageComp from '../../../components/ImageComp';
import Header from '../../Home/Header/Header';
import { GET_ALL_EDUCATIONS, GET_EDUCATION } from '../query';
import moment from 'moment'
import BackArrow from '../../../components/Back';

function EducationDescription() {
    const history = useHistory();
    const [blogs, setBlogs] = useState([])
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [EducationAll, setEducationAll] = useState([])
    console.log("🚀 ~ file: EducationDescription.js:18 ~ EducationDescription ~ EducationAll:", EducationAll)
    const [Education, setEducation] = useState([])
    console.log("🚀 ~ file: EducationDescription.js:17 ~ EducationDescription ~ Education:", Education)

    const params = useParams()
    console.log("🚀 ~ file: EducationDescription.js:20 ~ EducationDescription ~ params:", params)

  //query
  const { loading, data, refetch } = useQuery(GET_EDUCATION, {
    variables: {
        getEducationId: params?.id
    },

    fetchPolicy: "cache-and-network",
  });

  const { loading:allLoading, data:allEducation, refetch :allRefetch} = useQuery(GET_ALL_EDUCATIONS, {
    variables: {
      page: currentPage + 1,
      limit: limit,
    },
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    if (allEducation?.getEducations) {
        setEducationAll(allEducation?.getEducations)

    }

  }, [allEducation])

  useEffect(() => {
    if (data?.getEducation) {
        setEducation(data?.getEducation)
    }

  }, [data])
  
  return (
    <div className='home-page'>
    <Header />
    <div className="container" style={{ marginTop: 200, marginBottom: 385 }}>

      <div className="d-flex align-items-center mb-2 mt-lg-0 mt-2">
        <BackArrow history={history} />
        <h3 className="product-desc-title m-0 dottedText"> <Link to="/">Home</Link> / <Link to="/education">Education</Link> / {Education?.education?.title}</h3>
      </div>

      <div className="blog">

        <div className="row">
          <div className='image col-6'>
            <ImageComp src={`${digitalOceanURL}${Education?.education?.image}`} width={`100%`} />
          </div>
          <div className="col-6" style={{
            maxWidth: "550px",
            maxHeight: "350px",
            overflowY: "auto",
            overflowX: "hidden",
          }}>
            {
              EducationAll?.data?.map(data => {
                return <div key={data?.id} className="d-flex align-items-center mb-1 cursor-pointer" style={{ width: "485px" }} onClick={d => { history?.push(`/education/${data?.id}`); window.location.reload(); }}>
                  <ImageComp
                   src={`${digitalOceanURL}${data?.image}`} width={100} />
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
          <div className="blogtitle">{Education?.education?.title}</div>
          <div className="blogConetent" dangerouslySetInnerHTML={{ __html: Education?.education?.content }}></div>
        </div>

      </div>
    </div>
    <Footer showNewsLetter={true} />
  </div>
  )
}

export default EducationDescription