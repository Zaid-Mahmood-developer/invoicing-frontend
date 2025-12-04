import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { changePasswordInitialValues, changePasswordValidationSchema } from "./dummyUtils";
import { usePostApi } from "../../customhooks/usePostApi";
import Spinner from "../utils/Spinner/Spinner";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo-2.png";

const colors = {
  primary: "#0A5275",
  dark: "#121212",
  cardBg: "rgba(255,255,255,0.88)"
};

const ChangePassword = () => {
  const navigate = useNavigate();

  const { registerUser, data, loading, error } = usePostApi(
    `${import.meta.env.VITE_API_URL}change-password`
  );

  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: changePasswordInitialValues,
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      await registerUser({
        oldpassword: values.oldPassword,
        newpassword: values.newPassword
      });

      setSubmitted(true);
      resetForm();
    }
  });

  useEffect(() => {
    if (data?.status) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password has been changed successfully."
      }).then(() => {
        setSubmitted(false);
        navigate("/home");
      });
    } else if (!error?.status && error?.message) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message
      }).then(() => setSubmitted(false));
    } else if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.message
      }).then(() => setSubmitted(false));
    }
  }, [data, error, navigate]);

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
              <img src={logo} alt="logo" style={{ width: "120px" }} />
              <h3
                className="mt-2"
                style={{ color: colors.primary, fontWeight: 700 }}
              >
                Change Password
              </h3>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                Update your account password securely.
              </p>
            </div>

            {/* SUCCESS MESSAGE */}
            {submitted && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setSubmitted(false)}
              >
                Processing request...
              </Alert>
            )}

            {/* FORM */}
            <Form noValidate onSubmit={formik.handleSubmit}>
              {/* OLD PASSWORD */}
              <Form.Group className="mb-3 text-start">
                <Form.Label style={{ fontWeight: 600, color: colors.dark }}>
                  Old Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="oldPassword"
                  placeholder="Enter old password"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.oldPassword && !!formik.errors.oldPassword
                  }
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    borderColor: colors.primary
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.oldPassword}
                </Form.Control.Feedback>
              </Form.Group>

              {/* NEW PASSWORD */}
              <Form.Group className="mb-3 text-start">
                <Form.Label style={{ fontWeight: 600, color: colors.dark }}>
                  New Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.newPassword && !!formik.errors.newPassword
                  }
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    borderColor: colors.primary
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.newPassword}
                </Form.Control.Feedback>
              </Form.Group>

              {/* SUBMIT BUTTON */}
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
                Change Password
              </Button>
            </Form>
          </Card>
        </Container>
      )}
    </>
  );
};

export default ChangePassword;
