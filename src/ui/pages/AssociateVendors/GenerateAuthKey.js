import { useMutation } from "react-apollo";
import React, { useState } from "react";
import { GENERATE_KEY } from "./mutation";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Label,
  Row,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";
import { toast } from "react-toastify";
import { FormatError } from "../../../@core/components/common/FormatError";
import { BookOpen, Copy, Download } from "react-feather";
import _ from "lodash";
import SampleFile from "../../../@core/assets/SampleList.xlsx"
import { BASE_URL } from "../../../config"

const AuthKeyGem = () => {
  const userData = JSON.parse(localStorage.getItem("UserRes"))
  const [authKey, _authKey] = useState(userData?.authKey || "");
  const [toolTipMsg, _toolTipMsg] = useState("Copy");
  const [generate, { data, loading, error }] = useMutation(GENERATE_KEY);

  const handleGenerate = () => {
    generate({ variables: {} })
      .then((data) => {
        if (data?.data?.generateAuthKey) {
          _authKey(data?.data?.generateAuthKey);
        }
      })
      .catch((err) => {
        return toast.warn(FormatError(err));
      });
  };

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = SampleFile
    a.download = "Sample List.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <>
      <Card className="w-100">
        <CardHeader className="pb-0 d-flex">
          <CardTitle tag="h4">Generate Authentication Key</CardTitle>
        </CardHeader>
        <Row className="d-flex justify-content-center">
          <Col md={{ size: 5, order: 0 }} xs={{ size: 12, order: 1 }}>
            <CardBody>
              <Button
                block
                type="submit"
                color="primary"
                className="d-flex justify-content-center"
                onClick={() => {
                  handleGenerate();
                }}
              >
                Generate Key
              {loading && <Spinner size={"sm"} />}
              </Button>
            </CardBody>
          </Col>
        </Row>
      </Card>
      {authKey && <Card className="mt-2 w-100">
        <CardHeader className="pb-0 d-flex">
          <CardTitle tag="h4">Your CVD Authentication Key</CardTitle>
        </CardHeader>
        <Row className="d-flex">
          <Col md={{ size: 5, order: 0 }} xs={{ size: 12, order: 1 }}>
            <CardBody>
              <div className="d-flex" style={{ marginLeft: "2%" }}>
                <p style={{ marginRight: 5 }}>Your CVD <strong>authkey</strong> is <strong>{authKey}</strong></p>
                <Copy
                  className="font-medium-4 cursor-pointer"
                  id="copyText"
                  onClick={() => {
                    if (navigator?.clipboard?.writeText(authKey)) {
                      _toolTipMsg("Copied!");
                    }
                  }}
                />
                <UncontrolledTooltip placement="top" target="copyText">
                  {toolTipMsg}
                </UncontrolledTooltip>
              </div>
            </CardBody>
          </Col>
        </Row>
      </Card>}
    </>
  );
};

export default AuthKeyGem;
