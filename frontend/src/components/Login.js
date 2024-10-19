import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";

const Login = (props) => {
  const { onLogin, authStore } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(authStore.getIsLoggedIn());

  useEffect(() => {
    const handleChange = () => {
      setIsLoggedIn(authStore.getIsLoggedIn());
    };

    authStore.addChangeListener(handleChange);
    return () => {
      authStore.removeChangeListener(handleChange);
    };
  }, []);

  return isLoggedIn ? (
    <Navigate to="/dashboard" />
  ) : (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "550px",
          height: "500px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          padding: "50px",
        }}
        className="rounded"
      >
        <h1>Inicia Sesión</h1>
        <Container fluid style={{ padding: "0", marginTop: "20px" }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="fw-bold fs-5">Correo electrónico</Form.Label>
            <Form.Control
              className="form-control-lg"
              type="email"
              placeholder="ejemplo@correo.com"
              style={{
                borderColor: "#B7B7B7",
              }}
            />
          </Form.Group>
        </Container>

        <Container fluid style={{ padding: "0" }}>
          <Form.Group className="mb-3" controlId="formPlaintextPassword">
            <Form.Label className="fw-bold fs-5" column sm="2">
              Contraseña
            </Form.Label>
            <Form.Control
              className="form-control-lg"
              type="password"
              placeholder="Ingresa tu contraseña"
              style={{
                borderColor: "#B7B7B7",
              }}
            />
          </Form.Group>
        </Container>
        <Button
          className="fs-5"
          variant="warning"
          style={{ width: "100%", color: "white" }}
          onClick={onLogin}
        >
          Ingresar
        </Button>
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
          className="fs-5"
        >
          ¿No tienes cuenta?
          <a
            style={{ textDecoration: "none", marginLeft: "10px" }}
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
          >
            Registrate aquí
          </a>
        </Container>
      </Form>
    </div>
  );
};

export default Login;
