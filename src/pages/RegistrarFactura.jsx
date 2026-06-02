import { useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/api.js";

const initialForm = {
  folio: "",
  emisor: "",
  montoTotal: "",
  fechaEmision: "",
  fechaVencimiento: "",
  estado: "PENDIENTE",
  usuarioId: "",
};

function RegistrarFactura() {
  const [form, setForm] = useState(initialForm);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const factura = {
      folio: form.folio,
      emisor: form.emisor,
      montoTotal: Number(form.montoTotal),
      fechaEmision: form.fechaEmision,
      fechaVencimiento: form.fechaVencimiento,
      estado: form.estado,
      usuarioId: Number(form.usuarioId),
    };

    try {
      await api.post("/facturas", factura);

      setMensaje("Factura registrada correctamente");
      setForm(initialForm);
    } catch (err) {
      const detalle =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "No se pudo registrar la factura";
      setError(detalle);
    }
  };

  return (
    <Layout>
      <section className="card form-card">
        <div className="table-header">Registrar factura</div>

        {mensaje && <div className="success">{mensaje}</div>}
        {error && <div className="error visible">{error}</div>}

        <form className="factura-form" onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="folio">Folio</label>
            <input
              id="folio"
              name="folio"
              value={form.folio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="emisor">Emisor</label>
            <input
              id="emisor"
              name="emisor"
              value={form.emisor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="montoTotal">Monto total</label>
            <input
              id="montoTotal"
              name="montoTotal"
              type="number"
              min="1"
              value={form.montoTotal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="fechaEmision">Fecha de emisión</label>
            <input
              id="fechaEmision"
              name="fechaEmision"
              type="date"
              value={form.fechaEmision}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
            <input
              id="fechaVencimiento"
              name="fechaVencimiento"
              type="date"
              value={form.fechaVencimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="PROGRAMADA">Programada</option>
              <option value="PAGADA">Pagada</option>
            </select>
          </div>

          <div className="input">
            <label htmlFor="usuarioId">ID usuario</label>
            <input
              id="usuarioId"
              name="usuarioId"
              type="number"
              min="1"
              value={form.usuarioId}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn-login" type="submit">
            Registrar factura
          </button>
        </form>
      </section>
    </Layout>
  );
}

export default RegistrarFactura;