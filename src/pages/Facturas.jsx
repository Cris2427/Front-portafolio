import { useEffect, useState } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

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
        setFacturas(data);
      } catch (err) {
        setError("No se pudieron cargar las facturas.");
      } finally {
        setCargando(false);
      }
    }

    cargarFacturas();
  }, []);

    async function eliminarFactura(id) {
    const confirmar = window.confirm(
      "¿Seguro que quieres elminar esta factura?"
    );
    if (!confirmar) return;

    try {
      await api.delete(`/facturas/${id}`);
      setFacturas((prev) => prev.filter((factura) => factura.id !== id));
    } catch (err) {
      setError("No se pudo eliminar la factura.")
    }
  }

  const facturasFiltradas = facturas.filter((factura) =>
    String(factura.folio).toLowerCase().includes(busqueda.toLowerCase())
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
                <td>${Number(factura.montoTotal).toLocaleString("es-CL")}</td>
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
        {cargando && <p>Cargando facturas...</p>}
        {!cargando && facturasFiltradas.length === 0 && (
          <p>No hay facturas para mostrar.</p>
        )}
      </section>
    </Layout>
  );
}

export default Facturas;
