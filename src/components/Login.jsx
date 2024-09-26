import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const Login = ({ setToken, setUserId, csrfToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.message;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            csrfToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const token = data.token;
      const decoded = decodeToken(token);

      // Store user details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("username", decoded.user);
      localStorage.setItem("avatar", decoded.avatar);
      localStorage.setItem("email", decoded.email);

      // Anropa setToken för att uppdatera token i App-komponenten
      setToken(token);
      setUserId(decoded.id);
      setError("");

      navigate("/profile");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    }
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token decoding failed", e);
      return {};
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="min-vh-100 justify-content-center align-items-center" style={{ backgroundImage: "url('/src/components/Assets/Register.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Col md={6} lg={4} className="bg-light p-4 rounded shadow">
          <h1 className="text-center mb-4">Login</h1>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              variant="success"
              className="w-100 mb-3"
            >
              Login
            </Button>
            <NavLink to="/">
              <Button
                variant="outline-success"
                className="w-100"
              >
                No account? Register first!
              </Button>
            </NavLink>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
