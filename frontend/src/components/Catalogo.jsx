import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "../css/reset.css";
import "../css/productos.css";
import "../css/variables.css";
import "../css/global.css";
import "../css/index.css";

function Catalogo() {
  const [productos, setProductos] = useState([]); // estado para guardar productos
  const url = "http://localhost:5000/api/productos";

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos desde backend:", data);
        setProductos(data); // guardamos los productos en el state
      })
      .catch((err) => console.error("Error al traer productos:", err));
  }, []);

  return (
    <>
      <h1>NUESTROS PRODUCTOS</h1>
      <div className="catalogo grid-container">
        {productos.map((producto) => (
          <ProductCard
            className="card-producto link-producto btn-detalles"
            key={producto.id}
            producto={producto}
          />
        ))}
      </div>
    </>
  );
}

export default Catalogo;

// import ProductCard from "./ProductCard";
// // import { productos } from "../data.js";
// import "../css/reset.css";
// import "../css/productos.css";
// import "../css/variables.css";
// import "../css/global.css";
// import "../css/index.css";
// // import productos from "../../../backend/data/productos";

// function Catalogo() {
//   const url = "http://localhost:5000";
//   const res = fetch(url + "/api/productos", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   res.json(productos);
//   return (
//     <>
//       <h1>NUESTROS PRODUCTOS</h1>
//       <div className="catalogo grid-container">
//         {productos.map((producto) => (
//           <ProductCard
//             className="card-producto link-producto.btn-detalles"
//             key={producto.id}
//             producto={producto}
//           />
//         ))}
//       </div>
//     </>
//   );
// }

// export default Catalogo;
