// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import { toast } from "react-toastify";
import Select from "../../Select";
// ** Reactstrap Imports
import { Card, CardBody, Button, Spinner, Row, Col, CardText } from "reactstrap";
import { UPDATE_HOLD_REQUEST } from "../../../pages/HoldRequest/mutation";
import { FormatError } from "../../../../@core/components/common/FormatError";

const EditHoldRequestAction = ({ refetch, closeModal, setLoaderData, data }) => {
  const [loader, setLoader] = useState(false);
  const [status, _setStatus] = useState(data?.status || "");
  const [updateHoldRequestMutation] = useMutation(UPDATE_HOLD_REQUEST);
  const updateHoldRequest = () => {
    setLoader(true);
    setLoaderData(true);

    updateHoldRequestMutation({
      variables: {
        input: {
          id: data?.id,
          status,
        },
      },
    })
      .then(({ data }) => {
        if (data?.updateHoldRequest?.status) {
          refetch();
          closeModal();
          toast.success("Request status updated successfully");
          setLoader(false);
          setLoaderData(false);
        } else {
          toast.warn("not update");
          closeModal();
          setLoader(false);
          setLoaderData(false);
        }
      })
      .catch((error) => {
        toast.warn(FormatError(error));
        closeModal();
        setLoader(false);
        setLoaderData(false);
      });
  };

  const options = [
    { label: "Pending", value: "PENDING" },
    { label: "Accept", value: "ACCEPTED" },
    { label: "Reject", value: "REJECTED" },
  ];

  return (
    <Fragment>
      <Card className="invoice-action-wrapper">
        <CardBody className="invoice-padding invoice-product-details">
          <CardText className="col-title mb-md-2 mb-0">Request Status</CardText>
          <Select
            options={options}
            placeholder="Select status"
            value={options?.find((item) => item?.value === status?.toUpperCase())}
            onChange={(e) => _setStatus(e?.value)}
          />
        </CardBody>
        <CardBody>
          <Button
            color="primary"
            block
            className=""
            onClick={() => {
              updateHoldRequest();
            }}
          >
            Update Status&nbsp;{loader && <Spinner color="light" size="sm" className="mr-2" />}{" "}
          </Button>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default EditHoldRequestAction;
