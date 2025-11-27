import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/nuevo-producto.css";
import { API_CONFIG } from "../config/api.js";

// Lista de features disponibles según el modelo del backend
const AVAILABLE_FEATURES = [
  { value: "medidas", label: "Medidas" },
  { value: "materiales", label: "Materiales" },
  { value: "acabado", label: "Acabado" },
  { value: "peso", label: "Peso" },
  { value: "capacidad", label: "Capacidad" },
  { value: "modulares", label: "Modulares" },
  { value: "tapizado", label: "Tapizado" },
  { value: "confort", label: "Confort" },
  { value: "rotacion", label: "Rotación" },
  { value: "garantia", label: "Garantía" },
  { value: "almacenamiento", label: "Almacenamiento" },
  { value: "colchon", label: "Colchón" },
  { value: "sostenibilidad", label: "Sostenibilidad" },
  { value: "extension", label: "Extensión" },
  { value: "apilables", label: "Apilables" },
  { value: "incluye", label: "Incluye" },
  { value: "cables", label: "Cables" },
  { value: "certificación", label: "Certificación" },
  { value: "regulación", label: "Regulación" },
  { value: "caracteristica", label: "Característica" },
];

function FormProductoNuevo({ onProductCreated }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagenUrl: "",
  });

  // Estado para las features seleccionadas
  const [features, setFeatures] = useState({});
  // Estado para el selector de nueva feature
  const [selectedFeature, setSelectedFeature] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Manejar cambio en el valor de una feature
  const handleFeatureChange = (featureName, value) => {
    setFeatures((prev) => ({
      ...prev,
      [featureName]: value,
    }));
  };

  // Agregar una nueva feature
  const handleAddFeature = () => {
    if (selectedFeature && !features[selectedFeature]) {
      setFeatures((prev) => ({
        ...prev,
        [selectedFeature]: "",
      }));
      setSelectedFeature("");
    }
  };

  // Eliminar una feature
  const handleRemoveFeature = (featureName) => {
    setFeatures((prev) => {
      const updated = { ...prev };
      delete updated[featureName];
      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Combinar datos básicos con features (solo las que tienen valor)
    const filteredFeatures = Object.fromEntries(
      Object.entries(features).filter(([, value]) => value.trim() !== "")
    );

    const productData = {
      ...formData,
      ...(Object.keys(filteredFeatures).length > 0 && {
        features: filteredFeatures,
      }),
    };

    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.PRODUCTOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al crear el producto");
      }

      const data = await response.json();
      console.log("Producto creado:", data);

      // Limpiar formulario
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
      });
      setFeatures({});

      // Refrescar la lista de productos en el componente padre
      if (onProductCreated) {
        onProductCreated();
      }

      // Navegar al catálogo o a la página del producto creado
      if (data.producto && data.producto._id) {
        // Opción 1: Ir a la página del producto recién creado
        navigate(`/productos/${data.producto._id}`);
      } else {
        // Opción 2: Ir al catálogo
        navigate("/productos");
      }
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
              <label htmlFor="imagen">Imagen URL:</label>
              <input
                type="text"
                name="imagenUrl"
                id="imagen"
                placeholder="URL de la imagen"
                value={formData.imagenUrl}
                onChange={handleChange}
                required
              />
            </div>

            {/* Sección de Features (Opcional) */}
            <div className="features-section">
              <h3>Features (Opcional)</h3>

              {/* Selector para agregar nueva feature */}
              <div className="add-feature">
                <select
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                  className="feature-select"
                >
                  <option value="">Seleccionar feature...</option>
                  {AVAILABLE_FEATURES.filter(
                    (feature) => !features[feature.value]
                  ).map((feature) => (
                    <option key={feature.value} value={feature.value}>
                      {feature.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  disabled={!selectedFeature}
                  className="btn-add-feature"
                >
                  + Agregar
                </button>
              </div>

              {/* Lista de features agregadas */}
              <div className="features-list">
                {Object.keys(features).map((featureName) => {
                  const featureLabel =
                    AVAILABLE_FEATURES.find((f) => f.value === featureName)
                      ?.label || featureName;

                  return (
                    <div key={featureName} className="feature-item">
                      <label htmlFor={`feature-${featureName}`}>
                        {featureLabel}:
                      </label>
                      <div className="feature-input-group">
                        <input
                          type="text"
                          id={`feature-${featureName}`}
                          value={features[featureName]}
                          onChange={(e) =>
                            handleFeatureChange(featureName, e.target.value)
                          }
                          placeholder={`Ingresar ${featureLabel.toLowerCase()}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(featureName)}
                          className="btn-remove-feature"
                          title="Eliminar feature"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit">Crear Producto</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default FormProductoNuevo;
