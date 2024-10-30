import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner"; 
import Alert from "react-bootstrap/Alert"; 
import { FaArrowLeft } from "react-icons/fa";

/* Función que recibe las propiedades onLogin, onSignup y authStore, y retorna un componente de React */
const Login = (props) => {
  const { onLogin, onSignup, authStore } = props; 
  const [isLoggedIn, setIsLoggedIn] = useState(authStore.getIsLoggedIn()); // Estado para saber si el usuario está logueado
  const [isLoading, setIsLoading] = useState(authStore.getIsLoading()); // Estado para saber si la página está cargando
  const [showError, setShowError] = useState(authStore.getShowError()); // Estado para mostrar errores
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [isLoggingIn, setIsLoggingIn] = useState(true); // Estado para saber si el usuario está logueando

  /* Efecto que se ejecuta cuando el componente se monta */
  useEffect(() => {
    const handleChange = () => {
      setIsLoggedIn(authStore.getIsLoggedIn());
      setIsLoading(authStore.getIsLoading());
      setShowError(authStore.getShowError());
      if (authStore.getDidSignUp()) {
        setIsLoggingIn(true);
      }
    };

    authStore.addChangeListener(handleChange);
    return () => {
      authStore.removeChangeListener(handleChange);
    };
  }, []);

  /* Función que se ejecuta cuando se envía el formulario */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoggingIn) {
      onLogin(email, password);
    } else {
      onSignup(username, email, password);
    }
  };

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
        padding: "0",
        boxSizing: "border-box",
        fontFamily: "Roboto Mono, monospace",
      }}
    >
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "550px",
          minHeight: "500px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          padding: "50px",
        }}
        className="rounded"
        onSubmit={handleSubmit}
      >
        {/* Botón de regreso, solo visible en la vista de registro */}
        {!isLoggingIn && (
          <Button
            variant="link"
            style={{
              alignSelf: "flex-start",
              marginBottom: "10px",
              fontSize: "1.2rem",
              color: "#3A5474",
              textDecoration: "none",
            }}
            onClick={() => setIsLoggingIn(true)}
          >
            <FaArrowLeft style={{ marginRight: "5px" }} /> Volver a Iniciar Sesión
          </Button>
        )}

        <h1 style={{ marginBottom: "30px" }}>
          {isLoggingIn ? "Inicia Sesión" : "Registro de Usuario"}
        </h1>
        {showError && (
          <Alert variant="danger" style={{ width: "100%" }}>
            {isLoggingIn
              ? "Error: Credenciales incorrectas, intenta de nuevo."
              : "Error: Algo salió mal, intenta de nuevo"}
          </Alert>
        )}

        {!isLoggingIn && (
          <Container fluid style={{ padding: "0" }}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold fs-5">Usuario</Form.Label>
              <Form.Control
                className="form-control-lg"
                type="text"
                style={{
                  borderColor: "#B7B7B7",
                }}
                placeholder="Ingresa tu nombre de usuario"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          </Container>
        )}
        <Container fluid style={{ padding: "0" }}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold fs-5">Correo electrónico</Form.Label>
            <Form.Control
              className="form-control-lg"
              type="email"
              placeholder="ejemplo@correo.com"
              style={{
                borderColor: "#B7B7B7",
              }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Container>
        <Button
          className="fs-5"
          style={{
            width: "100%",
            color: "white",
            backgroundColor: "#3A5474",
            marginTop: "10px",
          }}
          type="submit"
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: "10px" }}
              />
              Cargando...
            </>
          ) : isLoggingIn ? (
            "Ingresar"
          ) : (
            "Registrarse"
          )}
        </Button>
        {isLoggingIn && (
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
            className="fs-5"
          >
            ¿No tienes cuenta?
            <Button
              variant="link"
              style={{ textDecoration: "none" }}
              className="fs-5"
              onClick={() => setIsLoggingIn(false)}
            >
              Regístrate aquí
            </Button>
          </Container>
        )}
      </Form>
    </div>
  );
};

export default Login;
