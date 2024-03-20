import React, { useEffect, useMemo, useState } from "react";
import { MinusCircle, PlusCircle } from "react-feather";
import { Col, Input, Label, Row } from "reactstrap";
import MetalDropDown from "../../../../components/MetalDropDown/MetalDropDown";
import Select from "react-select";
import Gold from "../../../../components/MetalDropDown/Images/Gold.png";
import Silver from "../../../../components/MetalDropDown/Images/Silver.png";
import Rose from "../../../../components/MetalDropDown/Images/Rose.png";
import Platinum from "../../../../components/MetalDropDown/Images/Platinum.png";
import { toast } from "react-toastify";
import { GET_ALL_JEWELLERY_SHAPE } from "../../DiamondShape/query";
import { useQuery } from "react-apollo";
import { BASE_URL } from "../../../../../config";
import { digitalOceanURL } from "../../../../common/common";
import { ConfirmationModal } from "../../../../components/Alert";

const SettingFormMetalDetails = (props) => {
  const {
    dynamicFields,
    setDynamicFields,
    register,
    errors,
    control,
    className,
	validateMetals,
    isEdit,
	errorss,
  } = props;
  const [metals, setMetals] = useState([{ name: "" }]);
  console.log("metals", metals);

  const { data, loading } = useQuery(GET_ALL_JEWELLERY_SHAPE, {
    variables: {
      page: 1,
      limit: 500,
      sort: { key: "createdAt", type: -1 },
      filter: "{}",
      search: "",
    },
    fetchPolicy: "cache-and-network",
  });

  const MetalOption = ({ img, title }) => {
    return (
      <div className="d-flex align-items-center" style={{ padding: "4px 5px" }}>
        <img className="me-1" src={img} height="30px" width="30px" />
        <span>{title}</span>{" "}
      </div>
    );
  };
  const ShapeOption = ({ img, title }) => {
    return (
      <div className="d-flex align-items-center" style={{ padding: "4px 5px" }}>
        <img
          className="me-1"
          src={digitalOceanURL + img}
          height="30px"
          width="30px"
        />
        <span>{title}</span>{" "}
      </div>
    );
  };

  const diamondShapeOptions = useMemo(() => {
    let arr = [];
    data?.getAllJewelryShapes?.data?.map((d) => {
      arr?.push({
        value: d?.id,
        label: (
          <ShapeOption
            img={d?.jewelryShapeImage}
            title={d?.shapeName || "No Title"}
          />
        ),
      });
    });
    return arr;
  }, [data]);

  const options = [
    { value: "GOLD", label: <MetalOption img={Gold} title="Gold" /> },
    {
      value: "WHITE_GOLD",
      label: <MetalOption img={Silver} title="White Gold" />,
    },
    { value: "ROSE_GOLD", label: <MetalOption img={Rose} title="Rose Gold" /> },
    {
      value: "PLATINUM",
      label: <MetalOption img={Platinum} title="Platinum" />,
    },
  ];
  const [metalOptions, setMetalOptions] = useState(options);
  useEffect(() => {
    if (metals?.length > 0) {
      const alreadyUsedMetals = metals?.map((metal) => metal?.name);
      const data = options.filter(
        (option) => !alreadyUsedMetals.includes(option?.value)
      );
      setMetalOptions(data);
    }
    setDynamicFields(metals);
  }, [metals]);

  useEffect(() => {
    isEdit && setMetals(dynamicFields);
    
  }, [isEdit]);

 

  const handleMetalChange = async (value, i, type, ind, index) => {
    const values = [...metals];

    if (type === "metal") {
      values[i].name = value;
    }
    if (type === "metalPrice") {
      values[i].price = value;
    }
    if (type === "metalImages") {
      if (value === "removeImage") values[i].metalImages.splice(ind, 1);
      else if (values[i].metalImages?.length > 0) {
        values[i].metalImages.push(value);
      } else {
        values[i].metalImages = value;
      }
    }
    if (type === "option") {
      values[i].isDiamonds = value;

      if (value && (values[i]?.diamondShape?.length || 0) < 1) {
        values[i].price = "";
        values[i].metalImages = [];
        values[i].diamondShape = [{ diamondId: "" }];
      } else if (value == false) {
        if (values[i]?.diamondShape?.length) {
          let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You want to unselect all diamond!",
            "Yes, delete it!"
          );
          if (Status) {
            values[i].diamondShape = [];
          } else {
            values[i].isDiamonds = true;
          }
        }
      }
    }

    if (type === "manageDiamond") {
      if (value === "add") values[i].diamondShape.push({ diamondId: "" });
      else if (value === "remove") values[i].diamondShape?.splice(ind, 1);
    }

    if (type === "diamondImg") {
      if (value === "removeImage")
        values[i].diamondShape[ind].diamondShapeImages.splice(index, 1);
      else values[i].diamondShape[ind].diamondId = value;
    }

    if (type === "diamondPrice") {
      values[i].diamondShape[ind].price = value;
    }
    if (type === "diamondShapeImages") {
      if (values[i].diamondShape[ind].diamondShapeImages?.length > 0) {
        values[i].diamondShape[ind].diamondShapeImages.push(value);
      } else {
        values[i].diamondShape[ind].diamondShapeImages = value;
      }
    }

    setMetals(values);
    // validateMetals();
  };

  const AddNewMetal = () => {
    const values = [...metals];
    if (values?.length >= options?.length) {
      toast?.error(`Maximum ${options?.length} Metals could be created`);
    } else {
      values.push({ name: "" });
      setMetals(values);
    }
  };

  const RemoveMetal = (i) => {
    const values = [...metals];
    values.splice(i, 1);
    setMetals(values);
  };

  const getBase64 = async (e, index, isMetal, i) => {
    e.preventDefault();
    let reader = new FileReader();
    let files = e.target.files; // Access multiple selected files
    let imageArray = [];
    for (let i = 0; i < files.length; i++) {
      reader.readAsDataURL(files[i]);
      await new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          let result = await reader.result;
          imageArray.push(result);
          resolve();
        };
      });
    }
    if (isMetal) {
      await handleMetalChange(imageArray, index, "metalImages");
    } else {
      handleMetalChange(imageArray, index, "diamondShapeImages", i);
    }
    // await onChange(imageArray);
  };
  return (
    <div className={className || ""}>
      <h2 className="text-center"> Select Metal </h2>
      <div>
        <Row>
          {metals?.map((item, index) => {
            const selectedOption = options?.find((d) => d.value === item.name);
            return (
              <Col
                sm="12"
                style={{ border: "1px solid black" }}
                className="my-2 p-2"
              >
                <div className="d-flex my-2">
                  {metals?.length - 1 == index ? (
                    <PlusCircle
                      className="cursor-pointer"
                      onClick={(e) => AddNewMetal(e)}
                      style={{ marginLeft: 10 }}
                    />
                  ) : null}
                  {metals?.length > 1 ? (
                    <MinusCircle
                      className="cursor-pointer"
                      onClick={() => RemoveMetal(index)}
                      style={{ marginLeft: 10 }}
                    />
                  ) : null}
                </div>
                <div className="d-flex justify-content-center align-items-center mb-1">
                  <Select
                    isClearable={true}
                    options={metalOptions}
                    required
                    isSearchable={false}
                    placeholder="Select Metal"
                    value={selectedOption}
                    className="react-select w-100"
                    // defaultValue={(options?.find(d => d?.value === defaultMetal)) || ""}
                    onChange={(e) =>
                      handleMetalChange(e?.value, index, "metal")
                    }
                  />
                  {errorss.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
                {metals[index]?.name && (
                  <div className="settingOptions w-50 d-flex justify-content-start align-items-center mb-1">
                    <Input
                      className="custom-control-success me-1"
                      type="switch"
                      id={`optionSwitch${index}`}
                      name={`optionSwitch${index}`}
                      inline
                      style={{ zIndex: 0 }}
                      checked={metals[index]?.isDiamonds}
                      onChange={(e) => {
                        handleMetalChange(
                          e?.target?.checked || false,
                          index,
                          "option"
                        );
                      }}
                    />
                    <Label htmlFor={`optionSwitch${index}`}>
                      {" "}
                      Want to add Diamonds ?{" "}
                    </Label>
                  </div>
                )}

                {metals[index]?.name && !metals[index]?.isDiamonds && (
                  <div>
                    <div>
                      <Label>Enter Price : </Label>
                      <Input
                        type="number"
                        placeholder="Enter Price in $"
                        onChange={(e) =>
                          handleMetalChange(
                            e?.target?.value,
                            index,
                            "metalPrice"
                          )
                        }
                      />
					  {errorss.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                    </div>
                    <div>
                      <Label>Select Images </Label>
                      <Input
                        type="file"
                        multiple={true}
                        accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.webp"
                        onChange={(e) => {
                          getBase64(e, index, true);
                        }}
                      />
                    </div>
                  </div>
                )}

                {!metals[index]?.isDiamonds && metals[index]?.metalImages && (
                  <div className="d-flex">
                    {metals[index]?.metalImages?.map((image, i) => {
                      return (
                        <>
                          <img
                            src={image}
                            key={"dimg" + i}
                            className="m-2"
                            width={50}
                          />
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              handleMetalChange(
                                "removeImage",
                                index,
                                "metalImages",
                                i
                              );
                            }}
                          >
                            X
                          </span>
                        </>
                      );
                    })}
                  </div>
                )}

                {metals[index]?.name &&
                  metals[index]?.isDiamonds &&
                  metals[index]?.diamondShape?.length > 0 && (
                    <div>
                      {metals[index]?.diamondShape?.map((data, i) => {
                        return (
                          <div key={"diamondOptions" + i}>
                            <div className="d-flex my-2">
                              {metals[index]?.diamondShape?.length - 1 == i ? (
                                <PlusCircle
                                  className="cursor-pointer"
                                  onClick={(e) =>
                                    handleMetalChange(
                                      "add",
                                      index,
                                      "manageDiamond"
                                    )
                                  }
                                  style={{ marginLeft: 10 }}
                                />
                              ) : null}
                              {metals[index]?.diamondShape?.length > 1 ? (
                                <MinusCircle
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleMetalChange(
                                      "remove",
                                      index,
                                      "manageDiamond",
                                      i
                                    )
                                  }
                                  style={{ marginLeft: 10 }}
                                />
                              ) : null}
                            </div>
                            <div>
                              <Label>Select Diamond Shapes : </Label>
                              <Select
                                isClearable={true}
                                options={diamondShapeOptions}
                                isSearchable={false}
                                placeholder="Select Diamond Shape"
                                className="react-select w-100"
                                isLoading={loading}
                                // defaultValue={(options?.find(d => d?.value === defaultMetal)) || ""}
                                onChange={(e) =>
                                  handleMetalChange(
                                    e?.value,
                                    index,
                                    "diamondImg",
                                    i
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Enter Price : </Label>
                              <Input
                                type="number"
                                onChange={(e) =>
                                  handleMetalChange(
                                    e?.target?.value,
                                    index,
                                    "diamondPrice",
                                    i
                                  )
                                }
                                placeholder="Enter Price in $"
                              />
                            </div>
                            <div>
                              <Label>Select Images </Label>
                              <Input
                                type="file"
                                multiple={true}
                                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.webp"
                                onChange={(e) => {
                                  getBase64(e, index, false, i);
                                }}
                              />
                            </div>
                            {metals[index]?.diamondShape[i]
                              ?.diamondShapeImages && (
                              <div className="d-flex">
                                {metals[index]?.diamondShape[
                                  i
                                ]?.diamondShapeImages?.map((image, ind) => {
                                  return (
                                    <>
                                      <img
                                        src={image}
                                        key={"ddimg" + ind}
                                        className="m-2"
                                        width={50}
                                      />
                                      <span
                                        className="cursor-pointer"
                                        onClick={() => {
                                          handleMetalChange(
                                            "removeImage",
                                            index,
                                            "diamondImg",
                                            i,
                                            ind
                                          );
                                        }}
                                      >
                                        X
                                      </span>
                                    </>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default SettingFormMetalDetails;
