import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard"
import Facturas from "./pages/Facturas"
import Login from "./pages/Login"
import RegistrarFactura from "./pages/RegistrarFactura";

function RutaPrivada({ children}) {
   const token = localStorage.getItem("token");

   if(!token){
    return <Navigate to="/login" replace/>;
   }
   return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RutaPrivada>
            <Dashboard />
          </RutaPrivada>
        }
      />
      <Route
        path="/facturas"
        element={
          <RutaPrivada>
            <Facturas />
          </RutaPrivada>
        }
      />
      <Route
        path="/registrarfactura"
        element={
          <RutaPrivada>
            <RegistrarFactura />
          </RutaPrivada>
        }
      />
      <Route 
        path="/facturas/:id/editar"
        element={
          <RutaPrivada>
            <RegistrarFactura />
          </RutaPrivada>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
