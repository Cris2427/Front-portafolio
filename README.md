# Sistema de Gestión de Facturas — Agrícola El Capricho SPA (Frontend)

Aplicación web (SPA) para la gestión de facturas de **Agrícola El Capricho SPA**.
Permite registrar, listar, editar y eliminar facturas, adjuntar documentos PDF,
gestionar una papelera con restauración y consultar el historial de cambios de
estado de cada factura.

Este repositorio contiene **solo el frontend**. Consume una API REST construida
con Spring Boot (proyecto `proyecto-titulo-`) que corre por defecto en
`http://localhost:8081`.

---

## 🛠️ Tecnologías

| Herramienta | Uso |
|---|---|
| [React 19](https://react.dev/) | Librería de interfaz |
| [Vite 8](https://vite.dev/) | Bundler y servidor de desarrollo |
| [React Router 7](https://reactrouter.com/) | Enrutamiento (SPA) |
| [Axios](https://axios-http.com/) | Cliente HTTP (con interceptor de JWT) |
| ESLint | Análisis estático de código |

---

## 📋 Requisitos previos

1. **Node.js 18+** y npm.
2. El **backend** (`proyecto-titulo-`) corriendo en `http://localhost:8081`.
3. **PostgreSQL** activo con la base `agricola_db` (según la configuración del backend).

> El backend acepta peticiones por CORS desde `http://localhost:5173` y
> `http://localhost:5174` (los puertos por defecto de Vite).

---

## 🚀 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/Cris2427/Front-portafolio.git
cd front-portafolio

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

La app queda disponible en **http://localhost:5173**.

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente (HMR) |
| `npm run build` | Compila la versión optimizada de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

---

## 🔐 Autenticación

La API protege todos los endpoints con **JWT**, excepto `/user/login`. El flujo es:

1. El usuario inicia sesión en `/login` (`POST /user/login`).
2. El token se guarda en `localStorage` junto con los datos del usuario.
3. El cliente Axios (`src/api/api.js`) tiene un **interceptor** que adjunta
   automáticamente el header `Authorization: Bearer <token>` en cada petición.

### Usuario inicial y registro

El registro público está **cerrado**: solo un usuario con rol **ADMIN** puede crear
cuentas (desde la pantalla de Usuarios o `POST /admin/usuarios`).

El backend crea automáticamente un **usuario ADMIN inicial** en la primera ejecución,
con el que se puede iniciar sesión y dar de alta al resto. Sus credenciales están
definidas en el backend (`DataInitializer`) y deben cambiarse en un entorno real.

### Roles

| Rol | Permisos |
|---|---|
| `ROLE_ADMIN` | Todo + gestión de usuarios (crear, activar, desactivar, eliminar) |
| `ROLE_ADMINISTRADOR` | Crear, editar y eliminar facturas; papelera, restaurar y proveedores |
| `ROLE_EJECUTIVO` | Solo lectura: ver facturas, buscar, historial y documentos |

---

## ✨ Funcionalidades

- **Login** con manejo de errores y estado de carga.
- **Dashboard** con métricas (total, pendientes, pagadas, vencen hoy) y alertas.
- **Listado de facturas** con búsqueda por folio, **filtro por proveedor** y badge
  de estado (`PENDIENTE` / `PROGRAMADA` / `PAGADA`).
- **Semáforo de vencimiento** (rojo / amarillo / verde) según los días que faltan.
- **Registrar / editar factura** con el mismo formulario.
- **Eliminar factura** (borrado lógico) con modal de confirmación — ADMINISTRADOR / ADMIN.
- **Papelera**: ver eliminadas y **restaurarlas** — ADMINISTRADOR / ADMIN.
- **Historial de estados** de cada factura (en modal).
- **Documentos PDF**: subir (multipart) y ver el documento adjunto.
- **Gestión de usuarios** (solo ADMIN): crear, activar, desactivar y eliminar.
- **Permisos por rol** reflejados en el menú y los botones.
- **Diseño responsivo** con menú lateral desplegable en móvil.

---

## 🗺️ Rutas de la aplicación

| Ruta | Vista | Acceso |
|---|---|---|
| `/login` | Inicio de sesión | Pública |
| `/` | Dashboard | Autenticado |
| `/facturas` | Listado de facturas | Autenticado |
| `/registrarfactura` | Registrar factura | ADMINISTRADOR / ADMIN |
| `/facturas/:id/editar` | Editar factura | ADMINISTRADOR / ADMIN |
| `/papelera` | Papelera de facturas | ADMINISTRADOR / ADMIN |
| `/usuarios` | Gestión de usuarios | Solo ADMIN |

> El historial de estados se muestra en un **modal** dentro de la pantalla de
> Facturas (no es una ruta aparte).

---

## 📁 Estructura del proyecto

```
src/
├── api/
│   └── api.js            # Instancia de Axios + interceptor de JWT
├── components/
│   └── Layout.jsx        # Sidebar + topbar (estructura común)
├── pages/
│   ├── Login.jsx         # Inicio de sesión
│   ├── Dashboard.jsx     # Métricas y alertas
│   ├── Facturas.jsx      # Listado + acciones (editar, eliminar, PDF, historial, filtro)
│   ├── RegistrarFactura.jsx  # Formulario de crear / editar
│   ├── Papelera.jsx      # Facturas eliminadas + restaurar
│   └── GestionUsuarios.jsx   # Gestión de usuarios (solo ADMIN)
├── App.jsx               # Definición de rutas y rutas privadas
├── main.jsx              # Punto de entrada
└── style.css             # Estilos globales
```

---

## 🔗 API consumida (facturas)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/facturas` | Listar facturas activas |
| `GET` | `/facturas/:id` | Obtener una factura |
| `POST` | `/facturas` | Crear factura |
| `PUT` | `/facturas/:id` | Actualizar factura |
| `DELETE` | `/facturas/:id` | Eliminar (lógico) — solo admin |
| `GET` | `/facturas/papelera` | Listar eliminadas — solo admin |
| `PUT` | `/facturas/:id/restaurar` | Restaurar — solo admin |
| `GET` | `/facturas/:id/historial` | Historial de estados |
| `POST` | `/facturas/:id/documento` | Subir PDF (campo `archivo`) |
| `GET` | `/facturas/:id/documento` | Ver PDF |

## 🔗 API consumida (usuarios — solo ADMIN)

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/admin/usuarios` | Listar usuarios |
| `POST` | `/admin/usuarios` | Crear usuario |
| `DELETE` | `/admin/usuarios/:id` | Desactivar usuario |
| `PUT` | `/admin/usuarios/:id/activar` | Reactivar usuario |
| `DELETE` | `/admin/usuarios/:id/definitivo` | Eliminar definitivamente |


## Equipo

Proyecto de título desarrollado en equipo.
Integrantes: Camila Malhue, Yesenia Jara y Cristian Tapia