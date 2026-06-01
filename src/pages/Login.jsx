import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import "../login.css";

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!correo || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      setCargando(true);

      const { data } = await api.post("/user/login", {
        correo,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("tipoToken", data.tipo || "Bearer");
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          rol: data.rol,
        })
      );

      navigate("/");
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        "Correo o contraseña incorrectos.";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-page">

      {/* Panel izquierdo */}
      <div className="panel-izquierdo">



        <div className="login-logo">
          <span>Agricola</span>
          <span>El</span>
          <span>Capricho</span>
          <span>SPA</span>
        </div>
        <div className="panel-divisor">
          <div className="panel-divisor-linea" />
          <div className="panel-divisor-punto" />
          <div className="panel-divisor-linea" />
        </div>

        <p className="panel-descriptivo">
          Sistema de gestion de facturas 
        </p>

      </div>

      {/* Panel derecho */}
      <div className="panel-derecho">
        <form className="form-box" onSubmit={handleSubmit}>

          <div className="form-titulo">Iniciar sesion</div>
          <div className="form-subtitulo">
            Ingrese sus credenciales para iniciar sesion
          </div>

          <div className={`error ${error ? "visible" : ""}`}>{error}</div>

          <div className="input">
            <label htmlFor="correo">Correo electronico:</label>
            <input
              type="email"
              id="correo"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
            />
          </div>

          <div className="input">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button className="btn-login" type="submit" disabled={cargando}>
            <span className="btn-texto">
              {cargando ? "Ingresando..." : "Ingresar"}
            </span>
          </button>

        </form>
      </div>

    </div>
  );
}

export default Login;
