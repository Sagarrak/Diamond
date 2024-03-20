import React from 'react'
import { useQuery } from 'react-apollo';
import { Card, CardBody } from 'reactstrap'
import { GET_SEO_CONTENT } from '../SEO/query'
import './SEO.scss';
const SeoContent = () => {
    const { loading, data } = useQuery(GET_SEO_CONTENT, { fetchPolicy: "cache-and-network" });

    return (!loading &&
        <div className='seo-content container'>
            <Card>
                <CardBody>
                    <h2 className='out-fit-regular'> {data?.getSEOContent?.title}</h2>
                    <div className="content">
                        <p className='parent' dangerouslySetInnerHTML={{ __html: data?.getSEOContent?.content }}></p>
                    </div>
                    <div className="RelatedTags">
                        <p className="tagTitle">Related Search</p>
                        <div className="tags"> {data?.getSEOContent?.tags?.map((data, index) => { return <a href={data?.url?.includes("http") ? data?.url : "http://" + data?.url} target="_blank" key={"tags" + index}>{data?.label}</a> })} </div>
                    </div>
                </CardBody>
            </Card>
        </div >
    )
}

export default SeoContent