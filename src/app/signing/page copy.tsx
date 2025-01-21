"use client";

import React, { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
  Loading,
} from "carbon-components-react";
import { useRouter } from "next/navigation";

const LoginComponent: React.FC = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    setError(null); // Clear previous error
    setIsLoading(true);

    try {
      console.log("API_URL", `${API_URL}/login`);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("user", JSON.stringify(data));

        // Check if there's a redirect URL
        const redirectUrl = new URL(window.location.href);
        const targetUrl = redirectUrl.searchParams.get("redirect") || "/"; // Default to home page
        window.location.href = targetUrl; // Redirect back to the dashboard or home

        // router.push(targetUrl); // Use Next.js router
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      console.log(err);

      setError((err as Error).message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <form onSubmit={handleLogin}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        {/* Username Input */}
        <TextInput
          id="username"
          labelText="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          aria-describedby="username-error"
        />

        {/* Password Input */}
        <PasswordInput
          id="password"
          labelText="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-describedby="password-error"
        />

        {/* Error Notification */}
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onClose={(evt) => {
              setError(null);
              return true;
            }} // Allow users to dismiss error
            style={{ marginTop: "10px" }}
            aria-live="assertive"
          />
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          renderIcon={isLoading ? Loading : undefined} // Show a loading spinner when isLoading
          style={{ marginTop: "20px", width: "100%" }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default LoginComponent;
