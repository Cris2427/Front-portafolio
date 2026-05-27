import Layout from "../components/Layout.jsx";

function Dashboard() {
  return (
    <Layout>
      <section className="metrics">
        <div className="card metric red">
          <div className="metric-title">Vencen Hoy</div>
          <div className="metric-value">12</div>
        </div>

        <div className="card metric orange">
          <div className="metric-title">En 3 Dias</div>
          <div className="metric-value">27</div>
        </div>

        <div className="card metric blue">
          <div className="metric-title">En 5 Dias</div>
          <div className="metric-value">41</div>
        </div>

        <div className="card metric green">
          <div className="metric-title">Pagadas</div>
          <div className="metric-value">186</div>
        </div>
      </section>

      <section className="alerts">
        <div className="card alert red">
          <div className="alert-title">Facturas que vencen hoy</div>
          <ul>
            <li>Folio 10234 - Agroinsumos Ltda.</li>
            <li>Folio 10241 - Semillas del Sur</li>
            <li>Folio 10252 - Fertilizantes Campo</li>
          </ul>
        </div>

        <div className="card alert orange">
          <div className="alert-title">Facturas que vencen en 3 dias</div>
          <ul>
            <li>Folio 10260 - RiegoTech</li>
            <li>Folio 10261 - AgroServicios SPA</li>
          </ul>
        </div>
      </section>

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
            <tr>
              <td>10234</td>
              <td>Agroinsumos Ltda.</td>
              <td>$1.240.000</td>
              <td>Hoy</td>
              <td>
                <span className="badge red">Vence Hoy</span>
              </td>
            </tr>
            <tr>
              <td>10260</td>
              <td>RiegoTech</td>
              <td>$890.000</td>
              <td>3 dias</td>
              <td>
                <span className="badge orange">3 Dias</span>
              </td>
            </tr>
            <tr>
              <td>10271</td>
              <td>Semillas del Sur</td>
              <td>$540.000</td>
              <td>5 dias</td>
              <td>
                <span className="badge blue">5 Dias</span>
              </td>
            </tr>
            <tr>
              <td>10198</td>
              <td>Fertilizantes Campo</td>
              <td>$2.100.000</td>
              <td>Pagada</td>
              <td>
                <span className="badge green">Pagada</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default Dashboard;
