import { Form, Col, Row, Button } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { loginFields, validationSchema, initialValues } from "./dummyUtils";
import Spinner from "../utils/Spinner/Spinner";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePostApi } from "../../customhooks/usePostApi";
import { setUser } from "../../redux/Slices/LoginValuesSlice";
import logo from "../../assets/logo/logo-2.png";

const styles = {
    primary: "#0A5275",
    dark: "#121212",
    cardBg: "rgba(255,255,255,0.9)"
};

const Login = () => {
    const postUrl = `${import.meta.env.VITE_API_URL}login`;
    const { registerUser, data, loading, error } = usePostApi(postUrl);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        await registerUser({ ...values });
    };

    useEffect(() => {
        if (data?.user) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: data?.message
            });
            dispatch(setUser(data?.user));
            navigate("/home");
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
                background: "linear-gradient(135deg, #0A5275 0%, #0f0f0f 100%)",
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
                <div
                    style={{
                        width: "420px",
                        background: styles.cardBg,
                        padding: "30px",
                        borderRadius: "18px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                        backdropFilter: "blur(6px)"
                    }}
                >
                    {/* Header with Logo */}
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "20px"
                        }}
                    >
                        <img
                            src={logo}
                            alt="DevOx Logo"
                            style={{ width: "140px", marginBottom: "10px"}}
                        />
                        <h2 style={{ color: styles.primary, fontWeight: 700 }}>
                            Welcome Back
                        </h2>
                        <p style={{ color: "#444", margin: 0 }}>
                            Login to your DevOx Syndicate account
                        </p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <FormikForm>
                                {loginFields.map((item, id) => (
                                    <Form.Group key={id} className="mb-3">
                                        <Form.Label
                                            style={{
                                                color: styles.dark,
                                                fontWeight: 600
                                            }}
                                        >
                                            {item.label}
                                        </Form.Label>

                                        <Field
                                            as={Form.Control}
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            isInvalid={touched[item.name] && !!errors[item.name]}
                                            style={{
                                                padding: "12px",
                                                borderRadius: "10px",
                                                borderColor: styles.primary
                                            }}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            <ErrorMessage name={item.name} />
                                        </Form.Control.Feedback>

                                        <Link
                                            to={"forgot-password"}
                                            style={{
                                                color: styles.primary,
                                                fontSize: "0.85rem"
                                            }}
                                            className="mt-1 float-end"
                                        >
                                            {item.subLabel}
                                        </Link>
                                    </Form.Group>
                                ))}

                                <Button
                                    style={{
                                        background: styles.primary,
                                        borderColor: styles.primary,
                                        width: "100%",
                                        padding: "12px",
                                        fontWeight: 600,
                                        fontSize: "1.1rem",
                                        borderRadius: "10px"
                                    }}
                                    type="submit"
                                >
                                    Login
                                </Button>
                            </FormikForm>
                        )}
                    </Formik>
                </div>
            )}
        </div>
    );
};

export default Login;
