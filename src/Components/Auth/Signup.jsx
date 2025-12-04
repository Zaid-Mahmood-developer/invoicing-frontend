import { Form, Col, Row, Button, Card } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import {
  signupFields,
  signupInitialValues,
  signupValidationSchema
} from "./dummyUtils";
import { Link, useNavigate } from "react-router-dom";
import { usePostApi } from "../../customhooks/usePostApi";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { signupVals } from "../../redux/Slices/LoginValuesSlice";
import Spinner from "../utils/Spinner/Spinner";
import logo from "../../assets/logo/logo-2.png";
const colors = {
  primary: "#0A5275",
  dark: "#121212",
  cardBg: "rgba(255,255,255,0.88)"
};

const Signup = () => {
  const postUrl = `${import.meta.env.VITE_API_URL}signup`;
  const { registerUser, data, loading, error } = usePostApi(postUrl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await registerUser({
      NTNCNIC: values.ntncninc,
      FBRToken: values.securitycode,
      BusinessName: values.businessname,
      Province: values.province,
      Address: values.address,
      email: values.email,
      username: values.username,
      password: values.password,
      newpassword: values.confirmpassword
    });
  };

  useEffect(() => {
    if (data?.user) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: data?.message
      });
      dispatch(signupVals(data?.user));
      navigate("/");
    } else if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message || "Something went wrong!"
      }).then(() => navigate("/"));
    }
  }, [data, error, navigate]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0A5275 0%, #0b0b0b 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      {loading ? (
        <Spinner />
      ) : (
        <Card
          className="shadow-lg p-4"
          style={{
            width: "500px",
            borderRadius: "18px",
            background: colors.cardBg,
            backdropFilter: "blur(6px)"
          }}
        >
          <Card.Body>
            {/* Logo + Title */}
            <div className="text-center mb-3">
              <img
                src={logo}
                alt="logo"
                style={{ width: "140px" }}
              />
              <h3
                style={{
                  color: colors.primary,
                  fontWeight: 700,
                  marginTop: "10px"
                }}
              >
                Create an Account
              </h3>
              {/* <p style={{ color: "#555" }}>Join the DevOx Syndicate</p> */}
            </div>

            <Formik
              initialValues={signupInitialValues}
              validationSchema={signupValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue }) => (
                <FormikForm>
                  {signupFields.map((item, id) => (
                    <Form.Group key={id} className="mb-3 text-start">
                      <Form.Label
                        style={{ color: colors.dark, fontWeight: 600 }}
                      >
                        {item.label}
                      </Form.Label>

                      {item.type === "dropdown" ? (
                        <Field
                          as="select"
                          name={item.name}
                          className={`form-select ${
                            touched[item.name] && errors[item.name]
                              ? "is-invalid"
                              : ""
                          }`}
                          style={{
                            padding: "12px",
                            borderRadius: "10px",
                            borderColor: colors.primary
                          }}
                        >
                          <option value="Select province">Select province</option>
                          {item.options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </Field>
                      ) : (
                        <Field
                          as={Form.Control}
                          type={item.type}
                          name={item.name}
                          placeholder={item.placeholder}
                          isInvalid={touched[item.name] && !!errors[item.name]}
                          style={{
                            padding: "12px",
                            borderRadius: "10px",
                            borderColor: colors.primary
                          }}
                          onInput={(e) => {
                            if (item.name === "ntncninc") {
                              let value = e.target.value.replace(/\D/g, "");
                              setFieldValue(item.name, value.slice(0, 7));
                            }
                          }}
                          onKeyDown={(e) => {
                            if (item.name === "ntncninc") {
                              if (
                                !/[0-9]/.test(e.key) &&
                                !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(
                                  e.key
                                )
                              ) {
                                e.preventDefault();
                              }
                            }
                          }}
                        />
                      )}

                      <Form.Control.Feedback type="invalid">
                        <ErrorMessage name={item.name} />
                      </Form.Control.Feedback>

                      {item.subLabel && (
                        <Link
                          to="#"
                          className="mt-1 float-start"
                          style={{ color: colors.primary }}
                        >
                          {item.subLabel}
                        </Link>
                      )}
                    </Form.Group>
                  ))}

                  <Button
                    type="submit"
                    className="w-100 mt-2"
                    style={{
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      padding: "12px",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      borderRadius: "10px"
                    }}
                  >
                    Register
                  </Button>
                </FormikForm>
              )}
            </Formik>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Signup;
