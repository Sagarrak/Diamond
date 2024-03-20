import React, { useState, useMemo, useEffect } from "react";

import classnames from "classnames";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { JEWELLERY_CATEGORIES } from "../Jewellery/admin/query";
import { GET_ALL_STYLE_BY_CATEGORY } from "../Jewellery/product/query";
import { useQuery } from "react-apollo";
import { MinusCircle, PlusCircle } from "react-feather";
import { GET_ALL_JEWELLERY_SHAPE } from "../Jewellery/DiamondShape/query";
import { digitalOceanURL } from "../../../../src/ui/common/common";

const HandRingFilter = (props) => {
  const { register, errors, control, className, setCategory, category, dynamicFields,
    setDynamicFields, isEdit,setSelectedOptions,selectedOptions,metalOptions,options ,setMetalOptions} = props;


  const [min, setMin] = useState(0.35);
  const [activeTab, setActiveTab] = useState("1");
  const [metals, setMetals] = useState([]);
  // const [selectedOptions, setSelectedOptions] = useState([]);


  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const { data: categories, loading: categoriesLoading } = useQuery(
    JEWELLERY_CATEGORIES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const { data: styleData, loading: styleLoading } = useQuery(
    GET_ALL_STYLE_BY_CATEGORY,
    {
      variables: { getAllStyleByCategoryId: category?.value },
      fetchPolicy: "cache-and-network",
    }
  );
  const categoryOption = useMemo(() => {
    return categories?.jewelryCategoriesWithoutPaginations?.map((d) => {
      return { value: d?.id, label: d?.name };
    });
  }, [categories]);
  const categoryStyleOption = useMemo(() => {
    return styleData?.getAllStyleByCategory?.map((d) => {
      return { value: d?.id, label: d?.styleName };
    });
  }, [styleData, category]);

  const MetalOption = ({ img, title }) => {
    return (
      <div className="d-flex align-items-center" style={{ padding: "4px 5px" }}>
        <img className="me-1" src={img} height="30px" width="30px" />
        <span>{title}</span>{" "}
      </div>
    );
  };
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
  // const options = [
  //   { value: "GOLD", label: <MetalOption img={Gold} title="Gold" /> },
  //   {
  //     value: "WHITE_GOLD",
  //     label: <MetalOption img={Silver} title="White Gold" />,
  //   },
  //   { value: "ROSE_GOLD", label: <MetalOption img={Rose} title="Rose Gold" /> },
  //   {
  //     value: "PLATINUM",
  //     label: <MetalOption img={Platinum} title="Platinum" />,
  //   },
  // ];
  // const [metalOptions, setMetalOptions] = useState(options);
  
  useEffect(() => {
    
    if (metals?.length > 0) {
      const alreadyUsedMetals = metals?.map((metal) => metal?.name);
      const data = options.filter(
        (option) => !alreadyUsedMetals.includes(option?.value)
      );
      setMetalOptions(data);
    }
    setDynamicFields(metals)
  }, [metals]);



  // useEffect(() => {
  //   const selectoption = metals?.map((metal) => {
  //     return metalOptions?.find((d) => d?.value === metal?.name)
  //   })

  //   setSelectedOptions(selectoption)

  // }, [metals])

  useEffect(() => {
    isEdit && setMetals(dynamicFields);

  }, [isEdit]);

  const handleMetalChange = async (value, i, type, ind, index) => {
    const values = [...metals];
    setSelectedOptions(value);

    if (type === "metalOptionss") {
      if (!value) {
        toggle(activeTab - 1)
        setActiveTab(`${activeTab - 1}`)
        // setActiveTab(activeTab > 0 ? activeTab-1: 0)
      }
      else {
        const newLength = value?.length;
        if (values?.length > newLength) {
          const RemoveMetal = values.filter(objB => !value.some(objA => objA.value === objB.name));
          if (RemoveMetal.length > 0) {
            RemoveMetal?.map((item) => {
              const index = values.findIndex(obj => obj.name === item.name);
              if (index > -1) {
                values.splice(index, 1);
              }

            })

            setMetals([...values]); // Update the values state to trigger a re-render
            const newMetalOptions = RemoveMetal.map(item => {
              const metalOptionToAdd = options.find(option => option.value === item.name);
              return metalOptionToAdd;
            }).filter(Boolean);

            setMetalOptions(prevOptions => [...prevOptions, ...newMetalOptions]);
            if(activeTab > 1){
              setActiveTab(1)
            }
            // if (values.length == 0) {
            //   setActiveTab(1); // Set activeTab to 0 when all elements are deleted
            // } else if (activeTab ==1) {
            //   setActiveTab(activeTab); // Set activeTab to 0 if the current activeTab is 1
            // }
    

          }

        }
        else {
          const newArray = value.filter(objB => !values.some(objA => objA.name === objB.value));
          values?.push({ name: newArray[0]?.value })
        }

      }

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
        values[i].diamondShape = [];
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
    <div>
      <div className="d-flex justify-content-center align-items-center mb-1">
        <Select
          // isClearable={true}
          options={metalOptions}
          required
          isSearchable={false}
          placeholder="Select Metal"
          className="react-select w-100"
          isMulti
          value={selectedOptions}   
          // defaultValue={selectedOptions}      
          onChange={(data) => handleMetalChange(data, 0, "metalOptionss")}
        />
      </div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            Tab1
          </NavLink>
        </NavItem>
        {metals?.map((tab, i) => {
          return (
            tab?.name && (
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab == i + 2 })}
                  onClick={() => {
                    toggle(i + 2);
                  }}
                >
                  {tab?.name}
                </NavLink>
              </NavItem>
            )
          );
        })}
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <div className={className || ""}>
            <div className="mb-1">
              <Label className="form-label" htmlFor="categoryId">
                Category<span className="text-danger">&#42;</span>
              </Label>
              <Controller
                id="categoryId"
                name="categoryId"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      {...register("categoryId", { required: true })}
                      value={
                        categoryOption?.find(
                          (options) => options?.label === value?.name
                        ) || value?.name
                      }
                      options={categoryOption}
                      placeholder="Select category"
                      onChange={(e) => {
                        onChange(e?.value);
                        setCategory(e);
                      }}
                    />
                  );
                }}
              />
              {errors && errors?.categoryId && (
                <FormFeedback>Please enter valid category</FormFeedback>
              )}
            </div>

            <div className="mb-1">
              <Label className="form-label" htmlFor="styleId">
                Style ID<span className="text-danger">&#42;</span>
              </Label>
              <Controller
                id="styleId"
                name="styleId"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      {...register("styleId", { required: true })}
                      value={
                        categoryStyleOption?.find(
                          (options) => options?.label === value?.styleName
                        ) || value?.styleName
                      }
                      options={categoryStyleOption}
                      placeholder="Select style Id"
                      onChange={(e) => {
                        onChange(e?.value);
                      }}
                    />
                  );
                }}
              />
              {errors && errors?.styleId && (
                <FormFeedback>Please select styleId</FormFeedback>
              )}
            </div>

            <div className="mb-1">
              <Label className="form-label" htmlFor="name">
                Name
              </Label>
              <Controller
                id="name"
                name="name"
                defaultValue=""
                {...register("name", { required: true })}
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter name"
                    invalid={errors.name && true}
                    {...field}
                  />
                )}
              />
              {errors && errors?.name && (
                <FormFeedback>Please enter a valid name</FormFeedback>
              )}
            </div>

            <div className="mb-1">
              <Label className="form-label" htmlFor="width">
                {" "}
                width{" "}
              </Label>
              <Controller
                id="width"
                name="width"
                defaultValue=""
                {...register("width", {})}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Enter width"
                    invalid={errors.width && true}
                    {...field}
                  />
                )}
              />
              {errors && errors?.width && (
                <FormFeedback>Please enter a valid width</FormFeedback>
              )}
            </div>

            <div className="mb-1">
              <Label className="form-label" htmlFor="length">
                Length
              </Label>
              <Controller
                id="length"
                name="length"
                defaultValue=""
                {...register("length", {})}
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Enter length"
                    invalid={errors.length && true}
                    {...field}
                  />
                )}
              />
              {errors && errors?.length && (
                <FormFeedback>Please enter a valid length</FormFeedback>
              )}
            </div>
          </div>
        </TabPane>
        {metals?.map(
          (tab, index) =>
            tab?.name && (
              <TabPane tabId={index + 2}>
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
              </TabPane>
            )
        )}
      </TabContent>
    </div>
  );
};

export default HandRingFilter;
