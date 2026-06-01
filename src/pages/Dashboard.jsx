import { useEffect, useState } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

function Dashboard() {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    async function cargarFacturas() {
      try {
        const { data } = await api.get("/facturas");
        console.log(data); // revisa cómo llega

        setFacturas(data);
      } catch (error) {
        console.error(
          "Error al cargar facturas",
          error
        );
      }
    }

    cargarFacturas();
  }, []);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const pagadas = facturas.filter(
    (factura) =>
      factura.estado === "PAGADA"
  );

  const pendientes = facturas.filter(
    (factura) =>
      factura.estado === "PENDIENTE"
  );

  const vencenHoy = facturas.filter(
    (factura) => {
      if (!factura.fechaVencimiento)
        return false;

      const fechaFactura = new Date(
        factura.fechaVencimiento
      );

      fechaFactura.setHours(0, 0, 0, 0);

      return (
        fechaFactura.getTime() ===
        hoy.getTime()
      );
    }
  );

  const badgeColor = (estado) => {
    switch (estado) {
      case "PAGADA":
        return "green";
      case "PENDIENTE":
        return "orange";
      case "VENCIDA":
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <Layout>
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

      <section className="alerts">
        <div className="card alert red">
          <div className="alert-title">
            Facturas que vencen hoy
          </div>

          <ul>
            {vencenHoy.length > 0 ? (
              vencenHoy.map(
                (factura) => (
                  <li
                    key={factura.id}
                  >
                    Folio{" "}
                    {factura.folio} -{" "}
                    {
                      factura.emisor
                    }
                  </li>
                )
              )
            ) : (
              <li>
                No hay facturas
                que vencen hoy
              </li>
            )}
          </ul>
        </div>

        <div className="card alert orange">
          <div className="alert-title">
            Facturas pendientes
          </div>

          <ul>
            {pendientes.length >
            0 ? (
              pendientes
                .slice(0, 5)
                .map(
                  (factura) => (
                    <li
                      key={
                        factura.id
                      }
                    >
                      Folio{" "}
                      {
                        factura.folio
                      }{" "}
                      -{" "}
                      {
                        factura.emisor
                      }
                    </li>
                  )
                )
            ) : (
              <li>
                No hay facturas
                pendientes
              </li>
            )}
          </ul>
        </div>
      </section>

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
            {facturas.map(
              (factura) => (
                <tr
                  key={
                    factura.id
                  }
                >
                  <td>
                    {
                      factura.folio
                    }
                  </td>

                  <td>
                    {
                      factura.emisor
                    }
                  </td>

                  <td>
                    $
                    {Number(
                      factura.montoTotal
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
                      className={`badge ${badgeColor(
                        factura.estado
                      )}`}
                    >
                      {
                        factura.estado
                      }
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default Dashboard;