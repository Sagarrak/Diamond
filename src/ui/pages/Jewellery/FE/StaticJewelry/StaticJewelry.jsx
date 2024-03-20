import React from "react";
import Header from "../../../Home/Header/Header";
import JwelryCard from "./JewelryCard";
import Footer from "../../../../components/Footer";

import "../../../Inventory/inventory.scss";
import "../jewellery.scss";
import { GET_ALL_JEWELLERY_PRODUCT } from "../../product/query";
import { useQuery } from "react-apollo";
import { useState } from "react";
import { useEffect } from "react";
import { Pagination } from "../../../../components/Pagination";
import { GET_ALL_JEWELLERY_CATEGORY } from '../../category/query'

const StaticJewelry = () => {
  const [sort, setSort] = useState({ key: "createdAt", type: -1 });
  const [limit, setLimit] = useState(10);
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [alljewelleryproduct, setalljewelleryproduct] = useState("");
  const [jewelleryCategoryData, setJewelleryCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  //query
  const { data, loading, refetch } = useQuery(GET_ALL_JEWELLERY_PRODUCT, {
    variables: {
      page: currentPage + 1,
      limit: limit,
      sort: sort,
      filter: "{}",
      search: searchText,
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: categoryData, loading: categoryLoading, refetch: categoryRefetch } = useQuery(GET_ALL_JEWELLERY_CATEGORY, {
    variables: {
      page: currentPage + 1,
      limit: limit,
      sort: sort,
      filter: "{}",
      search: searchText,
    },
    fetchPolicy: "cache-and-network",
  })

  useEffect(() => {
    if (categoryData?.jewelryCategories) {
      setJewelleryCategoryData(categoryData?.jewelryCategories?.data)
      setSelectedCategory(categoryData?.jewelryCategories?.data[0]?.name)

    }

  }, [categoryData])


  useEffect(() => {
    if (data?.getAllJewelryProducts) {
      setalljewelleryproduct(data?.getAllJewelryProducts);
    }
  }, [data]);

  const handlePagination = (page) => {
    setLoader(true);
    setCurrentPage(page?.selected);
  };

  const handleClick = (d) => {
    setSelectedCategory(d?.name)

  }
  return (
    <div className="home-page jwellery-showcase">
      <div className="banner-img-wrap">
        <div className="banner-img ">
          <Header />

          <div className="container">
            <p className="head-content margin-top">Jewellery Showcase</p>

            <div className="tab-wrap d-flex align-items-center justify-content-between">
              {jewelleryCategoryData?.map((d) => {
                return (
                  <p className={d?.name === selectedCategory ? "active" : ''} key={d?.id} onClick={() => handleClick(d)}> {d?.name}</p>

                )
              }
              )}

            </div>

            <div className="tab-content mb-5">
              <div className="grid container">
                {alljewelleryproduct?.data?.map((d) => {
                  return <JwelryCard data={d} />;
                })}

              </div>
            </div>
            <div>
              <Pagination
                currentPage={currentPage}
                handlePagination={handlePagination}
                totalRecords={alljewelleryproduct?.count}
                limit={limit}
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default StaticJewelry;
