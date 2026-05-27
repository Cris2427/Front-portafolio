import { useState } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

const facturaInicial = {
  folio: "",
  proveedor: "",
  monto: "",
  fechaVencimiento: "",
  estado: "PENDIENTE",
};

function RegistrarFactura() {
  const [factura, setFactura] = useState(facturaInicial);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFactura({ ...factura, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMensaje("");
    setError("");

    try {
      setCargando(true);

      // Ajustar estos nombres cuando tengan el DTO real de factura.
      await api.post("/facturas", {
        ...factura,
        monto: Number(factura.monto),
      });

      setMensaje("Factura registrada correctamente.");
      setFactura(facturaInicial);
    } catch (error) {
      const mensajeBack =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        "No se pudo registrar la factura. Revisa endpoint y DTO.";

      setError(mensajeBack);
    } finally {
      setCargando(false);
    }
  }

  return (
    <Layout>
      <section className="card form-card">
        <div className="table-header">Registrar factura</div>

        {mensaje && <div className="success">{mensaje}</div>}
        {error && <div className="error visible">{error}</div>}

        <form className="factura-form" onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="folio">Folio</label>
            <input id="folio" name="folio" value={factura.folio} onChange={handleChange} required />
          </div>

          <div className="input">
            <label htmlFor="proveedor">Proveedor</label>
            <input id="proveedor" name="proveedor" value={factura.proveedor} onChange={handleChange} required />
          </div>

          <div className="input">
            <label htmlFor="monto">Monto</label>
            <input id="monto" name="monto" type="number" min="1" value={factura.monto} onChange={handleChange} required />
          </div>

          <div className="input">
            <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
            <input id="fechaVencimiento" name="fechaVencimiento" type="date" value={factura.fechaVencimiento} onChange={handleChange} required />
          </div>

          <div className="input">
            <label htmlFor="estado">Estado</label>
            <select id="estado" name="estado" value={factura.estado} onChange={handleChange}>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADA">Pagada</option>
              <option value="VENCIDA">Vencida</option>
            </select>
          </div>

          <button className="btn-login" type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Guardar factura"}
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default RegistrarFactura;
