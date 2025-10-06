import "../css/footer.css";
import "../css/reset.css";
import "../css/variables.css";
import "../css/global.css";
import "../css/index.css";

// Pie de página con información de contacto y horarios del showroom.
const Footer = () => {
  return (
    <footer className="env-footer">
      <div className="showroom-taller">
        <h3 className="destacado">Showroom y Taller 🛠️</h3>
        <p className="sub">Hermanos Jota — Casa Taller</p>
        <p className="datos">
          Av. San Juan 2847 <br />
          C1232AAB — Barrio de San Cristóbal <br />
          Ciudad Autónoma de Buenos Aires, Argentina
        </p>

        <br />

        <p className="sub">Horarios:</p>
        <p className="datos">
          Lunes a Viernes: 10:00 - 19:00 <br />
          Sábados: 10:00 - 14:00
        </p>
      </div>

      <div className="contacto-digital">
        <h3 className="destacado">Contacto Digital 📱</h3>

        <a
          className="link-web"
          href="index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sitio Web: www.hermanosjota.com.ar
        </a>

        <p className="datos">Email General: info@hermanosjota.com.ar</p>

        <p className="datos">Ventas: ventas@hermanosjota.com.ar</p>

        <p className="datos">Instagram: @hermanosjota_ba</p>

        <p className="datos">WhatsApp: +54 11 4567-8900</p>
      </div>
    </footer>
  );
};

export default Footer;
