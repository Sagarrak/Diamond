import React from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
} from "reactstrap";
import { BookOpen, Copy, Download } from "react-feather";
import _ from "lodash";
import SampleFile from "../../../@core/assets/SampleList.xlsx"
import { BASE_URL } from "../../../config"
import { digitalOceanURL } from "../../common/common";

const AuthKeyGem = () => {
    const handleDownload = () => {
        const a = document.createElement('a')
        a.href = SampleFile
        a.download = "Sample List.xlsx"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <Card className="w-100">
            <CardHeader className="pb-0 d-flex">
                <CardTitle tag="h4">Import Products</CardTitle>
            </CardHeader>
            <Row className="d-flex justify-content-center">
                <Col>
                    <CardBody>
                        <div className="d-flex" style={{ marginLeft: "2%" }}>
                            <p style={{ marginRight: "5%" }}>Download sample file </p>
                            <Download className="cursor-pointer" onClick={handleDownload} />
                        </div>
                        <div className="d-flex" style={{ marginLeft: "2%" }}>
                            <p style={{ marginRight: "5%" }}>View Documentation </p>
                            <a href={`${digitalOceanURL}vendor-api-docs`} target="_blank" style={{ textDecoration: "none", marginLeft: 2, color: "#6e6b7b" }}><BookOpen className="cursor-pointer" /></a>
                        </div>           
                    </CardBody> 
                </Col>
            </Row>
        </Card>
    );
};

export default AuthKeyGem;
