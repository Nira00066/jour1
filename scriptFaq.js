// Sélectionner tous les accordion-items
const accordionItems = document.querySelectorAll(".accordion-item");

// Pour chaque item
accordionItems.forEach(item => {
    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {
        // quand j'ouvre un item je ferme tous les autres 
        // avec foreach, je parcours tous les accordion-items
        // et otherItem est un élément dans la boucle foreach
        accordionItems.forEach(otherItem => {
            // si otherItem n'est pas le même que celui que je clique alors on ignore celui qu'on vient d'ouvrir et on ferme tous les autres
            if (otherItem !== item) {
                // fermer les autres c'est retirer la classe active
                otherItem.classList.remove("active");
                // Ferme toutes les autres questions sauf celle que je viens de cliquer
            }
        });

        // Ouvrir/fermer l'item cliqué, c'est le principe du toggle utilisé également en électronique pour un interrupteur (on1-off-on2).
        item.classList.toggle("active");
    });
});

// dans les fonction attendues :il est possible d'ouvrir/fermer plusieurs réponses en même temps avec un bouton plier deplier comme dans le site afec

// On sélectionne le bouton
const btnToggleAll = document.getElementById("toggleAll");

// On ajoute un écouteur de clic sur ce bouton
btnToggleAll.addEventListener("click", () => {
    // Vérifier si tous les items sont déjà ouverts (ont la classe active)
    const allOpen = Array.from(accordionItems).every(item =>
        item.classList.contains("active")
    );

    if (allOpen) {
        // Si tout est ouvert => on les ferme tous
        accordionItems.forEach(item => item.classList.remove("active"));
        // On change le texte du bouton pour inviter à tout réouvrir
        btnToggleAll.textContent = "Déplier tout";
    } else {
        // Sinon (tous pas ouverts) => on les ouvre tous
        accordionItems.forEach(item => item.classList.add("active"));
        // On change le texte du bouton pour inviter à tout refermer
        btnToggleAll.textContent = "Plier tout";
    }
});
