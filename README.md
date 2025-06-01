# Sistema de Gestión de Empleados - Taller Node.js S.A. de C.V.

## Descripción del Proyecto

Este proyecto es un sistema de gestión de empleados desarrollado para el departamento de recursos humanos de la empresa "Taller de Node.js S.A. de C.V.". El objetivo principal es reemplazar el almacenamiento de datos de empleados en un documento de Excel por un sistema web seguro y robusto que permita la administración (altas, bajas, consultas y cambios) de los empleados únicamente a usuarios autorizados.

El sistema cuenta con un backend desarrollado en Node.js con Express.js y una base de datos MySQL, utilizando Sequelize como ORM. La autenticación de usuarios se maneja mediante JSON Web Tokens (JWT). El frontend es una aplicación de una sola página (SPA) construida con HTML, CSS y JavaScript puro (Vanilla JS), permitiendo una interfaz de usuario interactiva para las operaciones CRUD de empleados y la gestión de sesiones de administrador.

## Características Principales

* **Autenticación Segura:** Sistema de inicio de sesión para usuarios administradores utilizando JWT.
* **Gestión de Administradores:** Los usuarios administradores se dan de alta directamente en la base de datos a través de un script seguro.
* **Módulo de Empleados (CRUD):**
    * **Altas:** Agregar nuevos empleados a la base de datos.
    * **Consultas:** Ver la lista de todos los empleados y buscar empleados por nombre.
    * **Cambios:** Modificar los datos de empleados existentes.
    * **Bajas:** Eliminar empleados de la base de datos.
* **Acceso Restringido:** Únicamente los usuarios autenticados (administradores) tienen acceso a la información y funcionalidades de gestión de empleados.
* **Interfaz de Usuario Intuitiva:** Un frontend simple y funcional para facilitar la administración de empleados.

## Tecnologías Utilizadas

### Backend
* Node.js
* Express.js (Framework web)
* Sequelize (ORM para Node.js - MySQL)
* MySQL (Base de datos relacional)
* JSON Web Tokens (JWT) (Para autenticación)
* bcryptjs (Para el hashing de contraseñas)
* `cors` (Para habilitar Cross-Origin Resource Sharing)
* `dotenv` (Para manejo de variables de entorno)

### Frontend
* HTML5
* CSS3
* JavaScript (Vanilla JS - ECMAScript 6+)
* Fetch API (Para comunicación con el backend)

### Herramientas de Desarrollo
* Nodemon (Para reinicio automático del servidor backend durante el desarrollo)
* Postman (Para pruebas de API backend)

## Prerrequisitos

* Node.js (v16 o superior recomendado)
* npm (usualmente viene con Node.js)
* Un servidor MySQL instalado y corriendo.
* Git (para clonar el repositorio)

## Instalación y Configuración Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

1.  **Clonar el Repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_CARPETA_DEL_PROYECTO>
    ```

2.  **Configurar el Backend:**
    * Navega a la carpeta raíz del backend (donde se encuentra `app.js`).
    * Instala las dependencias:
        ```bash
        npm install
        ```
    * **Base de Datos:**
        * Asegúrate de que tu servidor MySQL esté en funcionamiento.
        * Crea una base de datos en MySQL para el proyecto (por ejemplo, `taller_node_db`).
        * Configura la conexión a la base de datos en el archivo `config/database.js` con tus credenciales de MySQL (host, usuario, contraseña, nombre de la base de datos).
    * **Variables de Entorno:**
        * Crea un archivo `.env` en la raíz de la carpeta del backend.
        * Añade las siguientes variables (ajusta los valores según sea necesario):
            ```env
            PORT=3000
            JWT_SECRET=TU_SECRETO_SUPER_SECRETO_Y_LARGO_AQUI
            # Si decidiste usar variables de entorno para la BD, añádelas aquí también:
            # DB_HOST=localhost
            # DB_USER=tu_usuario_mysql
            # DB_PASSWORD=tu_contraseña_mysql
            # DB_NAME=taller_node_db
            # DB_DIALECT=mysql
            ```
            **Importante:** `JWT_SECRET` debe ser una cadena larga, aleatoria y secreta.
    * **Sincronización de la Base de Datos:**
        Al iniciar el servidor backend por primera vez, Sequelize intentará crear las tablas (`usuarios`, `empleados`) en la base de datos si no existen, basado en los modelos definidos.

3.  **Configurar el Frontend:**
    * El frontend (ubicado en la carpeta `frontend/`) no requiere un proceso de instalación de dependencias complejo ya que usa Vanilla JS.
    * Asegúrate de que la constante `API_URL` en los archivos `frontend/js/auth.js` y `frontend/js/app.js` apunte a la URL correcta de tu backend local. Por defecto, si el backend corre en el puerto 3000, debería ser:
        ```javascript
        const API_URL = 'http://localhost:3000/api';
        ```

## Creación de Usuario Administrador

Para poder iniciar sesión y probar el sistema, necesitas crear al menos un usuario administrador. Esto se hace mediante un script en el backend:

1.  **Verifica la Configuración del Backend:** Asegúrate de que el backend esté correctamente configurado para conectarse a tu base de datos MySQL (paso 2 de "Instalación y Configuración Local").
2.  **Navega a la Carpeta Raíz del Backend:** Desde tu terminal, ubícate en la carpeta donde se encuentra `app.js` y el script `crearAdmin.js`.
3.  **Ejecuta el Script:**
    ```bash
    node crearAdmin.js
    ```
4.  **Sigue las Instrucciones:** El script te solicitará:
    * El correo electrónico para el nuevo administrador (este será su nombre de usuario para el login).
    * Una contraseña para el nuevo administrador.
5.  **Confirmación:** Si el proceso es exitoso, verás un mensaje confirmando la creación del usuario.

Ahora puedes usar estas credenciales para iniciar sesión en la aplicación.

## Ejecución del Proyecto Localmente

1.  **Iniciar el Servidor Backend:**
    * Navega a la carpeta raíz del backend.
    * Ejecuta:
        ```bash
        npm run dev
        ```
        Esto iniciará el servidor backend (usualmente en `http://localhost:3000`). `nodemon` reiniciará el servidor automáticamente si detecta cambios en los archivos.

2.  **Abrir el Frontend:**
    * Navega a la carpeta `frontend/`.
    * Abre el archivo `index.html` en tu navegador web.
    * **Recomendación:** Para una mejor experiencia y evitar posibles problemas de CORS (si el backend no estuviera configurado para `origin 'null'`), considera usar una extensión como "Live Server" en VS Code para servir los archivos del frontend.

Una vez que el backend esté corriendo y el frontend abierto, deberías poder interactuar con la página de inicio de sesión.

