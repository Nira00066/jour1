const path = window.location.pathname;
const page = path.split("/").pop();
const titleElement = document.getElementById("page-title");

switch (page) {
  case "./src/pages/price.html":
    titleElement.textContent = "Articles";
    break;
  case "form.html":
    titleElement.textContent = "Form";
    break;
  case "contact.html":
    titleElement.textContent = "Contacter nous";
    break;
  case "avis.html":
    titleElement.textContent = "Avis";
    break;
  default:
    titleElement.textContent = "Bienvenue";
}
