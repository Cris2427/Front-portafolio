import { useEffect, useState } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

const facturasDemo = [
  {
    id: 1,
    folio: "10234",
    proveedor: "Agroinsumos Ltda.",
    monto: "$1.240.000",
    fechaVencimiento: "Hoy",
    estado: "Vence Hoy",
    color: "red",
  },
  {
    id: 2,
    folio: "10260",
    proveedor: "RiegoTech",
    monto: "$890.000",
    fechaVencimiento: "3 dias",
    estado: "3 Dias",
    color: "orange",
  },
  {
    id: 3,
    folio: "10271",
    proveedor: "Semillas del Sur",
    monto: "$540.000",
    fechaVencimiento: "5 dias",
    estado: "5 Dias",
    color: "blue",
  },
  {
    id: 4,
    folio: "10198",
    proveedor: "Fertilizantes Campo",
    monto: "$2.100.000",
    fechaVencimiento: "Pagada",
    estado: "Pagada",
    color: "green",
  },
];

function Facturas() {
  const [facturas, setFacturas] = useState(facturasDemo);
  const [busqueda, setBusqueda] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    async function cargarFacturas() {
      try {
        const { data } = await api.get("/facturas");
        setFacturas(data);
      } catch (error) {
        setAviso("Mostrando datos de ejemplo hasta conectar el listado real.");
      }
    }

    cargarFacturas();
  }, []);

  const facturasFiltradas = facturas.filter((factura) =>
    String(factura.folio).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Layout searchValue={busqueda} onSearchChange={setBusqueda}>
      {aviso && <div className="notice">{aviso}</div>}

      <section className="card table-card">
        <div className="table-header">Facturas</div>
        <table>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Proveedor</th>
              <th>Monto</th>
              <th>Vencimiento</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {facturasFiltradas.map((factura) => (
              <tr key={factura.id || factura.folio}>
                <td>{factura.folio}</td>
                <td>{factura.proveedor}</td>
                <td>
                  {typeof factura.monto === "number"
                    ? `$${factura.monto.toLocaleString("es-CL")}`
                    : factura.monto}
                </td>
                <td>{factura.fechaVencimiento}</td>
                <td>
                  <span className={`badge ${factura.color || "blue"}`}>
                    {factura.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default Facturas;
