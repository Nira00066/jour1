// Sélectionner tous les accordion-items
const accordionItems = document.querySelectorAll(".accordion-item");

// Pour chaque item
accordionItems.forEach(item => {
    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {
        // quand j'ouvre un iteme je Ferme tous les autres 
        //avec foreach, je parcours tous les accordions-item
        //et otherItem est un element dans la boucle foreach
        accordionItems.forEach(otherItem => {
            //si other item n'est pas le meme que celui que je clique alors on ignore celui qu'on vient d'ouvrir et on ferme tous les autres
            if (otherItem !== item) {
                //fermer les autres c'est retirer active
                otherItem.classList.remove("active");
                //Ferme toutes les autres questions sauf celle que je viens de cliquer
            }
        });

        // Ouvrir/fermer l'item cliqué, c'est le principe du toggle utilisé egalement en electronique pour un interrupteur      (on1-off-on2).
        item.classList.toggle("active");
    });
});
