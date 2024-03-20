import React, { Fragment, useEffect, useState } from "react";
import Header from "../Home/Header/Header";
// import Footer from "../../../ui/components/FooterBottom/index";
import Footer from "../../components/Footer";
import { Form, Input, FormFeedback, Spinner } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BOOKED_APPOINTMENT } from "./mutation";
import { useMutation } from "@apollo/react-hooks";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import "../Home/homev2.scss";
import "./style.scss";
import "../../scss/authPages.scss";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { FormatError } from "../../../@core/components/common/FormatError";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import axios from "axios";

function index() {
  const [date, _date] = useState();
  const [time, _time] = useState();
  const [country, _country] = useState('us');
  const {
    reset,
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [bookedAppointment] = useMutation(BOOKED_APPOINTMENT);
  const onSubmit = (data) => {
    const userData = {
      fullName: data?.name,
      email: data?.email,
      mobile: data?.phone,
      companyName: data?.company,
      note: data?.note,
      subject: data?.subject,
    };

    date?.length ? (userData.date = moment(date[0]).format("YYYY-MM-DD")) : "";
    time?.length ? (userData.time = moment(time[0]).format("HH:MM:SS")) : "";
    // if (Object.values(data).every(field => field.length > 0)) {
    bookedAppointment({ variables: { input: userData } })
      .then((response) => {
        if (response?.data?.createAppointment?.id) {
          handleReset();
          toast.success("Your appointment has been booked successfully.");
        }
      })
      .catch((err) => {
        toast.error(FormatError(err));
      });
    // }
  };

  const handleReset = () => {
    reset({
      email: "",
      note: "",
      name: "",
      phone: "",
      company: "",
      image: "",
      dateAndTime: "",
      subject: "",
      note: "",
    });
  };

  useEffect(async () => {
    await axios.get("https://ipapi.co/json").then((res) => {
      _country((res?.data?.country_code).toLowerCase());
      // .toLowerCase()
    })
  }, []);

  return (
    <div className="home-page">
      <div className="banner-img-wrap">
        <div className="contact-BannerImg">
          <Header />
          <section id="contact" className="contact-us">
            <div className="container">
              <div className="contact-detail">
                <div className="row">
                  <div className="col-lg-12 mt-lg-0 mt-3 ">
                    <h1 className="text-center head-bold outfit-bold">Get in Touch</h1>
                    <p className="text-center mb-3 p-head">
                    To get in touch with us, simply utilize the ease and convenience of multiple communication channels. Drop us an email, dial our phone number, or engage with our responsive WhatsApp chatbot. Whatever method you choose, we are committed to being accessible and responsive to your needs.

                    </p>
					
                    <div className="contact-form">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                          <div className="col-lg-6 input-box mt-0 mb-lg-2 mb-0">
                            <Controller
                              id="name"
                              name="name"
                              defaultValue=""
                              control={control}
                              {...register("name", { required: true })}
                              render={({ field }) => (
                                <Input
                                  className="input-filed m-0"
                                  type="text"
                                  placeholder="Name *"
                                  invalid={errors.name && true}
                                  {...field}
                                />
                              )}
                            />
                            {errors.name && <FormFeedback>Name is required</FormFeedback>}
                          </div>

                          <div className="input-box col-lg-6 mb-lg-2 mb-0">
                            <Controller
                              id="email"
                              name="email"
                              defaultValue=""
                              control={control}
                              {...register("email", { required: true })}
                              render={({ field }) => (
                                <Input
                                  className="input-filed"
                                  {...field}
                                  type="email"
                                  placeholder="Email *"
                                  invalid={errors.email && true}
                                />
                              )}
                            />
                            {errors.email && <FormFeedback>Email is required</FormFeedback>}
                          </div>

                          <div className="input-box col-lg-6 mb-lg-2 mb-0">
                            <Controller
                              id="phone"
                              name="phone"
                              defaultValue=""
                              control={control}
                              {...register("phone", { required: true })}
                              render={({ field }) => (
                                <>
                                  <PhoneInput
                                    className="input-filed"
                                    type="number"
                                    country={country}
                                    placeHolder="Phone number *"
                                    {...field}
                                  />
                                </>
                              )}
                            />
                            {errors.phone && <FormFeedback>Phone No. is required</FormFeedback>}
                          </div>

                          <div className="col-lg-6 input-box mt-lg-0">
                            <Controller
                              id="company"
                              name="company"
                              defaultValue=""
                              control={control}
                              {...register("company", { required: true })}
                              render={({ field }) => (
                                <Input
                                  className="input-filed"
                                  type="text"
                                  placeholder="Company name *"
                                  invalid={errors.company && true}
                                  {...field}
                                />
                              )}
                            />

                            {errors.email && <FormFeedback>Company name is required</FormFeedback>}
                          </div>

                          <div className="col-lg-6 input-box mb-lg-0 mb-2">
                            <div className="mb-1">Document (optional)</div>
                            {/* <Controller
                                                    id='image'
                                                    name='image'
                                                    defaultValue=''
                                                    control={control}
                                                    {...register("image", { required: true })}
                                                    render={({ field }) => ( */}

                            <Input className="input-filed" type="file" accept="image/*" name="profile-picture" />
                            {/* )}
                                                /> */}
                            {/* {errors.image && <FormFeedback>image is required</FormFeedback>} */}
                          </div>
                          <div className="col-lg-6 input-box" style={{ justifyContent: "start" }}>
                            <div className="mb-1">Date and Time for Appointment</div>
                            {/* <Controller
                                                    id='dateAndTime'
                                                    name='dateAndTime'
                                                    value={new Date()}
                                                    defaultValue=''
                                                    control={control}
                                                    {...register("dateAndTime", { required: true })}
                                                    render={({ field }) => (
                                                        <Datetime
                                                            inputProps={{ placeholder: "Enter date and time" }}
                                                            {...field}
                                                            className='date-time input-filed'
                                                        />
                                                    )}
                                                /> */}

                            <div className="row flat-picker-row">
                              <Flatpickr
                                className="form-control  react-tel-input input-filed flat-picker col-6"
                                onChange={(date) => _date(date)}
                                id="default-picker"
                                placeholder={`DD-MM-YYYY`}
                                options={{ minDate: moment().toDate() }}
                                // minDate={moment().toDate()}
                                style={{ marginRight: 18 }}
                              />

                              <Flatpickr
                                className="form-control  react-tel-input input-filed flat-picker col-6"
                                id="timepicker"
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "H:i",
                                  time_24hr: false,
                                  // minDate: moment().toDate()
                                }}
                                onChange={(date) => _time(date)}
                                placeholder={`00 : 00 : AM`}
                              />
                            </div>
                            {errors.dateAndTime && <FormFeedback>date {"&"} time is required</FormFeedback>}
                          </div>
                        </div>
                        <div className="input-box col-xs-12 col-lg-12">
                          <Controller
                            id="subject"
                            name="subject"
                            control={control}
                            {...register("subject")}
                            render={({ field }) => (
                              <Input
                                className="comment-input-filed"
                                type="text"
                                placeholder="Subject "
                                {...field}
                                invalid={errors.subject && true}
                              />
                            )}
                          />
                          {errors.subject && <FormFeedback>subject is required</FormFeedback>}
                        </div>
                        <div className="input-box  col-xs-12 col-lg-12">
                          <Controller
                            id="note"
                            name="note"
                            defaultValue=""
                            control={control}
                            {...register("note")}
                            render={({ field }) => (
                              <Input
                                className=" comment-input-filed"
                                type="textarea"
                                style={{ height: 165 }}
                                placeholder="Comment"
                                invalid={errors.note && true}
                                {...field}
                              />
                            )}
                          />
                          {errors.note && <FormFeedback>note is required</FormFeedback>}
                        </div>
                        <button className="send-msg common-button" type="submit">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>


              </div>
            </div>
            <div className="location-div row">
              <div className="col-lg-9 col-sm-12">
                <div className="mapouter">
                  <div className="gmap_canvas">
                    <iframe
                      className="gmap_iframe"
                      width="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src="https://maps.google.com/maps?width=892&amp;height=511&amp;hl=en&amp;q=Wallasey Ave, North York, ON M9M 1E1, Canada &amp;t=p&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    ></iframe>
                    <a href="https://www.kokagames.com/fnf-friday-night-funkin-mods/">FNF Mods</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-12 mt-2">
                <div className="ms-xl-2 ms-0 mt-xl-0 mt-2">
                  <h1 className="mb-2 outfit-bold">Location</h1>
                  <p style={{ fontSize: 15 }} className="text-sm-left">
                    Wallasey Ave, North York, ON M9M 1E1, Canada
                  </p>
                  <p style={{ fontSize: 15 }} className="mt-lg-1 text-sm-left">
                    Visit with Appointment only
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>


      <Footer contactsLetter={true} />
    </div>
  );
}

export default index;
