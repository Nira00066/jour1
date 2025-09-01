// js/reviews.js

// 1) Données initiales (tableau JS)

const AVIS = [
  { nom: "Ana", note: 5, message: "Excellent produit !" },
  { nom: "Marc", note: 4, message: "Très bon rapport qualité/prix." },
];

// 2) références DOM
let $liste, $form, $tpl;

// 3) Point d’entrée (appelé depuis avis.html)
export function initAvis() {
  // Récupérer les hooks
  $liste = document.getElementById("avis-liste");
  $form = document.getElementById("avis-form");
  $tpl = document.getElementById("avis-template");

  // AJOUT : créer le sélecteur “Filtrer par note”
  createFilterUI();

  // Injecter les avis initiaux au chargement (via <template>)
  AVIS.forEach((avis) => {
    $liste.appendChild(createAvisNode(avis));
  });

  // Soumission du formulaire → ajout en tête de liste
  $form.addEventListener("submit", onSubmit);
}

// 4) Fabrique d’un élément d’avis à partir du <template>
function createAvisNode({ nom, note, message }) {
  // Accès au contenu du template et clonage profond
  const fragment = $tpl.content.cloneNode(true);

  const li = fragment.querySelector(".avis-item");

  // AJOUT : stocker la note sur l’élément (ex: "5", "4", ...)
  li.dataset.note = String(note);

  // Remplir les champs de l’avis
  li.querySelector(".avis-nom").textContent = nom;
  li.querySelector(".avis-note").textContent = `★ ${note}`;
  li.querySelector(".avis-message").textContent = message;

  // Bouton "Supprimer" - animation de sortie puis retrait du DOM
  li.querySelector(".avis-supprimer").addEventListener("click", () => {
    li.classList.add("is-leave");
    li.addEventListener("transitionend", () => li.remove(), { once: true });
  });

  // Retourner le <li> prêt à insérer
  return li;
}

// 5) Handler : ajout d’un avis (en tête + animation d’entrée)
function onSubmit(e) {
  e.preventDefault();

  // Récupérer et nettoyer les valeurs du formulaire
  const nom = ($form.nom.value || "").trim();
  const note = parseInt($form.note.value, 10);
  const message = ($form.message.value || "").trim();

  // Validation simple
  if (!nom || !note || !message) return;

  // Créer l’objet avis
  const nouveau = { nom, note, message };

  // Créer le node, appliquer la classe d’entrée et insérer en HAUT
  const node = createAvisNode(nouveau);

  // état initial de l’animation
  node.classList.add("is-enter");

  // ajout en tête (dernier avis en premier)
  $liste.prepend(node);

  // Lancer la transition à l’image suivante du rendu
  requestAnimationFrame(() => node.classList.remove("is-enter"));

  // Si un filtre est actif, on le ré-applique pour respecter l'affichage courant
  const sel = document.getElementById("filtre-note");
  if (sel) applyFilter(sel.value);

  // Réinitialiser le formulaire
  $form.reset();
  $form.nom.focus();
}

// Crée le petit sélecteur "Filtrer par note" (injecté avant la liste)
function createFilterUI() {
  const wrap = document.createElement("div");
  wrap.id = "avis-filtre";

  const label = document.createElement("label");
  label.setAttribute("for", "filtre-note");
  label.textContent = "Filtrer par note";

  const select = document.createElement("select");
  select.id = "filtre-note";
  // Options : Toutes, puis 5 à 1 étoiles
  select.innerHTML = `
    <option value="">Toutes</option>
    <option value="5">5 ★</option>
    <option value="4">4 ★</option>
    <option value="3">3 ★</option>
    <option value="2">2 ★</option>
    <option value="1">1 ★</option>
  `;
  // Quand la valeur change → appliquer le filtre
  select.addEventListener("change", () => applyFilter(select.value));

  wrap.append(label, select);
  // Insérer juste avant la liste des avis
  $liste.parentNode.insertBefore(wrap, $liste);
}

// Montre/masque les avis selon la note sélectionnée
function applyFilter(value) {
  const items = $liste.querySelectorAll(".avis-item");
  items.forEach((li) => {
    // value vide = "Toutes" → on montre tout
    li.style.display = !value || li.dataset.note === value ? "" : "none";
  });
}
