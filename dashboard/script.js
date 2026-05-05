// @ts-nocheck
// buscador de facturas

const rows = document.querySelectorAll("tbody tr");
const search = document.querySelector(".search");
const alertItems = document.querySelectorAll(".alert ul li");
const alertCards = document.querySelectorAll(".alert");
const metricCards = document.querySelectorAll(".metric");

if (search instanceof HTMLInputElement) {
  search.addEventListener("keyup", () => {
    const texto = search.value.toLowerCase().trim();

    /* con esto de aca filtramos la tabla */
    rows.forEach((row) => {
      const fila = row.textContent.toLowerCase();
      row.style.display = fila.includes(texto) ? "" : "none";
    });

    /* filtramos items de alertas tambien */
    alertItems.forEach((item) => {
      const contenido = item.textContent.toLowerCase();
      item.style.display = contenido.includes(texto) ? "" : "none";
    });

    /* esconder card alerta si no tiene items visibles */
    alertCards.forEach((card) => {
      const visibles = card.querySelectorAll('li[style=""]').length;
      const total = card.querySelectorAll("li").length;

      if (texto !== "") {
        card.style.display = visibles > 0 ? "" : "none";
      } else {
        card.style.display = "";
      }
    });

    /* metricas desaparecen al buscar */
    if (texto !== "") {
      metricCards.forEach((card) => (card.style.display = "none"));
    } else {
      metricCards.forEach((card) => (card.style.display = ""));
    }
  });
}