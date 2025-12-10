const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #20789bff 0%, #0A5275 100%)",
        padding: "25px 0",
        backdropFilter: "blur(6px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.15)",
      }}
      className="mt-auto"
    >
      <div
        className="container d-flex flex-column align-items-center"
        style={{
          color: "rgba(255,255,255,0.85)",
          textAlign: "center",
        }}
      >
        {/* Company Name (Centered & Styled) */}
        <h4
          style={{
            fontSize: "1.4rem",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#AEE6FF", // soft blue from your UI palette
            letterSpacing: "0.5px",
          }}
        >
          DevOx Syndicate
        </h4>

        {/* Footer Links */}
        {/* <div className="d-flex gap-3 flex-wrap justify-content-center">
          <a
            href="#privacy"
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#fff")}
            onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.85)")}
          >
            Privacy Policy
          </a>

          <a
            href="#terms"
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#fff")}
            onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.85)")}
          >
            Terms & Conditions
          </a>

          <a
            href="#contact"
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#fff")}
            onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.85)")}
          >
            Contact
          </a>
        </div> */}

        {/* Copyright */}
        <p
          className="mt-3"
          style={{ fontSize: "0.9rem", opacity: 0.9, fontWeight: 500 }}
        >
          © {new Date().getFullYear()} &nbsp; All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
