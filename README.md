# 🍎 Mercado Frutas App

Sistema de gestión integral para mercados frutícolas. Permite el control de stock, registro de ventas diarias y administración de pagos a proveedores. Desarrollado como PWA para funcionar tanto en dispositivos móviles como en escritorio.

> **Estado:** En desarrollo activo — uso real en producción previsto para Mayo 2025

---

## 📋 Descripción

Aplicación fullstack de uso real construida para un mercado de frutas en Buenos Aires. Resuelve tres necesidades concretas del negocio:

- **Control de stock** — inventario en tiempo real por fruta y temporada, con alertas de stock bajo
- **Ventas diarias** — registro rápido con distinción mayorista/minorista y resumen del día
- **Proveedores y pagos** — historial de compras, saldo pendiente calculado automáticamente y registro de pagos

---

## 🛠️ Stack tecnológico

### Backend
- **C# / .NET 8** — Web API REST
- **Entity Framework Core 8** — ORM y migraciones
- **PostgreSQL** — Base de datos relacional
- **JWT + BCrypt** — Autenticación y hash de contraseñas
- **FluentValidation** — Validación de inputs
- **AspNetCoreRateLimit** — Rate limiting y protección contra fuerza bruta

### Frontend
- **React 19 + TypeScript** — Framework de UI con tipado estático
- **Tailwind CSS v4** — Estilos utilitarios mobile-first
- **Vite** — Bundler y servidor de desarrollo
- **Zustand** — Estado global con persistencia (token JWT y sesión)
- **TanStack Query** — Caché y manejo de solicitudes HTTP
- **React Router** — Navegación entre páginas
- **Fetch API nativa** — Cliente HTTP sin dependencias externas

---

## 🔒 Seguridad implementada

| Medida | Descripción |
|--------|-------------|
| **JWT con expiración** | Tokens con vida útil de 8hs, firmados con HMAC SHA256 |
| **BCrypt** | Contraseñas hasheadas con salt, nunca en texto plano |
| **Rate limiting** | Máximo 5 intentos de login por minuto por IP (429 Too Many Requests) |
| **FluentValidation** | Validación estricta de todos los inputs antes de procesar |
| **Roles y autorización** | Endpoints protegidos por rol (admin/empleado) |
| **CORS configurado** | Solo acepta solicitudes del origen autorizado |
| **Logs de auditoría** | Registro de todas las operaciones críticas con usuario, IP y timestamp |

---

## 🏗️ Arquitectura

```
mercado-frutas/
├── MercadoFrutas.API/        # Backend .NET 8
│   ├── Controllers/          # Endpoints HTTP
│   ├── Models/               # Entidades de base de datos
│   ├── DTOs/                 # Objetos de transferencia de datos
│   ├── Validators/           # Validaciones con FluentValidation
│   ├── Services/             # Lógica de negocio (auditoría)
│   └── Data/                 # DbContext y migraciones
└── frontend/                 # React + TypeScript
    └── src/
        ├── api/              # Funciones de comunicación con el backend
        ├── components/       # Componentes reutilizables (Layout)
        ├── pages/            # Dashboard, Stock, Ventas, Proveedores, Login
        ├── store/            # Estado global con Zustand
        └── types/            # Interfaces TypeScript
```

---

## 📦 Instalación y configuración

### Requisitos previos
- .NET 8 SDK
- Node.js 20+
- pnpm
- PostgreSQL 17

### Backend

```bash
git clone https://github.com/tu-usuario/mercado-frutas.git
cd mercado-frutas/MercadoFrutas.API

# Crear appsettings.Development.json con tus credenciales
# (ver appsettings.json como referencia de estructura)

# Crear la base de datos y aplicar migraciones
dotnet ef database update

# Ejecutar el servidor
dotnet run
```

El backend corre en `http://localhost:5273`
Swagger disponible en `http://localhost:5273/swagger`

### Frontend

```bash
cd ../frontend
pnpm install
pnpm dev
```

El frontend corre en `http://localhost:5173`

---

## 🔐 Autenticación y roles

El sistema usa JWT con dos roles:

| Rol | Permisos |
|-----|----------|
| `admin` | Acceso total — proveedores, ingresos de stock, pagos, ventas |
| `empleado` | Consulta de stock y registro de ventas |

Para crear el primer usuario administrador usar `POST /api/auth/registro` desde Swagger.

---

## 📡 Endpoints principales

### Auth (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/registro` | Crear usuario |
| POST | `/api/auth/login` | Iniciar sesión → devuelve JWT |

### Frutas (autenticado)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/frutas` | Listar todas con stock actual |
| POST | `/api/frutas` | Crear fruta |
| PUT | `/api/frutas/{id}` | Actualizar / cambiar temporada |

### Ventas (autenticado)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/ventas/hoy` | Resumen del día con total |
| POST | `/api/ventas` | Registrar venta — reduce stock automáticamente |

### Proveedores (solo admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/proveedores` | Lista con saldo pendiente calculado |
| POST | `/api/ingresosstock` | Registrar ingreso — aumenta stock automáticamente |
| POST | `/api/pagosproveedores` | Registrar pago — valida que no supere el saldo |

---

## ✨ Funcionalidades destacadas

- **Stock en tiempo real** — se actualiza automáticamente con cada ingreso y venta
- **Saldo pendiente dinámico** — calculado en la consulta, sin datos duplicados
- **Validación de stock** — no permite vender más de lo disponible
- **Validación de pagos** — no permite pagar más del saldo pendiente
- **Protección contra fuerza bruta** — rate limiting en el endpoint de login
- **Trazabilidad completa** — logs de auditoría con usuario, acción e IP
- **PWA** — instalable en celular y escritorio
- **Roles diferenciados** — empleados y administradores con acceso separado

---

## 🗃️ Modelo de datos

```
Fruta ──────────────── IngresoStock ──── Proveedor
  │                                          │
  └──────────────── Venta        PagoProveedor ─┘

AuditoriaLog (registro independiente de todas las operaciones)
Usuario (auth independiente)
```

---

## 👤 Autor

**Ivan Pugliese** — Desarrollador Fullstack  
[GitHub](https://github.com/tu-usuario) · [LinkedIn](https://linkedin.com/in/tu-usuario) · [Portfolio](https://porfolio-alpha-liart.vercel.app)

---

## 📄 Licencia

Este proyecto fue desarrollado para uso comercial privado.