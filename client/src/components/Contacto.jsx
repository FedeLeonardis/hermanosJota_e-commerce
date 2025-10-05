import { useState } from "react";
import "../css/contacto.css"; 

/**
 * Formulario de contacto controlado con validaciones básicas en cliente.
 * Maneja estados de loading y éxito para simular el envío de un mensaje.
 */
export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errors, setErrors] = useState({ nombre: false, email: false, mensaje: false });
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Reglas de validación reutilizadas para cada campo.
  const validators = {
    nombre: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    mensaje: (v) => v.trim().length >= 10,
  };

  // Valida un único campo y sincroniza el estado de errores.
  const validateField = (field, value) => {
    const valid = validators[field](value);
    setErrors((prev) => ({ ...prev, [field]: !valid }));
    return valid;
  };

  // Ejecuta la validación completa previo al envío del formulario.
  const validateAll = () => {
    const res = {
      nombre: !validators.nombre(nombre),
      email: !validators.email(email),
      mensaje: !validators.mensaje(mensaje),
    };
    setErrors(res);
    return !res.nombre && !res.email && !res.mensaje;
  };

  // Simula el submit hacia un backend respetando la UX de loading y éxito.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500)); // simula envío
      setEnviado(true);
      setNombre("");
      setEmail("");
      setMensaje("");
      setErrors({ nombre: false, email: false, mensaje: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-global">
      <div className="container">
        <h1>Contacto</h1>
        <p className="subtitle">
          Nuestros clientes suelen tener preguntas. Necesitamos un formulario simple para que nos dejen sus dudas.
        </p>

        <div className={`form-container ${enviado ? "hidden" : ""}`} id="formContainer">
          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ingresa tu nombre completo"
                className={errors.nombre ? "input-error" : ""}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errors.nombre) validateField("nombre", e.target.value);
                }}
                onBlur={(e) => validateField("nombre", e.target.value)}
                required
              />
              <div className={`error ${errors.nombre ? "show" : ""}`} id="nombreError">
                Por favor, ingresa tu nombre
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@correo.com"
                className={errors.email ? "input-error" : ""}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) validateField("email", e.target.value);
                }}
                onBlur={(e) => validateField("email", e.target.value)}
                required
              />
              <div className={`error ${errors.email ? "show" : ""}`} id="emailError">
                Por favor, ingresa un email válido
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Mensaje *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                placeholder="Escribe tu mensaje aquí..."
                className={errors.mensaje ? "input-error" : ""}
                value={mensaje}
                onChange={(e) => {
                  setMensaje(e.target.value);
                  if (errors.mensaje) validateField("mensaje", e.target.value);
                }}
                onBlur={(e) => validateField("mensaje", e.target.value)}
                required
              />
              <div className={`error ${errors.mensaje ? "show" : ""}`} id="mensajeError">
                Por favor, ingresa tu mensaje
              </div>
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
        </div>

        <div className={`success-message ${enviado ? "show" : ""}`} id="successMessage">
          <div className="success-icon">✓</div>
          <h3>¡Mensaje Enviado!</h3>
          <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
        </div>
      </div>
    </div>
  );
}