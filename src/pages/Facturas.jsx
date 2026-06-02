import { useState, useEffect } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

// Asignamos el color correcto dependiendo del estado real en la base de datos
function colorEstado(estado) {
  switch (estado) {
    case "PAGADA":
      return "green";
    case "PROGRAMADA":
      return "blue";
    case "PENDIENTE":
      return "orange";
    default:
      return "blue";
  }
}

function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esAdmin = usuario.rol === "ROLE_ADMINISTRADOR";

  useEffect(() => {
    async function cargarFacturas() {
      try {
        const { data } = await api.get("/facturas");
        // Aseguramos que sea un arreglo por si la API responde vacío
        setFacturas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("No se pudieron cargar las facturas.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    }

    cargarFacturas();
  }, []);

    async function eliminarFactura(id) {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar esta factura?"
    );
    if (!confirmar) return;

    try {
      await api.delete(`/facturas/${id}`);
      setFacturas((prev) => prev.filter((factura) => factura.id !== id));
    } catch (err) {
      setError("No se pudo eliminar la factura.")
      console.error(err);
    }
  }

  // Lógica para el buscador de la barra superior (Layout)
  const facturasFiltradas = facturas.filter((factura) =>
    factura.folio?.toString().toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Layout searchValue={busqueda} onSearchChange={setBusqueda}>
      {error && <div className="error visible">{error}</div>}

      <section className="card table-card">
        <div className="table-header">Facturas</div>

        <table>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Emisor</th>
              <th>Monto</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {facturasFiltradas.map((factura) => (
              <tr key={factura.id || factura.folio}>
                <td>{factura.folio}</td>
                <td>{factura.emisor}</td>
                <td>${Number(factura.montoTotal || 0).toLocaleString("es-CL")}</td>
                <td>{factura.fechaVencimiento}</td>
                <td>
                  <span className={`badge ${colorEstado(factura.estado)}`}>
                    {factura.estado}
                  </span>
                </td>
                <td>
                  {esAdmin && (
                    <button
                      type="button"
                      className="btn-accion eliminar"
                      onClick={() => eliminarFactura(factura.id)}
                      >
                        Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cargando && (
          <p style={{ textAlign: "center", padding: "20px" }}>
            Cargando facturas...
          </p>
        )}

        {!cargando && facturasFiltradas.length === 0 && (
          <p style={{ textAlign: "center", padding: "20px" }}>
            No hay facturas para mostrar.
          </p>
        )}
      </section>
    </Layout>
  );
}

export default Facturas;