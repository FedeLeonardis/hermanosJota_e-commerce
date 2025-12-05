import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
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

function FormProductoEdit({ onProductUpdated }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
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

  // Cargar datos del producto al montar el componente
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_CONFIG.ENDPOINTS.PRODUCTOS}/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        
        const producto = await response.json();
        
        setFormData({
          nombre: producto.nombre || "",
          descripcion: producto.descripcion || "",
          precio: producto.precio || "",
          stock: producto.stock || "",
          imagenUrl: producto.imagenUrl || "",
        });

        // Cargar features existentes
        if (producto.features) {
          setFeatures(producto.features);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        alert("Error al cargar el producto");
        navigate("/productos");
      }
    };

    fetchProduct();
  }, [id, navigate]);

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

    if (!token) {
      alert("Debes iniciar sesión para editar productos");
      navigate("/iniciar-sesion");
      return;
    }

    // Combinar datos básicos con features (solo las que tienen valor)
    const filteredFeatures = Object.fromEntries(
      Object.entries(features).filter(([, value]) => value.trim() !== "")
    );

    const productData = {
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      ...(Object.keys(filteredFeatures).length > 0 && {
        features: filteredFeatures,
      }),
    };

    try {
      const response = await fetch(`${API_CONFIG.ENDPOINTS.PRODUCTOS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar producto");
      }

      const updatedProduct = await response.json();
      alert(`Producto "${updatedProduct.nombre}" actualizado exitosamente`);
      
      if (onProductUpdated) {
        onProductUpdated();
      }

      // Navegar al detalle del producto actualizado
      navigate(`/productos/${id}`);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert(`Error al actualizar producto: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container-global">
        <div className="container">
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  // Features que aún no han sido seleccionadas
  const availableFeaturesToAdd = AVAILABLE_FEATURES.filter(
    (f) => !Object.prototype.hasOwnProperty.call(features, f.value)
  );

  return (
    <div className="container-global">
      <div className="container">
        <h1>Editar Producto</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre del producto:</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              placeholder="Ej: Sillón moderno"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              name="descripcion"
              id="descripcion"
              placeholder="Descripción breve del producto"
              rows="4"
              required
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio">Precio:</label>
            <input
              type="number"
              name="precio"
              id="precio"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              value={formData.precio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              name="stock"
              id="stock"
              placeholder="0"
              min="0"
              required
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagenUrl">URL de la imagen:</label>
            <input
              type="url"
              name="imagenUrl"
              id="imagenUrl"
              placeholder="https://ejemplo.com/imagen.jpg"
              required
              value={formData.imagenUrl}
              onChange={handleChange}
            />
          </div>

          {/* Sección de Features */}
          <div className="form-section">
            <h2>Características (Features)</h2>
            <p className="section-description">
              Agrega características opcionales para tu producto.
            </p>

            {/* Renderizar features existentes */}
            {Object.entries(features).map(([key, value]) => (
              <div key={key} className="form-group feature-group">
                <label htmlFor={`feature-${key}`}>
                  {AVAILABLE_FEATURES.find((f) => f.value === key)?.label ||
                    key}
                  :
                </label>
                <div className="feature-input-group">
                  <input
                    type="text"
                    id={`feature-${key}`}
                    value={value}
                    onChange={(e) => handleFeatureChange(key, e.target.value)}
                    placeholder={`Ingrese ${key}...`}
                  />
                  <button
                    type="button"
                    className="btn-remove-feature"
                    onClick={() => handleRemoveFeature(key)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Selector para agregar nueva feature */}
            {availableFeaturesToAdd.length > 0 && (
              <div className="add-feature-section">
                <select
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                  className="feature-select"
                >
                  <option value="">-- Agregar característica --</option>
                  {availableFeaturesToAdd.map((feature) => (
                    <option key={feature.value} value={feature.value}>
                      {feature.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="btn-add-feature"
                  disabled={!selectedFeature}
                >
                  + Agregar
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Actualizar Producto
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/productos/${id}`)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormProductoEdit;
