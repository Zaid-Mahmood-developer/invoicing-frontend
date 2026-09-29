import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/Slices/LoginValuesSlice";
import logo from "../../assets/logo/logo-2.png";

export default function PaymentOverdue() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    dispatch(logout());

    const interval = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 5000);

    const timeout = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, 8000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [dispatch, navigate]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #0A5275, #0f172a)",
      }}
    >
      <section
        aria-labelledby="payment-heading"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "40px 28px",
          background: "#fff",
          borderRadius: "24px",
          textAlign: "center",
          boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
        }}
      >
        <img
          src={logo}
          alt="DevOx Syndicate"
          style={{ width: "140px", marginBottom: "28px" }}
        />

        <div
          aria-hidden="true"
          style={{
            width: "76px",
            height: "76px",
            margin: "0 auto 24px",
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background: "#fff4e5",
            color: "#b45309",
            fontSize: "38px",
            fontWeight: 700,
          }}
        >
          !
        </div>

        <p
          style={{
            color: "#b45309",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          ACCOUNT ACCESS PAUSED
        </p>

        <h1
          id="payment-heading"
          style={{
            color: "#0f172a",
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Your payment is overdue
        </h1>

        <p
          style={{
            color: "#64748b",
            lineHeight: 1.7,
            marginBottom: "28px",
          }}
        >
          Please contact your administrator to resolve your outstanding
          payment and restore access to your account.
        </p>

        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          style={{
            width: "100%",
            padding: "14px 20px",
            border: 0,
            borderRadius: "12px",
            background: "#0A5275",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to login
        </button>

        <p
          style={{
            color: "#64748b",
            fontSize: "13px",
            margin: "18px 0 0",
          }}
        >
          Returning to login in {seconds} seconds…
        </p>
      </section>
    </main>
  );
}