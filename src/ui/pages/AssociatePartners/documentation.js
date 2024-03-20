import React from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Row,
    Button
} from "reactstrap";
import { BookOpen, Copy, Download } from "react-feather";
import _ from "lodash";
import axios from "axios"
import SampleFile from "../../../@core/assets/SampleList.xlsx"
import { BASE_URL } from "../../../config"
import {digitalOceanURL} from '../../common/common'

const AuthKeyGem = () => {
    const UserData = JSON.parse(localStorage.getItem("UserRes"))
    const handleDownload = () => {
        axios({
            url: BASE_URL + "/api/v1/export-products",
            method: "GET",
            responseType: "blob", // important
            headers: {
                authkey: UserData?.authKey
            }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "product_list.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    };

    return (
        <div>
            <Card className="w-100">
                <CardHeader className="pb-0 d-flex">
                    <CardTitle tag="h4">Export Products</CardTitle>
                </CardHeader>
                <Row className="d-flex justify-content-center">
                    <Col md={6}>
                        <CardBody>
                            <Button block type="submit" color="primary" className="d-flex justify-content-center align-items-center" onClick={handleDownload}>Export Product<Download className="cursor-pointer" size={20} style={{ marginLeft: 10 }} /></Button>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
            <Card className="w-100">
                <CardHeader className="pb-0 d-flex">
                    <CardTitle tag="h4">View Documentation</CardTitle>
                </CardHeader>
                <Row className="d-flex justify-content-center">
                    <Col md={6}>
                        <CardBody>
                            <a href={`${BASE_URL}/partner-api-docs`} className="btn btn-primary d-flex justify-content-center align-items-center" target="_blank" style={{ textDecoration: "none", marginLeft: 2, color: "#6e6b7b" }}>View Documentation <BookOpen className="cursor-pointer" size={20} style={{ marginLeft: 10 }} /></a>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AuthKeyGem;
