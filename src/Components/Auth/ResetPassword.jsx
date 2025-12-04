import { Container, Form, Button, Card } from "react-bootstrap";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  resetPasswordInitialValues,
  resetPasswordValidationSchema
} from "./dummyUtils";
import { usePostApi } from "../../customhooks/usePostApi";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner/Spinner";
import logo from "../../assets/logo/logo-2.png";

const colors = {
  primary: "#0A5275",
  dark: "#121212",
  cardBg: "rgba(255,255,255,0.88)"
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const postUrl = `${import.meta.env.VITE_API_URL}reset-password/${token}`;
  const { registerUser, data, loading, error } = usePostApi(postUrl);
  const [resetPswd, setResetPswd] = useState(false);

  const formik = useFormik({
    initialValues: resetPasswordInitialValues,
    validationSchema: resetPasswordValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      await registerUser({ newpassword: values.password });
      resetForm();
    }
  });

  useEffect(() => {
    if (data?.status) {
      setResetPswd(true);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: data?.message || "Password reset successfully"
      }).then(() => {
        setResetPswd(false);
        navigate("/");
      });
    } else if (!error?.status && error?.message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message
      }).then(() => setResetPswd(false));
    }
  }, [data, error, navigate]);

  if (loading || resetPswd) return <Spinner />;

  return (
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
        {/* LOGO + Heading */}
        <div className="text-center mb-3">
          <img src={logo} alt="logo" style={{ width: "120px" }} />
          <h3 className="mt-2" style={{ color: colors.primary, fontWeight: 700 }}>
            Create New Password
          </h3>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Enter and confirm your new secure password.
          </p>
        </div>

        {/* FORM */}
        <Form noValidate onSubmit={formik.handleSubmit}>
          {/* Password */}
          <Form.Group className="mb-3 text-start">
            <Form.Label style={{ fontWeight: 600, color: colors.dark }}>
              New Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
              style={{
                padding: "12px",
                borderRadius: "10px",
                borderColor: colors.primary
              }}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-4 text-start">
            <Form.Label style={{ fontWeight: 600, color: colors.dark }}>
              Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.confirmPassword &&
                !!formik.errors.confirmPassword
              }
              style={{
                padding: "12px",
                borderRadius: "10px",
                borderColor: colors.primary
              }}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-100 fw-semibold"
            size="lg"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              padding: "12px",
              borderRadius: "10px"
            }}
          >
            Reset Password
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
  );
};

export default ResetPassword;
