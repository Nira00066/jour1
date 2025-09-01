// Sélectionner tous les accordion-items
const accordionItem = document.querySelectorAll(".accordion-item");

// Pour chaque item
accordionItem.forEach(item => {
    const header = item.querySelector(".accordion-header"); // ✅ corrigé ici
    header.addEventListener("click", () => {
        item.classList.toggle("active");
    });
});
