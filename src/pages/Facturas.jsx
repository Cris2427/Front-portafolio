import { useEffect, useState } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

<<<<<<< HEAD
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
=======
function Dashboard() {
  const [facturas, setFacturas] = useState([]);
>>>>>>> a8716a7 (visual del dashboard)

  useEffect(() => {
    async function cargarFacturas() {
      try {
        const { data } = await api.get("/facturas");
        setFacturas(data);
<<<<<<< HEAD
      } catch (err) {
        setError("No se pudieron cargar las facturas.");
      } finally {
        setCargando(false);
=======
      } catch (error) {
        console.error("Error al cargar facturas", error);
>>>>>>> a8716a7 (visual del dashboard)
      }
    }

    cargarFacturas();
  }, []);

  const hoy = new Date().toISOString().split("T")[0];

  const pagadas = facturas.filter(
    (factura) => factura.estado === "PAGADA"
  );

<<<<<<< HEAD
  return (
    <Layout searchValue={busqueda} onSearchChange={setBusqueda}>
      {error && <div className="error visible">{error}</div>}
=======
  const pendientes = facturas.filter(
    (factura) => factura.estado === "PENDIENTE"
  );
>>>>>>> a8716a7 (visual del dashboard)

  const vencenHoy = facturas.filter(
    (factura) => factura.fechaVencimiento === hoy
  );

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "PAGADA":
        return "green";
      case "PENDIENTE":
        return "orange";
      case "VENCE_HOY":
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <Layout>
      {/* MÉTRICAS */}
      <section className="metrics">
        <div className="card metric red">
          <div className="metric-title">
            Vencen Hoy
          </div>
          <div className="metric-value">
            {vencenHoy.length}
          </div>
        </div>

        <div className="card metric orange">
          <div className="metric-title">
            Total Facturas
          </div>
          <div className="metric-value">
            {facturas.length}
          </div>
        </div>

        <div className="card metric blue">
          <div className="metric-title">
            Pendientes
          </div>
          <div className="metric-value">
            {pendientes.length}
          </div>
        </div>

        <div className="card metric green">
          <div className="metric-title">
            Pagadas
          </div>
          <div className="metric-value">
            {pagadas.length}
          </div>
        </div>
      </section>

      {/* ALERTAS */}
      <section className="alerts">
        <div className="card alert red">
          <div className="alert-title">
            Facturas que vencen hoy
          </div>

          <ul>
            {vencenHoy.length > 0 ? (
              vencenHoy.map((factura) => (
                <li key={factura.id}>
                  Folio {factura.folio} -{" "}
                  {factura.emisor}
                </li>
              ))
            ) : (
              <li>
                No hay facturas que vencen hoy
              </li>
            )}
          </ul>
        </div>

        <div className="card alert orange">
          <div className="alert-title">
            Facturas pendientes
          </div>

          <ul>
            {pendientes.length > 0 ? (
              pendientes
                .slice(0, 5)
                .map((factura) => (
                  <li key={factura.id}>
                    Folio {factura.folio} -{" "}
                    {factura.emisor}
                  </li>
                ))
            ) : (
              <li>
                No hay facturas pendientes
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* TABLA */}
      <section className="card table-card">
        <div className="table-header">
          Facturas
        </div>

        <table>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Emisor</th>
              <th>Monto</th>
              <th>Vencimiento</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
<<<<<<< HEAD
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
=======
            {facturas.length > 0 ? (
              facturas.map((factura) => (
                <tr key={factura.id}>
                  <td>{factura.folio}</td>

                  <td>
                    {factura.emisor}
                  </td>

                  <td>
                    $
                    {Number(
                      factura.montoTotal || 0
                    ).toLocaleString(
                      "es-CL"
                    )}
                  </td>

                  <td>
                    {
                      factura.fechaVencimiento
                    }
                  </td>

                  <td>
                    <span
                      className={`badge ${obtenerColorEstado(
                        factura.estado
                      )}`}
                    >
                      {factura.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No hay facturas
>>>>>>> a8716a7 (visual del dashboard)
                </td>
              </tr>
            )}
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

export default Dashboard;