// ** Third Party Components
import * as yup from "yup";
import { Check } from "react-feather";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useHistory } from "react-router-dom";
import foreveryLogo from "../../../assets/images/icons/logo.svg";
import vectors from "../../../assets/images/illustration/vectors.svg";
import InputPasswordToggle from "@components/input-password-toggle";
import { ApolloConsumer, useMutation } from "react-apollo";
import { CHANGE_PASSWORD } from "./mutations";
import { useSkin } from "@hooks/useSkin";
import { useDispatch } from "react-redux";
import { FormatError } from "../../../@core/components/common/FormatError";
import Header from "../Home/Header/Header";
import "./ChangePassword.scss";
import deshboard from "../../../assets/images/icons/deshbord-icon.svg";
import BackArrow from "../../components/Back";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Button,
  Form,
  Label,
  FormFeedback,
  Spinner,
} from "reactstrap";
import { handleLogout } from "../../../redux/authentication";

const ChangePassword = () => {
  const history = useHistory();
  const { skin } = useSkin();
  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`);
  const dispatch = useDispatch();
  // Mutation
  const [changePassword, { data, loading, error }] =
    useMutation(CHANGE_PASSWORD);
  const signOut = (client) => {
    localStorage.clear();
    client.cache.reset();
    history.push("/login");
    client.clearStore();
    dispatch(handleLogout());
  };
  // ** Validation modules
  const SignupSchema = yup.object().shape({
    oldPass: yup.string().min(8).required(),
    newPass: yup.string().min(8).required(),
  });

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

  const onSubmit = (data, client) => {
    data.preventDefault();
    let oldPass = data?.target[0]?.value || null;
    let newPassword = data?.target[1]?.value || null;
    if (oldPass && newPassword) {
      changePassword({
        variables: { oldPassword: oldPass, newPassword: newPassword },
      })
        .then(async (data) => {
          if (data?.data?.changePassword) {
            toast.success("Password change successfully");
            signOut(client);
            handleReset();
          }
        })
        .catch((err) => {
          toast.warn(FormatError(err));
        });
    }
  };

  const handleReset = () => {
    reset({
      oldPass: "",
      newPass: "",
    });
  };

  return (
    <div className="home-page">
      <div className="banner-img-wrap">
        <div className="banner-img">
          <Header />
          <div className="container history-wrap">
            <div
              className="align-items-center text-center p-lg-2 p-2"
              style={{ justifyContent: "center"}}
            >
              <div
                className="d-flex align-items-center"
              >
                <BackArrow history={history} />
                <h5 className="product-desc-title m-0 outfit-bold">Back</h5>
              </div>
              <h1>Change Your Password Here!</h1>
              <ApolloConsumer>
                {(client) => (
                  <Form
                    className="main-form"
                    onSubmit={(data) => handleSubmit(onSubmit(data, client))}
                  >
                    <div className="my-2">
                      <Label className="form-label input-label" htmlFor="email">
                        Old Password
                      </Label>
                      <Controller
                        name="oldPass"
                        style={{ justifyContent: "center" }}
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <InputPasswordToggle
                              style={{
                                border: "1px solid #5c5d5f",
                                borderRadius: "0px",
                                maxWidth: "413px",
                                padding: "15px 10px",
                                boxShadow: "none",
                              }}
                              required
                              invalid={errors?.oldPass && true}
                              value={value}
                              onChange={(e) => onChange(e?.target?.value)}
                            />
                          );
                        }}
                      />
                      {errors.oldPass && (
                        <FormFeedback>{errors.oldPass.message}</FormFeedback>
                      )}
                    </div>
                    <div className="my-2" style={{ justifyContent: "center" }}>
                      <Label
                        className="form-label input-label"
                        htmlFor="password"
                      >
                        New Password
                      </Label>
                      <Controller
                        name="newPass"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <InputPasswordToggle
                              style={{
                                border: "1px solid #5c5d5f",
                                borderRadius: "0px",
                                maxWidth: "413px",
                                padding: "15px 10px",
                              }}
                              required
                              invalid={errors?.newPass && true}
                              value={value}
                              onChange={(e) => onChange(e?.target?.value)}
                            />
                          );
                        }}
                      />
                      {errors.newPass && (
                        <FormFeedback>{errors.newPass.message}</FormFeedback>
                      )}
                    </div>
                    <Button className="common-button mt-3" type={`submit`}>
                      Change Password &nbsp;{" "}
                      {loading && (
                        <Spinner color="light" size="sm" className="mr-2" />
                      )}
                    </Button>
                  </Form>
                )}
              </ApolloConsumer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
