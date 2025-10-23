# To-Do App – Frontend

Interfaz web desarrollada con React + Vite + Tailwind CSS, conectada a un backend en Node.js y MySQL.  
Permite a los usuarios registrar, visualizar, editar y completar tareas en tiempo real.


# Instrucciones de instalación (local)

1. Clonar este repositorio o descargarlo como ZIP.  
2. Instalar dependencias:
   ```bash
   npm install
   
3. En el archivo src/services/api.js, asegúrate que la base URL apunte a nuestro backend local o en la nube tienes que ver algo como esto:
const API = axios.create({
  baseURL: "http://localhost:3000/api",
});


4. Luego en la consola escribe esto:

   ```bash
   npm run dev

Luego abre en el navegador este link:
http://localhost:5173

Si necesitas un usuario de prueba es el siguiente:
Email: UserPrueba@gmail.com
Contraseña: 12345

Pero puedes crear el tuyo sin ningun problema en la seccion de *register* para que puedas ingresar tus propias Tareas

# Dependencias principales

react

react-dom

react-router-dom

axios

tailwindcss

sweetalert2

react-toastify

react-icons
