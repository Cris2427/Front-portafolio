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