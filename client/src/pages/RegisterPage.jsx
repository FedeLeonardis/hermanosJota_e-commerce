import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../config/api.js";
import "../css/nuevo-producto.css";
function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      alert(`Registro exitoso para ${data.username}`);
      navigate("/iniciar-sesion");
    } catch (error) {
      alert(`Error en el registro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container-global">
        <div className="container">
          <h1>Registrarse</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario:</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Ingrese su nombre de usuario"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Ingrese su correo electronico"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Ingrese su contraseña"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className={`btn ${loading ? "loading" : ""}`}
              id="submitBtn"
              disabled={loading}
            >
              <span>Registrarme</span>
              <div className="loading"></div>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default RegisterPage;
