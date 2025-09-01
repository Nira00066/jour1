// J'ai par defaut le prix et de 819  euros
//  et blanc et 64go

// recupere le bloc color

// Sélection de l'élément prix
const prixEl = document.getElementById("prixProduit");

// Couleurs
const btnCouleur = document.querySelectorAll(".couleurs button");
btnCouleur.forEach((btn) => {
  btn.addEventListener("click", () => {
    btnCouleur.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updatePrice();
  });
});

// Tailles
const btnTaille = document.querySelectorAll(".tailles button");
btnTaille.forEach((btn) => {
  btn.addEventListener("click", () => {
    btnTaille.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updatePrice();
  });
});

// Fonction  prix
function updatePrice() {
  let total = 800;

  // Prix couleur sélectionnée
  const couleurActive = document.querySelector(".couleurs button.active");
  if (couleurActive) total += parseInt(couleurActive.dataset.prix);

  // Prix taille
  const tailleActive = document.querySelector(".tailles button.active");
  if (tailleActive) total += parseInt(tailleActive.dataset.prix);

  prixEl.textContent = total + " €";
}

// Initialiser le prix au chargement
updatePrice();
