import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [proveedorFiltro, setProveedorFiltro] = useState("");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esAdmin = usuario.rol === "ROLE_ADMINISTRADOR";
  const navigate = useNavigate();

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

    async function subirDocumento(id, archivo) {
      if (!archivo) return;

      const formData = new FormData();
      formData.append("archivo", archivo);

      try {
        const { data } = await api.post(
          `/facturas/${id}/documento`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setFacturas((prev) =>
          prev.map((factura) => (factura.id === id ? data : factura))
        );
      } catch (err) {
        setError("No se pudo subir el documento.");
        console.error(err);
      }
    }

    async function verDocumento(id) {
      try {
        const { data } = await api.get(`/facturas/${id}/documento`, {
          responseType: "blob",
        });
        const url = URL.createObjectURL(data);
        window.open(url, "_blank");
      } catch (err) {
        setError("No se pudo abrir el documento.");
        console.error(err);
      }
    }

    // lista de proveedores unicos
    const proveedores = [...new Set(facturas.map((factura) => factura.emisor))];

    // filtra por folio y proveedor
    const facturasFiltradas = facturas.filter((factura) => {
      const coincideFolio = factura.folio
        ?.toString()
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const coincideProveedor =
        proveedorFiltro === "" || factura.emisor === proveedorFiltro;
      return coincideFolio && coincideProveedor;
    });

  return (
    <Layout searchValue={busqueda} onSearchChange={setBusqueda}>
      {error && <div className="error visible">{error}</div>}

      <section className="card table-card">
        <div className="table-header">Facturas</div>
        <div style={{ padding: "12px 16px" }}>
          <label style={{ marginRight: "8px", fontWeight: "bold" }}>
            Filtrar por proveedor
          </label>
          <select
            value={proveedorFiltro}
            onChange={(e) => setProveedorFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            {proveedores.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

        </div>

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
                  {factura.urlDocumento && (
                    <button
                      type="button"
                      className="btn-accion ver"
                      onClick={() => verDocumento(factura.id)}
                    >
                      Ver PDF
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-accion editar"
                    onClick={() => navigate(`/facturas/${factura.id}/editar`)}
                  >
                    Editar
                  </button>

                  {esAdmin && (
                    <button
                      type="button"
                      className="btn-accion eliminar"
                      onClick={() => eliminarFactura(factura.id)}
                    >
                      Eliminar
                    </button>
                  )}

                  <label className="btn-accion subir">
                    Subir PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        subirDocumento(factura.id, e.target.files[0])
                      }
                    />
                  </label>
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