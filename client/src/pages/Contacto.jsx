import React, { useState } from "react";
import "../css/contacto.css";

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500)); // simula envío
      setEnviado(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-global">
      <div className="container">
        <h1>Contacto</h1>
        <p className="subtitle">
          Su duda no molesta, su consulta nos importa. Complete el formulario y
          nos pondremos en contacto a la brevedad.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre: </label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              placeholder="Ingrese su nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje: </label>
            <textarea
              name="mensaje"
              id="mensaje"
              placeholder="Mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className={`btn ${loading ? "loading" : ""}`}
            id="submitBtn"
            disabled={loading}
          >
            <span>Enviar Mensaje</span>
            <div className="loading"></div>
          </button>
        </form>
        <div
          className={`success-message ${enviado ? "show" : ""}`}
          id="successMessage"
        >
          <div className="success-icon">✓</div>
          <h3>¡Mensaje Enviado!</h3>
          <p>
            Gracias por contactarnos. Nos pondremos en contacto contigo pronto.
          </p>
        </div>
      </div>
    </div>
  );
}
export default Contacto;
