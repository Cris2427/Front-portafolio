import { useEffect, useState } from "react";
import api from "../api/api.js";
import Layout from "../components/Layout.jsx";

function Papelera() {
    const [facturas, setFacturas] = useState([]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarPapelera() {
            try {
                const { data } = await api.get("/facturas/papelera");
                setFacturas(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("No se pudo cargar la papelera.");
                console.error(err);
            } finally {
                setCargando(false);
            }
        }
        cargarPapelera();  
    }, []);

    async function restaurarFactura(id) {
        try {
            await api.put(`/facturas/${id}/restaurar`);
            setFacturas((prev) => prev.filter((factura) => factura.id !== id));
        } catch (err) {
            setError("No se pudo restaurar la factura.");
            console.error(err);
        }
    }

    return(
        <Layout>
            {error && <div className="error visible">{error}</div>}

            <section className="card table-card">
                <div className="table-header">Papelera</div>

                <table>
                    <thead>
                        <tr>
                            <th>Folio</th>
                            <th>Emisor</th>
                            <th>Monto</th>
                            <th>Vencimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturas.map((factura) => (
                            <tr key={factura.id}>
                                <td>{factura.folio}</td>
                                <td>{factura.emisor}</td>
                                <td>${Number(factura.montoTotal || 0).toLocaleString("es-CL")}</td>
                                <td>{factura.fechaVencimiento}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn-accion editar"
                                        onClick={() => restaurarFactura(factura.id)}
                                    >
                                        Restaurar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {cargando && (
                    <p style={{ textAlign: "center", padding: "20px" }}>Cargando...</p>
                )}
                {!cargando && facturas.length === 0 && (
                    <p style={{ textAlign: "center", padding: "20px" }}>
                        La papelera está vacía.
                    </p>
                )}
            </section>
        </Layout>
    );
}

export default Papelera;