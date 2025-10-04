import ProductCard from "./ProductCard";
// import { productos } from "../data.js";
import "../css/reset.css";
import "../css/productos.css";
import "../css/variables.css";
import "../css/global.css";
import "../css/index.css";

function Catalogo() {
  const url = "http://localhost:5000";
  const res = fetch(url + "/api/productos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <>
      <h1>NUESTROS PRODUCTOS</h1>
      <div className="catalogo grid-container">
        {productos.map((producto) => (
          <ProductCard
            className="card-producto link-producto.btn-detalles"
            key={producto.id}
            producto={producto}
          />
        ))}
      </div>
    </>
  );
}

export default Catalogo;
