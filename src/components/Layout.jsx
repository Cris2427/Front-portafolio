import { NavLink, useNavigate } from "react-router-dom";

function obtenerIniciales(nombre = "Usuario") {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

function Layout({ children, searchValue = "", onSearchChange }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const puedeModificar = usuario.rol === "ROLE_ADMINISTRADOR" || usuario.rol === "ROLE_ADMIN";
  const esAdmin = usuario.rol === "ROLE_ADMIN";

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("tipoToken");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span>Agricola</span>
          <span>El</span>
          <span>Capricho</span>
          <span>SPA</span>
        </div>

        <nav className="nav">
          <NavLink to="/" end className="nav-item">
            Dashboard
          </NavLink>
          <NavLink to="/facturas" className="nav-item">
            Facturas
          </NavLink>
          <NavLink to="/registrarfactura" className="nav-item">
            Registrar factura
          </NavLink>
          {esAdmin && (
            <NavLink to="/papelera" className="nav-item">
              Papelera
            </NavLink>
          )}
          {esAdmin && (
            <NavLink to="/usuarios" className="nav-item">
              Usuarios
            </NavLink>
          )}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <input
            type="text"
            className="search"
            placeholder="Buscar por folio..."
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />

          <div className="user">
            <button className="logout" type="button" onClick={cerrarSesion}>
              Salir
            </button>
            <div className="avatar">{obtenerIniciales(usuario.nombre)}</div>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>
    </div>
  );
}

export default Layout;
