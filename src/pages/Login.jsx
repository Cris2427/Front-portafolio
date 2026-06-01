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

  <svg className="deco-plantas" viewBox="0 0 200 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 320 C100 320 95 260 80 220 C65 180 30 160 10 130 C40 138 70 155 88 185 C80 150 65 110 50 80 C75 105 95 145 100 185 C105 145 125 105 150 80 C135 110 120 150 112 185 C130 155 160 138 190 130 C170 160 135 180 120 220 C105 260 100 320 100 320Z" fill="white"/>
    <path d="M100 280 C100 280 85 240 60 210 C35 180 10 175 0 155 C25 165 55 175 75 200 C70 170 60 135 45 110 C68 132 85 168 92 200 C94 168 100 130 108 110 C115 168 121 200 123 200 C143 175 173 165 198 155 C188 175 163 180 138 210 C113 240 100 280 100 280Z" fill="white" opacity="0.6"/>
    <ellipse cx="60" cy="100" rx="35" ry="22" transform="rotate(-30 60 100)" fill="white" opacity="0.5"/>
    <ellipse cx="140" cy="100" rx="35" ry="22" transform="rotate(30 140 100)" fill="white" opacity="0.5"/>
    <ellipse cx="40" cy="155" rx="30" ry="18" transform="rotate(-20 40 155)" fill="white" opacity="0.4"/>
    <ellipse cx="160" cy="155" rx="30" ry="18" transform="rotate(20 160 155)" fill="white" opacity="0.4"/>
  </svg>

  <svg className="deco-plantas-top" viewBox="0 0 200 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 320 C100 320 95 260 80 220 C65 180 30 160 10 130 C40 138 70 155 88 185 C80 150 65 110 50 80 C75 105 95 145 100 185 C105 145 125 105 150 80 C135 110 120 150 112 185 C130 155 160 138 190 130 C170 160 135 180 120 220 C105 260 100 320 100 320Z" fill="white"/>
    <ellipse cx="60" cy="100" rx="35" ry="22" transform="rotate(-30 60 100)" fill="white" opacity="0.5"/>
    <ellipse cx="140" cy="100" rx="35" ry="22" transform="rotate(30 140 100)" fill="white" opacity="0.5"/>
  </svg>

  {/* Logo */}
  <div className="login-logo">
    <span>Agricola</span>
    <span>El</span>
    <span>Capricho</span>
    <span>SPA</span>
  </div>

  {/* Badges decorativos — llenan el espacio del medio */}
  <div className="panel-centro">
    <div className="panel-badges">
      <div className="panel-badge">
        <div className="panel-badge-icono">📋</div>
        <span>Gestión de facturas y boletas</span>
      </div>
      <div className="panel-badge">
        <div className="panel-badge-icono">⏰</div>
        <span>Control de vencimientos automático</span>
      </div>
      <div className="panel-badge">
        <div className="panel-badge-icono">📊</div>
        <span>Reportes y resumen financiero</span>
      </div>
      <div className="panel-badge">
        <div className="panel-badge-icono">🔒</div>
        <span>Acceso seguro por usuario y rol</span>
      </div>
    </div>
  </div>

  {/* Descripción pie */}
  <p className="panel-descriptivo">
    Sistema de gestion de facturas y vencimientos interno
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
