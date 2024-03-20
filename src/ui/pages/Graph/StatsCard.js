// ** Third Party Components
import classnames from "classnames";
import { TrendingUp, Box, Activity, Globe, Database } from "react-feather";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import { Card, CardHeader, CardBody, CardText, Row, Col } from "reactstrap";
import { GET_PRODUCT_BY_LAB } from "./query";
import { useEffect, useState } from "react";
import { useQuery } from "react-apollo";

const StatsCard = () => {
  const [ProductLabData, setProductLabData] = useState([]);
  const {
    loading: labLoading,
    data: LabData,
    refetch: productRefetch,
  } = useQuery(GET_PRODUCT_BY_LAB, {
    fetchPolicy: "cache-and-network",
  });

  const productCount = (lab) => {
    return ProductLabData?.find((d) => d?.lab === lab)?.total || 0;
  };

  useEffect(() => {
    if (LabData?.getProductsByLab) {
      setProductLabData(LabData?.getProductsByLab);
    }
  }, [LabData]);

  const data = [
    {
      title: productCount("Total Stocks"),
      subtitle: "TOTAL STOCKS",
      color: "light-success",
      icon: <Database size={24} />,
    },
    {
      title: productCount("HRD"),
      subtitle: "HRD",
      color: "light-info",
      icon: <Activity size={24} />,
    },
    {
      title: productCount("IGI"),
      subtitle: "IGI",
      color: "light-primary",
      icon: <TrendingUp size={24} />,
    },
    {
      title: productCount("GIA"),
      subtitle: "GIA",
      color: "light-warning",
      icon: <Box size={24} />,
    },
    {
      title: productCount("OTHERS"),
      subtitle: "OTHERS",
      color: "light-danger",
      icon: <Globe size={24} />,
    },
  ];

  const renderData = () => {
    const cols = { md: "2", sm: "4", xs: "8" };
    return data.map((item, index) => {
      const colMargin = Object.keys(cols);
      const margin = index === 2 ? "sm" : colMargin[0];
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1,
          })}
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h4 className="fw-bolder mb-0">{item.title}</h4>
              <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      );
    });
  };

  return (
    <Card className="card-statistics">
      <CardHeader></CardHeader>
      <CardBody className="statistics-body">
        <Row className="d-flex justify-content-center">{renderData()}</Row>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
