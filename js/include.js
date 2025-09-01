async function includeHTML(id, file) {
  const elem = document.getElementById(id);
  if (elem) {
    const resp = await fetch(file);
    elem.innerHTML = await resp.text();
  }
}

// Incluir header y footer en todas las páginas
includeHTML("header", "../pages/templates/header.html");
includeHTML("footer", "../pages/templates/footer.html");
