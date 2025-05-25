"use client";
import { useEffect, useState } from "react";
import MermaidDiagram from './MermaidDiagram';

const KEYCLOAK_BASE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL;
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET;
const TOKEN_URL = `${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/token`;
const RESOURCE_API_URL = process.env.NEXT_PUBLIC_RESOURCE_API_URL || "http://localhost:8000/api/resource";

export default function CallbackPage() {
  const [code, setCode] = useState<string | null>(null);
  const [tokenResponse, setTokenResponse] = useState<any>(null);
  const [resourceResponse, setResourceResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagram, setDiagram] = useState<string>(`
sequenceDiagram
  participant User
  participant App
  participant Keycloak
  App->>Keycloak: Redirect to Keycloak
  User->>Keycloak: Enter credentials
  Keycloak-->>App: Redirect back to callback with code
`);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    setCode(codeParam);
  }, []);

  async function requestAccessToken() {
    if (!code) return;
    setError(null);
    setTokenResponse(null);
    setDiagram((prev) => prev + `  App->>Keycloak: Exchange code for token\n`);
    try {
      const params = new URLSearchParams({
        grant_type: "authorization_code",
        code: code || "",
        client_id: CLIENT_ID || "",
        redirect_uri: REDIRECT_URI || "",
        client_secret: CLIENT_SECRET || "",
      });
      const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Token request failed");
      setTokenResponse(data);
      setDiagram((prev) => prev + `  Keycloak-->>App: Access token\n`);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    // if (!tokenResponse?.refresh_token) return;
    // setError(null);
    try {
      const params = new URLSearchParams({
        client_id: CLIENT_ID || "",
        client_secret: CLIENT_SECRET || "",
        refresh_token: tokenResponse.refresh_token || "",
      });
      await fetch(`${KEYCLOAK_BASE_URL}/realms/${REALM}/protocol/openid-connect/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      setTokenResponse(null);
      // window.location.href = "/login";
    } catch (err: any) {
      setError("Logout failed: " + err.message);
    }
    window.location.href = "/login";
  }

  async function callResource() {
    setError(null);
    setResourceResponse(null);
    if (!tokenResponse?.access_token) {
      setError("No access token available");
      return;
    }
    setDiagram((prev) => prev + `  App->>Resource: Call with access token\n`);
    try {
      const res = await fetch(RESOURCE_API_URL, {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      const data = await res.json();
      setResourceResponse(data);
      setDiagram((prev) => prev + `  Resource-->>App: Resource response\n`);
    } catch (err: any) {
      setError("Resource call failed: " + err.message);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>OAuth2 Callback</h1>
      <MermaidDiagram chart={diagram} />
      <div style={{ position: "absolute", top: 24, right: 24 }}>
        <button
          onClick={handleLogout}
          style={{ padding: "8px 18px", fontSize: 15, background: "#e74c3c", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
      {code ? (
        <>
          <p>Authorization code:</p>
          <code style={{ fontSize: "18px", background: "#eee", padding: "8px 16px", borderRadius: "6px", color: "#000" }}>{code}</code>
          <button style={{ marginTop: 24, padding: "10px 20px", fontSize: 16 }} onClick={requestAccessToken}>
            Request Access Token
          </button>
          <button style={{ marginTop: 16, padding: "10px 20px", fontSize: 16 }} onClick={callResource}>
            Call Resource
          </button>
        </>
      ) : (
        <p>No code found in URL.</p>
      )}
      {tokenResponse && (
        <div style={{ marginTop: 24, width: "100%", maxWidth: 600 }}>
          <h2>Access Token Response</h2>
          <pre style={{ background: "#f4f4f4", padding: 16, borderRadius: 8, overflowX: "auto", color: "#000" }}>{JSON.stringify(tokenResponse, null, 2)}</pre>
        </div>
      )}
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