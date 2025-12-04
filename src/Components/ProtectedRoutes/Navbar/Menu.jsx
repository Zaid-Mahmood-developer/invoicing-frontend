import { Link, useNavigate } from "react-router-dom";
import { navMenu } from "../Navbar/dummyUtils";
import { useEffect, useState } from "react";
import { usePostApi } from "../../../customhooks/usePostApi";
import Swal from "sweetalert2";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import Spinner from "../../utils/Spinner/Spinner";
import logo from "../../../assets/logo/logo-2.png"
export default function MainDashboard() {
  const logoutUrl = `${import.meta.env.VITE_API_URL}logout`;

  const { registerUser, data, loading, error } = usePostApi(logoutUrl);
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const activeLinkFunction = (id) => {
    setActiveLink(id);
  };

  const logoutBtn = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      setLoggingOut(true)
      await registerUser({});
    }
  }

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  loggingOut || loading && <Spinner />

  useEffect(() => {
    if (data?.status && data?.message) {
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: data?.message,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/"), setLoggingOut(false));
    } else if (!data?.status && data?.message) {
      setLoggingOut(false);
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        text: data?.message || "Something went wrong while logging out.",
      });
    }
  }, [data?.status, data?.message])

  return (
    <>
      {(loggingOut || loading) && <Spinner />}

      <Navbar
        expand="md"
        sticky="top"
        className="shadow-sm"
        style={{
          background: "linear-gradient(135deg, #20789bff 0%, #0A5275 100%)",
          padding: "10px 0",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(255,255,255,0.15)"
        }}
      >
        <Container fluid className="d-flex align-items-center justify-content-between">

          {/* Brand */}
          <Navbar.Brand
            as={Link}
            to={navMenu[0].path}
            onClick={() => activeLinkFunction(0)}
            className="fw-bold d-flex align-items-center"
            style={{
              color: "#fff",
              fontSize: "1.25rem",
              letterSpacing: "0.5px",
              textDecoration: "none",
            }}
          >
            {/* Logo */}
            <img
              src={logo} // replace with your logo path
              alt="Logo"
              style={{
                height: "80px",
                marginRight: "10px",
                objectFit: "contain",
              }}
            />
            {navMenu[0].title}
          </Navbar.Brand>


          {/* Toggle */}
          <Navbar.Toggle
            aria-controls="main-navbar"
            className="border-0"
            style={{
              backgroundColor: "rgba(255,255,255,0.4)",
            }}
          />

          {/* Menu */}
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-center">

              {/* Nav Links */}
              {navMenu.slice(1).map((item, id) => (
                <Nav.Link
                  as={Link}
                  key={id + 1}
                  to={item.path}
                  onClick={() => activeLinkFunction(id + 1)}
                  style={{
                    color: activeLink === id + 1 ? "#fff" : "rgba(255,255,255,0.75)",
                    fontWeight: activeLink === id + 1 ? 700 : 500,
                    padding: "8px 14px",
                    borderRadius: "8px",
                    transition: "0.3s",
                  }}
                  className="mx-2"
                >
                  {item.title}
                </Nav.Link>
              ))}

              {/* Dropdown */}
              <Dropdown align="end" className="ms-md-3">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="fw-semibold px-3 py-1"
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                >
                  Account
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow border-0"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    borderRadius: "12px",
                    padding: "8px",
                  }}
                >
                  <Dropdown.Item
                    onClick={handleChangePassword}
                    className="fw-semibold"
                    style={{ color: "#0A5275" }}
                  >
                    Change Password
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item
                    onClick={logoutBtn}
                    disabled={loading}
                    className="fw-semibold"
                    style={{ color: "#d33" }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );

}
