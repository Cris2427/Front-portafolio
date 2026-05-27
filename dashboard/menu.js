const links = document.querySelectorAll(".nav-item");

links.forEach(link => {

  const actual = window.location.pathname.split("/").pop();
  const destino = link.getAttribute("href");

  if (actual === destino) {
    link.classList.add("active");
  }

});