import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage("Inicio de sesión exitoso");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="main flex h-full bg-[#1a1d2e]">
      <div className="flex min-h-full w-full md:w-1/2 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <div className="w-80">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-white">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-normal text-gray-300 mb-2 correo"
              >
                Correo Electronico
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="login-input"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-normal text-gray-300 mb-2 contraseña"
                >
                  Contraseña
                </label>
              </div>
              <div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  className="login-input"
                />
              </div>
            </div>

{/*Boton de iniciar sesion*/}
            <div className="login-button-p">
              <button
                type="submit"
                className="login-button"
              >
                Entrar
              </button>
            </div>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center text-gray-300">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#5b5fc7] hover:text-[#6d71d3]"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>

      {/* Aside - Imagen a la derecha (oculta en móvil) */}
      <div className="flex w-1/2 items-center justify-center overflow-hidden hidden-mobile">
        <img
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt="Compay Image"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;