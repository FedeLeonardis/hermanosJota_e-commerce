// Componente utilitario no utilizado actualmente porque el flujo principal maneja scroll manualmente.
import { useEffect } from "react";

export default function ScrollToTop({ trigger }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [trigger]);

  return null;
}
