import React, { useState } from "react";
import "../css/nuevo-producto.css";
function FormProductoNuevo() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagenUrl: "",
  });
  //   const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response) {
        throw new Error("Error al crear el producto");
      }

      const data = await response.json();
      console.log("Producto creado:", data);

      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar el producto");
    }
  };
  return (
    <>
      <div className="container-global">
        <div className="container">
          <h1>Agregar Producto</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripcion:</label>
              <input
                type="text"
                name="descripcion"
                id="descripcion"
                placeholder="Descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="precio">Precio:</label>
              <input
                type="text"
                name="precio"
                id="precip"
                placeholder="Precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock:</label>
              <input
                type="text"
                name="stock"
                id="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="imagen"></label>
              <input
                type="text"
                name="imagenUrl"
                id="imagen"
                placeholder="IMagebn"
                value={formData.imagenUrl}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">enviar</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default FormProductoNuevo;
