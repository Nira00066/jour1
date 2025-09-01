//---------------------------------------------- Données : générer dynamiquement les Q/R depuis un tableau JS ------------------------------------

const faqs = [                                                                              // Déclare un tableau d'objets représentant chaque Q/R (FAQ)
  { q: "Comment suivre ma commande ?", a: "Rendez-vous dans votre espace client > Mes commandes pour suivre chaque étape." }, // 1er objet : question et                                                                                            réponse.faqs est un conteneur et q, et a sont des items
  { q: "Quels sont les modes de paiement ?", a: "Carte bancaire, PayPal et virement bancaire sont acceptés." },                // 2e objet
  { q: "Quels sont les délais de livraison ?", a: "Entre 2 et 4 jours ouvrés en France métropolitaine." },                    // 3e objet
  { q: "Puis-je retourner un article ?", a: "Oui, vous disposez de 14 jours. Les retours sont gratuits." },                  // 4e objet
  { q: "Comment contacter le support ?", a: "Via le formulaire de contact ou par email : support@example.com." },           // 5e objet
];                                                              // Fin du tableau de données

//------------------------------------------------- Sélecteurs principaux-----------------------------------------------------------------

const faqListEl   = document.getElementById("faqList");         // Récupère le conteneur où seront injectés les items de l'accordéon
const faqEmptyEl  = document.getElementById("faqEmpty");        // Élément affiché quand aucune FAQ ne correspond (état vide)
const searchInput = document.getElementById("faqSearch");       // Champ de recherche pour filtrer les FAQ en temps réel
const btnToggleAll = document.getElementById("toggleAll");      // Bouton pour tout déplier / tout plier
const exclusiveMode = document.getElementById("exclusiveMode"); // Checkbox/contrôle : si activé, un seul item ouvert à la fois
const askForm = document.getElementById("askForm");             // Formulaire pour ajouter une nouvelle Q/R
const askQuestion = document.getElementById("askQuestion");     // Champ texte de la question
const askAnswer = document.getElementById("askAnswer");         // Champ texte de la réponse

// ------------------------------------------------------- Rendu d'un item -----------------------------------------------------------------

function createFaqItem({ q, a }) {                              // Fonction qui crée le DOM pour une Q/R à partir d'un objet {q, a}
  const item = document.createElement("div");                   // Crée le conteneur de l'item
  item.className = "accordion-item";                            // Ajoute la classe CSS principale
  item.setAttribute("role", "group");                           // Accessibilité : groupe logique (question + réponse)

  const header = document.createElement("div");                 // En-tête cliquable (la question)
  header.className = "accordion-header";                        // Classe CSS de l'en-tête
  header.textContent = q;                                       // Texte = question
  header.setAttribute("role", "button");                        // Accessibilité : se comporte comme un bouton
  header.setAttribute("tabindex", "0");                         // Focusable au clavier
  header.setAttribute("aria-expanded", "false");                // État ARIA (replié par défaut)

  const content = document.createElement("div");                // Conteneur de la réponse (zone repliable)
  content.className = "accordion-content";                      // Classe CSS pour l'animation (max-height)
  const inner = document.createElement("div");                  // Contenu interne (pour le padding/overflow)
  inner.className = "accordion-content-inner";                  // Classe CSS interne
  inner.textContent = a || "—";                                 // Texte = réponse ou tiret si vide
  content.appendChild(inner);                                   // Insère le contenu interne dans le conteneur

  //----------------------------------------- Interactions header-------------------------------------------------------------------------------------
  const toggleItem = () => {                                                        // Fonction locale pour ouvrir/fermer cet item
    const isActive = item.classList.contains("active");                            // Vérifie si l'item est déjà ouvert

    // Mode exclusif : fermer les autres quand j’ouvre celui-ci
    if (exclusiveMode.checked && !isActive) {                                    // Si mode exclusif activé et item fermé
      document.querySelectorAll(".accordion-item.active").forEach(other => {    // Sélectionne tous les autres items ouverts
        if (other !== item) closeItem(other);                                  // Ferme chaque autre item
      });
    }

    //--------------------------------------------------- Toggle---------------------------------------------------------------------------------------
    isActive ? closeItem(item) : openItem(item);                           // Si ouvert => fermer, sinon => ouvrir
  };                                                                      //
                                                                         //
  header.addEventListener("click", toggleItem);                         // Clic souris sur l'en-tête => toggle
  header.addEventListener("keydown", (e) => {                          // Gestion clavier pour accessibilité
    if (e.key === "Enter" || e.key === " ") {                         // Active avec Entrée ou Espace
      e.preventDefault();                                            // Empêche scroll ou autre comportement par défaut
      toggleItem();                                                 // Bascule l'état
    }
  });

  item.appendChild(header);                                         // Ajoute l'en-tête à l'item
  item.appendChild(content);                                       // Ajoute le contenu à l'item
  return item;                                                    // Retourne l'élément DOM complet prêt à être inséré
}

// ------------------------------------ Ouverture/fermeture avec animation douce (max-height dynamique) ----------------------------------------------

function openItem(item) {                                                                   // Ouvre visuellement un item
  const content = item.querySelector(".accordion-content");                                // Récupère le bloc repliable
  item.classList.add("active");                                                           // Marque l'item comme ouvert (pour le style)
  content.style.maxHeight = content.scrollHeight + "px";                                 // Définit max-height pour animer jusqu'à la hauteur réelle
  item.querySelector(".accordion-header").setAttribute("aria-expanded", "true");        // Met à jour l'état ARIA
  updateToggleAllLabel();                                                              // Met à jour le libellé du bouton global
}                                                                                     //
function closeItem(item) {                                                           // Ferme visuellement un item
  const content = item.querySelector(".accordion-content");                         // Récupère le bloc repliable
  item.classList.remove("active");                                                 // Retire l'état ouvert
  content.style.maxHeight = "0px";                                                // Ramène max-height à 0 pour replier avec animation
  item.querySelector(".accordion-header").setAttribute("aria-expanded", "false");// Met à jour l'état ARIA
  updateToggleAllLabel();                                                       // Met à jour le libellé du bouton global
}

// ---------------------------------------------- Rendu de la liste (avec filtre) -------------------------------------------------------------------------

function renderList(list) {                                                 // Reconstruit toute la liste d'items à partir d'un tableau
  faqListEl.innerHTML = "";                                                // Vide le conteneur avant nouveau rendu
  list.forEach(data => faqListEl.appendChild(createFaqItem(data)));       // Crée puis insère chaque item
  faqEmptyEl.style.display = list.length ? "none" : "block";             // Affiche/masque l'état vide
  updateToggleAllLabel();                                               // Ajuste le libellé du bouton global
}

// ---------------------------------------------------------- Filtrage en temps réel ----------------------------------------------------------------------

searchInput.addEventListener("input", () => {                     // À chaque frappe dans le champ de recherche
  const term = searchInput.value.trim().toLowerCase();           // Normalise la saisie (sans espaces, en minuscules)
  const filtered = faqs.filter(({ q, a }) =>                    // Filtre les FAQ selon la question ou la réponse
    q.toLowerCase().includes(term) || (a && a.toLowerCase().includes(term))
  );
  renderList(filtered);                                          // Réaffiche uniquement les résultats filtrés
});

// ---------------------------------------------------------------- Bouton “Déplier / Plier tout” ------------------------------------------------------

function updateToggleAllLabel() {                                             // Choisit le texte du bouton global selon l'état
  const items = [...document.querySelectorAll(".accordion-item")];           // Liste actuelle des items rendus
  if (!items.length) { btnToggleAll.textContent = "Déplier tout"; return; } // S'il n'y a rien, par défaut "Déplier"
  const allOpen = items.every(i => i.classList.contains("active"));        // True si tous les items sont ouverts
  btnToggleAll.textContent = allOpen ? "Plier tout" : "Déplier tout";     // Met à jour le libellé
}
btnToggleAll.addEventListener("click", () => {                          // Clic sur le bouton global
  const items = [...document.querySelectorAll(".accordion-item")];     // Récupère tous les items
  const allOpen = items.length && items.every(i => i.classList.contains("active"));   // Vérifie si tous sont ouverts
  if (allOpen) items.forEach(closeItem); else items.forEach(openItem);               // Ferme tout ou ouvre tout
  updateToggleAllLabel();                                                           // Met à jour le libellé (sécurité)
});

//----------------------------------------------- --- Formulaire “Poser une question” -----------------------------------------------------------

askForm.addEventListener("submit", (e) => {                    // À la soumission du formulaire d'ajout
  e.preventDefault();                                         // Empêche le rechargement de la page
  const q = askQuestion.value.trim();                        // Récupère et nettoie la question
  const a = askAnswer.value.trim();                         // Récupère et nettoie la réponse
  if (!q) return;                                          // Ne rien faire si la question est vide

  faqs.push({ q, a });                                   // Ajoute la nouvelle Q/R au tableau source

  // ----------------------------------------------------Si filtré, on réapplique le filtre---------------------------------------------------------------

  const term = searchInput.value.trim().toLowerCase();  // Récupère le filtre courant
  const view = term
    ? faqs.filter(({ q, a }) => q.toLowerCase().includes(term) || (a && a.toLowerCase().includes(term))) // Si filtre actif : recalcule la vue
    : faqs;                                                                                               // Sinon : toute la liste

  renderList(view);                                         // Rerendra la liste en fonction du filtre
  askForm.reset();                                         // Réinitialise les champs du formulaire
});

//------------------------------------------------------------------------- Init --------------------------------------------------------------------------

renderList(faqs);                                       // Affiche la liste initiale au chargement (toutes les Q/R)
