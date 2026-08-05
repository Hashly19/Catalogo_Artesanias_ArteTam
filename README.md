#  ArteTam - Catálogo Digital de Artesanías de Tamaulipas

¡Bienvenido a **ArteTam**! Este proyecto es un **catálogo interactivo web** diseñado para promover y exhibir artesanías regionales del estado de Tamaulipas, conectando a clientes, artesanos y administradores en una sola plataforma.

Este repositorio contiene una aplicación web frontend estructurada con **HTML5, CSS3 y JavaScript**, fácil de ejecutar sin necesidad de instalar servidores complejos ni dependencias pesadas.

---

## Tabla de Contenidos
- [ Características del Proyecto](#-características-del-proyecto)
- [ Estructura del Proyecto](#-estructura-del-proyecto)
- [ Requisitos Previos](#️-requisitos-previos)
- [ Guía de Instalación y Uso (Paso a Paso)](#-guía-de-instalación-y-uso-paso-a-paso)
  - [Opción 1: Descarga Directa (Para principiantes)](#opción-1-descarga-directa-para-principiantes)
  - [Opción 2: Clonar con Git](#opción-2-clonar-con-git)
- [ Cómo Ejecutar el Proyecto](#️-cómo-ejecutar-el-proyecto)
- [ Despliegue Gratis en GitHub Pages](#-despliegue-gratis-en-github-pages)
- [ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Contribución](#-contribución)

---

##  Características del Proyecto

-  **Inicio (`index.html`)**: Presentación principal y banner de bienvenida.
-  **Catálogo de Productos (`catalogo.html`)**: Visualización interactiva de artesanías locales.
- **Galería (`galeria.html`)**: Muestrario de imágenes y piezas destacadas.
-  **Nosotros (`nosotros.html`)**: Información sobre la visión del proyecto y el apoyo a los artesanos.
-  **Contacto (`contacto.html`)**: Formulario para atención e información.
-  **Inicio de Sesión (`login.html`)**: Módulo de acceso para usuarios.
-  **Panel Administrativo (`admin.html`)**: Vista de gestión general.
-  **Panel de Artesano/Vendedor (`seller.html`)**: Espacio adaptado para administradores del catálogo de productos.
-  **Diseño Adaptativo**: Estilos personalizados en `styles.css` compatibles con navegadores modernos.

---

##  Estructura del Proyecto

```text
Catalogo_Artesanias_ArteTam/
│
├── index.html       # Página principal
├── catalogo.html    # Sección de productos / artesanías
├── galeria.html     # Galería fotográfica
├── nosotros.html    # Sección sobre la plataforma y artesanos
├── contacto.html    # Formulario de contacto
├── login.html       # Interfaz de acceso
├── admin.html       # Panel de administración
├── seller.html      # Panel de artesano/vendedor
│
├── styles.css       # Hoja de estilos globales
├── script.js        # Lógica y funciones interactivas en JavaScript
└── data.js          # Base de datos local / datos simulados del catálogo
```

---

## 🛠️ Requisitos Previos

No necesitas conocimientos avanzados de programación ni instalar bases de datos para probar este proyecto. Únicamente necesitas:

1. Un **Navegador Web** moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).
2. Opcional (si deseas modificar el código): Un editor de texto como [Visual Studio Code](https://code.visualstudio.com/).
3. Opcional (si deseas usar comandos): Tener instalado [Git](https://git-scm.com/).

---

##  Guía de Instalación y Uso (Paso a Paso)

### Opción 1: Descarga Directa (Para principiantes)

Si no tienes experiencia con la consola o comandos de Git, sigue estos simples pasos:

1. Ve a la parte superior derecha de este repositorio en GitHub.
2. Haz clic en el botón verde que dice **`Code`**.
3. Selecciona la opción **`Download ZIP`**.
4. Una vez descargado el archivo `.zip` en tu computadora, descomprímelo (haz clic derecho sobre el archivo y selecciona *Extraer todo*).
5. Abre la carpeta resultante `Catalogo_Artesanias_ArteTam`.

---

### Opción 2: Clonar con Git

Si ya manejas Git en tu equipo:

1. Abre tu terminal o consola de comandos (CMD, PowerShell o Terminal de Git).
2. Ejecuta el siguiente comando:

```bash
git clone https://github.com/TU_USUARIO/Catalogo_Artesanias_ArteTam.git
```

3. Accede a la carpeta del proyecto:

```bash
cd Catalogo_Artesanias_ArteTam
```

---

##  Cómo Ejecutar el Proyecto

No se requiere instalar ninguna librería (`npm`, `node`, `python`, etc.). 

1. Entra a la carpeta descomprimida del proyecto.
2. Busca el archivo **`index.html`**.
3. Haz **doble clic** sobre `index.html`.
4. ¡Listo! Se abrirá automáticamente en tu navegador predeterminado y podrás navegar por todas las secciones del sitio.

> **Tip para desarrolladores:** Si usas **Visual Studio Code**, puedes instalar la extensión **Live Server** para abrir el proyecto en un servidor local interactivo haciendo clic derecho en `index.html` -> *Open with Live Server*.

---

##  Despliegue Gratis en GitHub Pages

Si quieres que tu catálogo esté en línea para que cualquier persona pueda visitarlo mediante un enlace, puedes activar **GitHub Pages**:

1. Sube este proyecto a un repositorio en tu cuenta de **GitHub**.
2. Ve a la pestaña **Settings** (Configuración) de tu repositorio.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En la sección **Build and deployment** -> **Branch**, selecciona `main` (o `master`) y la carpeta `/ (root)`.
5. Haz clic en **Save** (Guardar).
6. En un par de minutos, GitHub te proporcionará un enlace web público para navegar por **ArteTam**.

---

##  Tecnologías Utilizadas

- **HTML5**: Estructuración semántica de cada vista web.
- **CSS3**: Diseño, colores, maquetación y estilos responsivos.
- **JavaScript (ES6+)**: Manipulación del DOM, dinamismo e interacción.
- **Git & GitHub**: Control de versiones y alojamiento de código.

---

##  Contribución

¡Las contribuciones, sugerencias y mejoras son bienvenidas! Si deseas aportar al proyecto:

1. Realiza un *Fork* de este repositorio.
2. Crea una rama para tu mejora: `git checkout -b mi-nueva-caracteristica`
3. Guarda tus cambios: `git commit -m 'Añade nueva funcionalidad'`
4. Sube tu rama: `git push origin mi-nueva-caracteristica`
5. Abre un *Pull Request* explicándonos tus cambios.

---

 *Proyecto desarrollado para la preservación, difusión y comercialización del arte regional.*
