import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  forgotPasswordInitialValues,
  forgotPasswordValidationSchema
} from "./dummyUtils";
import { usePostApi } from "../../customhooks/usePostApi";
import Spinner from "../utils/Spinner/Spinner";
import Swal from "sweetalert2";
import logo from "../../assets/logo/logo-2.png";
const colors = {
  primary: "#0A5275",
  dark: "#121212",
  cardBg: "rgba(255,255,255,0.88)"
};

const Forgotpassword = () => {
  const { registerUser, data, loading, error } = usePostApi(
    `${import.meta.env.VITE_API_URL}forgot-password`
  );
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: forgotPasswordInitialValues,
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      await registerUser({ ...values });
      setSubmitted(true);
      resetForm();
    }
  });

  useEffect(() => {
    if (data?.status) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: data?.message
      }).then(() => {
        setSubmitted(false);
      });
    } else if (!error?.status && error?.message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message
      }).then(() => setSubmitted(false));
    } else if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message
      }).then(() => setSubmitted(false));
    }
  }, [data, error]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container
          fluid
          className="d-flex justify-content-center align-items-center vh-100"
          style={{
            background: "linear-gradient(135deg, #0A5275 0%, #0b0b0b 100%)",
            padding: "20px"
          }}
        >
          <Card
            className="p-4 shadow-lg rounded-4"
            style={{
              width: "420px",
              background: colors.cardBg,
              backdropFilter: "blur(6px)"
            }}
          >
            {/* LOGO */}
            <div className="text-center mb-3">
              <img
                src={logo}
                alt="logo"
                style={{ width: "120px" }}
              />
              <h3
                className="mt-2"
                style={{ color: colors.primary, fontWeight: 700 }}
              >
                Reset Password
              </h3>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                Enter your email to receive a password reset link.
              </p>
            </div>

            {/* SUCCESS ALERT */}
            {submitted && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setSubmitted(false)}
              >
                Password reset link sent to your email!
              </Alert>
            )}

            {/* FORM */}
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3 text-start">
                <Form.Label style={{ fontWeight: 600, color: colors.dark }}>
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                  isValid={formik.touched.email && !formik.errors.email}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    borderColor: colors.primary
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 mt-2 fw-semibold"
                size="lg"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  padding: "12px",
                  borderRadius: "10px"
                }}
              >
                Send Reset Link
              </Button>
            </Form>

            {/* BACK LINK */}
            <div className="text-center mt-3">
              <Link
                to="/"
                className="text-decoration-none"
                style={{ color: colors.primary }}
              >
                ← Back to Login
              </Link>
            </div>
          </Card>
        </Container>
      )}
    </>
  );
};

export default Forgotpassword;
