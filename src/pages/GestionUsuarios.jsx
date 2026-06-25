import { useEffect, useState } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(true);

    // formulario de creacion de usuario
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("ROLE_EJECUTIVO");

    async function cargarUsuarios() {
        try{
            const { data } = await api.get("/admin/usuarios");
            setUsuarios(Array.isArray(data) ? data : []); 
        } catch (err) {
            setError("No se pudieron cargar los usuarios.");
            console.error(err);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarUsuarios();
    }, []);

    async function crearUsuarios(e) {
        e.preventDefault();
        setError("");
        try{
            await api.post("/admin/usuarios", {
                nombre,
                correo,
                password,
                roles: { nameRol: rol },
            });
            setNombre("");
            setCorreo("");
            setPassword("");
            setRol("ROLE_EJECUTIVO");
            cargarUsuarios();
        } catch (err) {
            setError(err.response?.data?.mensaje || "No se puede crear el usuario.");
            console.error(err);
        }
    }

    async function desactivarUsuario(id) {
        const confirmar = window.confirm("Desactivar este usuario?");
        if (!confirmar) return;
        try {
            await api.delete(`/admin/usuarios/${id}`);
            cargarUsuarios();
        } catch (err) {
            setError("No se pudo desactivar el usuario.")
            console.error(err);
        }
    }

    return (
    <Layout>
      {error && <div className="error visible">{error}</div>}

      <section className="card">
        <div className="table-header">Crear usuario</div>
        <form
          onSubmit={crearUsuario}
          style={{ padding: "16px", display: "grid", gap: "10px", maxWidth: "400px" }}
        >
          <input type="text" placeholder="Nombre" value={nombre}
            onChange={(e) => setNombre(e.target.value)} required />
          <input type="email" placeholder="Correo" value={correo}
            onChange={(e) => setCorreo(e.target.value)} required />
          <input type="password" placeholder="Contraseña (min 8)" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="ROLE_EJECUTIVO">Ejecutivo</option>
            <option value="ROLE_ADMINISTRADOR">Administrador</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
          <button type="submit" className="btn-accion editar">Crear</button>
        </form>
      </section>

      <section className="card table-card" style={{ marginTop: "20px" }}>
        <div className="table-header">Usuarios</div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>{u.activo ? "Sí" : "No"}</td>
                <td>
                  {u.activo && (
                    <button type="button" className="btn-accion eliminar"
                      onClick={() => desactivarUsuario(u.id)}>
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cargando && <p style={{ textAlign: "center", padding: "20px" }}>Cargando...</p>}
        {!cargando && usuarios.length === 0 && (
          <p style={{ textAlign: "center", padding: "20px" }}>No hay usuarios.</p>
        )}
      </section>
    </Layout>
  );
}

export default GestionUsuarios;


