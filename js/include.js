/**
 * Inserta el HTML de un archivo en el elemento con id dado.
 * Devuelve una Promise que se resuelve cuando la inserción termina.
 */
async function includeHTML(id, file) {
  const elem = document.getElementById(id);
  if (elem) {
    const resp = await fetch(file);
    elem.innerHTML = await resp.text();
    return true;
  }
  return false;
}

// Incluir header y footer en todas las páginas.
// Esperamos ambas inclusiones y disparamos un evento cuando el header ya fue insertado
// para que otros módulos (por ejemplo el contador del carrito) sepan que pueden
// acceder al elemento `#cart-count` sin hacer polls.
async function loadIncludes() {
  const headerInserted = await includeHTML("header", "../pages/templates/header.html");
  // Si el header fue insertado, avisar a otros scripts que dependan de él
  if (headerInserted) {
    // Evento personalizado: 'header:ready'
    document.dispatchEvent(new CustomEvent('header:ready'));
  }

  // Insertar footer (no bloqueante para el header)
  await includeHTML("footer", "../pages/templates/footer.html");
}

loadIncludes();
