// ** React Imports
import { Fragment, useState, createContext } from "react";

// ** Third Party Components
import * as yup from "yup";
import "../../scss/authPages.scss";
import "../../scss/button.scss";
import '../../scss/authPages.scss';
import '../../pages/Home/homev2.scss'
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useHistory } from "react-router-dom";
import InputPasswordToggle from "@components/input-password-toggle";
import { useMutation } from "react-apollo";
import { SIGN_IN } from "../../components/Session/mutations";
import { useSkin } from "@hooks/useSkin";
import { FormatError } from "../../../@core/components/common/FormatError";
import { Modal, ModalBody } from "reactstrap";
import { FORGOT_PWD } from "../../components/Session/mutations";
import Header from "../Home/Header/Header";
import { Eye, EyeOff } from "react-feather";

// ** Reactstrap Imports
import { Button, Form, Label, Input, FormFeedback, Spinner } from "reactstrap";

const SignIn = ({ refetch }) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  const defaultEmail = getCookie("userEmail");
  const [isRemember, _isRemember] = useState(false);
  const [modal, setModal] = useState(false);
  const history = useHistory();
  const { skin } = useSkin();


  // Mutation
  const [signIn, { data, loading, error }] = useMutation(SIGN_IN, { fetchPolicy: "no-cache" });

  // ** Validation modules
  const SignupSchema = yup.object().shape({
    email: yup.string().email("email should be valid").required("email is required"),
    password: yup.string().min(8).required("password is required"),
  });

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      if (isRemember) {
        document.cookie = `userEmail=${data?.email}`;
      }
      signIn({ variables: { email: data?.email, password: data?.password } })
        .then(async (data) => {
          const approvedStatus = data?.data?.signIn?.user?.approvedStatus;
          const userType = data?.data?.signIn?.user?.userType;
          if (data?.data?.signIn?.token) {
            handleReset();
            localStorage.setItem("UserRes", JSON.stringify(data?.data?.signIn?.user));
            localStorage.setItem("token", data?.data?.signIn?.token);
            localStorage.setItem("utype", userType);
            const checkProductPath = localStorage.getItem("productPath");
            await refetch();
            if (userType === "Admin") {
              history.push("/products");
            } else if (userType === "AssociatePartner" && approvedStatus !== "approved") {
              history.push("/update-partner-kyc");
            } else if (checkProductPath && checkProductPath !== "null") {
              history.push(checkProductPath);
            } else if (userType === "User") {
              history.push("/dashboard");
            } else if (userType === "AssociateVendor" && approvedStatus !== "approved") {
              history.push("/update-vendor-kyc");
            } else {
              history.push("/");
            }
            toast.success("Logged in successfully");
          }
        })
        .catch((err) => {
          toast.warn(FormatError(err));
        });
    }
  };

  const handleReset = () => {
    reset({
      email: "",
      password: "",
    });
  };

  const toggleHandler = () => {
    setModal(!modal);
  };

  // ===================FORGOT PASSWORD======================

  // Mutation
  const [forgotPassword] = useMutation(FORGOT_PWD, { fetchPolicy: "no-cache" });
  const [visible, setvisible] = useState(false)

  // ** Hooks
  const {
    control: fControl,
    reset: fReset,
    register: fRegister,
    handleSubmit: fHandleSubmit,
    formState: { errors: fErrors },
  } = useForm();

  const onSubmitForgetPassword = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      forgotPassword({ variables: { email: data?.email } })
        .then((data) => {
          if (data?.data?.forgotPassword) {
            handleReset();
            toast.success("We've sent you an email to reset your password");
            // history.push('/reset-password')
          }
        })
        .catch((err) => {
          toast(FormatError(err));
          handleReset();
        });
    }
  };
  return (
    <div className="auth-wrapper auth-cover">
      <Header />
      <div className="auth-form row auth-inner justify-content-xl-center align-items-center flex-start mt-5">
        <div className="sign_text outfit-bold">
          <h1>Sign in or create account to continue to view all our products.</h1>
        </div>
        <div className="col-xl-10 col-12">
          <div className="row justify-content-center align-items-center">
            <div className="login-side col-lg-6 px-xl-2 mx-auto">
              <div className="text-center">
                <h2 className="fw-600 text-black">SIGN IN</h2>
              </div>
              <Form onSubmit={handleSubmit(onSubmit)} className="form-wrap">
                <div style={{ marginTop: "31px" }}>
                  <Controller
                    id="email"
                    name="email"
                    defaultValue={defaultEmail}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        className="py-1 input-filed"
                        style={{ paddingRight: 10 }}
                        placeholder="Email *"
                        invalid={errors.email && true}
                      />
                    )}
                  />
                  {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                </div>
                <div style={{ marginTop: "26px" }}>
                  <div className="eye">
                    <div className="eye-password">
                      <Controller
                        name="password"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <Input
                              className="py-1 input-filed text-grey"
                              placeholder="Password *"
                              type={!visible ? "password" : "text"}
                              required
                              invalid={errors?.password && true}
                              value={value}
                              onChange={(e) => {
                                onChange(e?.target?.value)
                                // setvisible(false)
                              }}
                            />
                          );
                        }}
                      />
                      {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                        </div>
                      <div   className={errors.password ? "mb-2 eye-pass" :"eye-pass"}>                       
                        {visible ?

                          <Eye onClick={() => setvisible(false)} />
                          
                          :
                          <EyeOff onClick={() => setvisible(true)} />
                        }
                    </div>
                  </div>


                </div>
                <div
                  className="form-check"
                  style={{ marginTop: "14px", justifyContent: "space-between", display: "flex" }}
                >
                  <div>
                    <Input
                      type="checkbox"
                      id="remember-me"
                      onChange={(e) => _isRemember(e.target.checked)}
                      style={{ border: "1px solid #5C5D5F", borderRadius: " 0px" }}
                    />
                    <Label className="form-check-label" htmlFor="remember-me">
                      Remember me
                    </Label>
                  </div>
                  <div style={{ float: "right", cursor: "pointer" }}>
                    <span onClick={() => setModal(true)}>
                      <small className="forgot-link">Forgot Password?</small>
                    </span>
                  </div>
                </div>
                <div className="text-center sign_btn">
                  <Button className="common-button" type={`submit`}>
                    Sign In &nbsp; {loading && <Spinner color="light" size="sm" className="mr-2" />}
                  </Button>
                </div>
              </Form>
            </div>
            <div className="col-lg-6">
              <div
                className="text-center align-items-center text-center mt-xl-0 mt-3"
                style={{ justifyContent: "center" }}
              >
                <h2 className="fw-600 text-black">CREATE ACCOUNT</h2>
                <p className="mb-3 mt-1 mx-auto login-txt">
                  Join the CVD Mart family. By registering you can enjoy a more tailored experience with access to all
                  your orders, watchlists and requirements.
                </p>
                <Button className="common-button" type={`submit`}> <Link to="/register" className="auth-white"> Create Customer Account</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggleHandler} className="forgot">
        <ModalBody className="align-items-center text-center forgot-password">
          <div className="m-5">
            <p className="mb-1 head-bold">Forgot Password</p>
            <p className="mx-auto" style={{ width: "380px" }}>
              Please enter your email and we'll send you instructions to reset your password.
            </p>
            <Form onSubmit={fHandleSubmit(onSubmitForgetPassword)}>
              <div>
                <Controller
                  id="email"
                  name="email"
                  control={fControl}
                  {...fRegister("email", {
                    required: true,
                  })}
                  render={({ field }) => (
                    <Input
                      className="input-filed my-2"
                      type="text"
                      placeholder="Email *"
                      invalid={fErrors.email && true}
                      {...field}
                    />
                  )}
                />
                {fErrors.email && <FormFeedback>Please enter a valid email</FormFeedback>}
              </div>
              <Button className="common-button mb-2 mt-1">
                Send &nbsp; {loading && <Spinner color="light" size="sm" className="mr-2" />}
              </Button>
            </Form>

            <Link to="/"
              onClick={() => {
                setModal(false);
              }}
            >
              {/* <ChevronLeft className="rotate-rtl me-25" size={14} /> */}
              <span className="align-middle forgot-link">Back to Sign In</span>
            </Link>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SignIn;
