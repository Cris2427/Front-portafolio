import { useEffect, useState } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

function Dashboard() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    async function cargarFacturas() {
      try {
        const { data } = await api.get("/facturas");
        setFacturas(data);
      } catch (error) {
        console.error("Error al cargar facturas", error);
      }
    }

    cargarFacturas();
  }, []);

  // Obtenemos la fecha de hoy en formato "YYYY-MM-DD" para evitar problemas de zona horaria
  const hoy = new Date().toISOString().split("T")[0];

  const pagadas = facturas.filter((factura) => factura.estado === "PAGADA");

  const pendientes = facturas.filter((factura) => factura.estado === "PENDIENTE");

  // Vencen hoy SOLO si la fecha coincide y NO están pagadas
  const vencenHoy = facturas.filter(
    (factura) => factura.fechaVencimiento === hoy && factura.estado !== "PAGADA"
  );

  // Evaluamos la factura completa para saber qué color le toca
  const badgeColor = (factura) => {
    if (factura.estado === "PAGADA") return "green";
    if (factura.fechaVencimiento === hoy && factura.estado !== "PAGADA") return "red";
    if (factura.estado === "PENDIENTE") return "orange";
    return "blue";
  };

  return (
    <Layout>
      <section className="metrics">
        <div className="card metric red">
          <div className="metric-title">Vencen Hoy</div>
          <div className="metric-value">{vencenHoy.length}</div>
        </div>

        <div className="card metric orange">
          <div className="metric-title">Total Facturas</div>
          <div className="metric-value">{facturas.length}</div>
        </div>

        <div className="card metric blue">
          <div className="metric-title">Pendientes</div>
          <div className="metric-value">{pendientes.length}</div>
        </div>

        <div className="card metric green">
          <div className="metric-title">Pagadas</div>
          <div className="metric-value">{pagadas.length}</div>
        </div>
      </section>

      <section className="alerts">
        <div className="card alert red">
          <div className="alert-title">Facturas que vencen hoy</div>
          <ul>
            {vencenHoy.length > 0 ? (
              vencenHoy.map((factura) => (
                <li key={factura.id}>
                  Folio {factura.folio} - {factura.emisor}
                </li>
              ))
            ) : (
              <li>No hay facturas que vencen hoy</li>
            )}
          </ul>
        </div>

        <div className="card alert orange">
          <div className="alert-title">Facturas pendientes</div>
          <ul>
            {pendientes.length > 0 ? (
              pendientes.slice(0, 5).map((factura) => (
                <li key={factura.id}>
                  Folio {factura.folio} - {factura.emisor}
                </li>
              ))
            ) : (
              <li>No hay facturas pendientes</li>
            )}
          </ul>
        </div>
      </section>

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
            </tr>
          </thead>
          <tbody>
            {facturas.length > 0 ? (
              facturas.map((factura) => (
                <tr key={factura.id}>
                  <td>{factura.folio}</td>
                  <td>{factura.emisor}</td>
                  <td>
                    ${Number(factura.montoTotal || 0).toLocaleString("es-CL")}
                  </td>
                  <td>{factura.fechaVencimiento}</td>
                  <td>
                    {/* Le pasamos el objeto factura completo a la función de color */}
                    <span className={`badge ${badgeColor(factura)}`}>
                      {factura.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No hay facturas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default Dashboard;