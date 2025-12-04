export default function About() {
  const colors = {
    primary: "#0A5275",
    dark: "#121212",
    cardBg: "rgba(255,255,255,0.88)"
  };

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #0A5275 0%, #0b0b0b 100%)",
        padding: "30px"
      }}
    >
      <div
        className="p-4 shadow-lg rounded-4"
        style={{
          maxWidth: "700px",
          width: "100%",
          background: colors.cardBg,
          backdropFilter: "blur(8px)"
        }}
      >
        <h2
          className="fw-bold mb-3"
          style={{ color: colors.primary, fontSize: "1.8rem" }}
        >
          About – FBR Digital Invoicing App 1.0
        </h2>

        <h5 className="mb-3" style={{ color: colors.dark }}>
          Welcome to <b>FBR Digital Invoicing App v1.0</b> — your smart
          companion for simplified and compliant digital tax management.
        </h5>

        <p className="mb-2" style={{ color: colors.dark, fontWeight: 600 }}>
          This app lets you:
        </p>

        <ul style={{ color: colors.dark, lineHeight: "1.8", paddingLeft: "20px" }}>
          <li>Create and submit FBR-compliant invoices instantly</li>
          <li>Send invoices to FBR Sandbox without OAuth/PFX</li>
          <li>View submission status and response logs</li>
          <li>Validate invoice fields automatically</li>
          <li>Keep your invoicing transparent and error-free</li>
          <li>
            Our goal: Make digital invoicing simple, fast, and compliant for
            every business in Pakistan.
          </li>
        </ul>
      </div>
    </div>
  );
}
