# 🏢 Unity - Sistema de Gestión de Consorcios

**Unity** es una aplicación web Full Stack diseñada para digitalizar, agilizar y transparentar la comunicación y administración de consorcios de edificios. Permite conectar de manera fluida a los residentes (inquilinos/propietarios) con el equipo de administración del consorcio.

---

## 🚀 Características Principales


## 🔑 Credenciales de Prueba (Demo)
Si estás corriendo el proyecto de forma local, podés ingresar rápidamente utilizando los siguientes usuarios de prueba:

| Rol | Usuario (Email) | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@unity.com` | `password123` |
| **Residente** | `residente@unity.com` | `password123` |

### 👤 Panel del Residente
* **Cartelera Informativa:** Visualización ágil de anuncios y comunicados importantes del edificio.
* **Mis Expensas:** Control del estado de cuenta de expensas (pagas, pendientes) y simulación del pago de las mismas con feedback inmediato.
* **Mis Reclamos:** Sistema para reportar problemas de infraestructura con carga de estados del ticket en tiempo real.
* **Reservas SUM / Parrilla:** Agenda interactiva para reservar espacios comunes evitando superposiciones de horarios.

### 💼 Panel de Administración
* **Gestión de Residentes:** Panel de control para revisar, aprobar o rechazar solicitudes de nuevos usuarios con códigos de acceso.
* **Control de Expensas:** Carga de gastos comunes, liquidación de expensas mensuales y seguimiento detallado de cobros.
* **Reclamos del Edificio:** Gestión centralizada de reclamos edilicios reportados por los vecinos para asignación de prioridades y técnicos.
* **Publicar Anuncios:** Creación de comunicados y notificaciones que impactan de manera inmediata en la cartelera de los residentes.

---

## 🛠️ Tecnologías Utilizadas

### Frontend (React)
* **React.js** (Vite)
* **Tailwind CSS** (Interfaz limpia, moderna y completamente responsiva)
* **Axios** (Cliente HTTP con interceptores globales para inyección dinámica de Tokens JWT y manejo centralizado de errores)
* **Lucide React** (Paquete de iconos vectoriales modernos)
* **React Hot Toast** (Alertas y notificaciones interactivas para el usuario)

### Backend (Spring Boot)
* **Java 17** & **Spring Boot**
* **Spring Security & JWT (JSON Web Tokens):** Arquitectura robusta de autenticación y autorización basada en roles (`RESIDENT`, `BUILDING_ADMIN`).
* **Spring Data JPA:** Capa de abstracción para la base de datos relacional.
* **PostgreSQL:** Motor de base de datos robusto para producción.
* **Maven:** Gestor de dependencias del proyecto.

---

## 📂 Estructura del Repositorio

El proyecto se encuentra organizado en una arquitectura monorepo limpia:
* `unity-frontend/`: Aplicación cliente desarrollada en React.
* `unity-backend/`: API REST desarrollada en Spring Boot.

---

## ⚙️ Configuración del Entorno de Desarrollo

### Requisitos Previos
* **Node.js** (versión 18 o superior)
* **Java JDK 17**
* **PostgreSQL** instalado y corriendo localmente

### 1. Levantar el Backend (Spring Boot)
1. Abrir la carpeta `unity-backend` en tu IDE preferido (IntelliJ, Eclipse, VS Code).
2. Configurar las credenciales de tu base de datos en el archivo `src/main/resources/application.properties`.
3. Ejecutar la clase principal de la aplicación. El backend correrá por defecto en `http://localhost:8080`.

### 2. Levantar el Frontend (React)
1. Abrir una terminal en la carpeta `unity-frontend`.
2. Crear un archivo `.env` en la raíz del frontend con la siguiente variable (opcional, por defecto apunta a localhost):
   ```env
   VITE_API_URL=http://localhost:8080/api
