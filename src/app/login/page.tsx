"use client";
import React from "react";
import MermaidDiagram from '../callback/MermaidDiagram';

const KEYCLOAK_BASE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL;
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI;
const AUTH_URL = `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/auth`;
const RESOURCE_API_URL = process.env.NEXT_PUBLIC_RESOURCE_API_URL || "http://localhost:8000/api/resource";

function getAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID || "",
    response_type: "code",
    scope: "openid profile email",
    redirect_uri: REDIRECT_URI || "",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export default function LoginPage() {
  const [resourceResponse, setResourceResponse] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [diagram, setDiagram] = React.useState<string>(`
sequenceDiagram
  participant User
  participant App
  participant Keycloak
  User->>App: Visit Login Page
`);
  const [showRedirectButton, setShowRedirectButton] = React.useState(false);
  const [countdown, setCountdown] = React.useState<number | null>(null);

  async function callResource() {
    setError(null);
    setResourceResponse(null);
    try {
      const res = await fetch(RESOURCE_API_URL);
      const data = await res.json();
      setResourceResponse(data);
      setDiagram((prev) => prev + `  App->>Resource: Call Resource\n`);
      setDiagram((prev) => prev + `  Resource->>App: 403: Forbidden\n`);
    } catch (err: any) {
      setError("Resource call failed: " + err.message);
    }
  }

  function handleLoginClick(e: React.MouseEvent) {
    e.preventDefault();
    setDiagram((prev) => prev + `  User->>App: Click Login\n  App->>Keycloak: Redirect to Auth Endpoint (in 3s)\n`);
    setCountdown(3);
    let counter = 3;
    const interval = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(interval);
        window.location.href = getAuthUrl();
      }
    }, 1000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Sitearound OAuth2 POC</h1>
      <a href="#" onClick={handleLoginClick}>
        <button style={{ padding: "12px 24px", fontSize: "18px", cursor: "pointer" }} disabled={countdown !== null}>
          Login
        </button>
      </a>
      {countdown !== null && countdown > 0 && (
        <div style={{ marginTop: 12, color: '#fff', fontSize: 20 }}>
          Redirecting to Keycloak in {countdown} second{countdown !== 1 ? 's' : ''}...
        </div>
      )}
      <button style={{ marginTop: 16, padding: "10px 20px", fontSize: 16 }} onClick={callResource}>
        Call Resource
      </button>
      <MermaidDiagram chart={diagram} />
      {resourceResponse && (
        <div style={{ marginTop: 24, width: "100%", maxWidth: 600 }}>
          <h2>Resource Response</h2>
          <pre style={{ background: "#f4f4f4", padding: 16, borderRadius: 8, overflowX: "auto", color: "#000" }}>{JSON.stringify(resourceResponse, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={{ color: "red", marginTop: 16 }}>{error}</div>
      )}
    </div>
  );
} 