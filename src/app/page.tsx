import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
      }}
    >
      {/* Logo / Brand */}
      <h1
        style={{
          fontSize: "36px",
          fontWeight: 800,
          color: "#14532d",
          marginBottom: "12px",
        }}
      >
        GoVista
      </h1>

      <p
        style={{
          maxWidth: "480px",
          textAlign: "center",
          color: "#4B5563",
          fontSize: "16px",
          lineHeight: "1.6",
          marginBottom: "32px",
        }}
      >
        A complete tour & travel management platform to manage tours, bookings,
        operators, and travelers — all in one place.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Link href="/auth/login">
          <button
            style={{
              background: "#14532d",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: "12px",
              fontWeight: 600,
              boxShadow: "0 8px 20px rgba(20,83,45,0.25)",
            }}
          >
            Login
          </button>
        </Link>

        <Link href="/auth/signup">
          <button
            style={{
              border: "1px solid #14532d",
              color: "#14532d",
              padding: "12px 28px",
              borderRadius: "12px",
              fontWeight: 600,
              background: "#ffffff",
            }}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
