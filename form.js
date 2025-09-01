const form = document.getElementById("contactForm");
const feedbackContainer = document.getElementById("formFeedback");
const template = document.getElementById("messageTemplate");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Supprimer les anciens messages
  feedbackContainer.replaceChildren();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let hasError = false;

  if (!name || !email || !message) {
    const errorElement = createMessage(
      "Tous les champs sont obligatoires",
      "error"
    );
    feedbackContainer.appendChild(errorElement);
    hasError = true;
  } else if (!validateEmail(email)) {
    const errorElement = createMessage(
      "L'adresse email n'est pas valide",
      "error"
    );
    feedbackContainer.appendChild(errorElement);
    hasError = true;
  }

  if (!hasError) {
    showModal("Message envoyé avec succès !");
    form.reset();
  }
});

function createMessage(text, type) {
  const clone = template.content.cloneNode(true);
  const box = clone.querySelector(".message-box");
  const span = clone.querySelector(".message-text");

  box.classList.add(type); // Ajoute "error"
  span.textContent = text;

  return clone;
}

function showModal(message) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const text = document.createElement("p");
  text.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Fermer";
  closeBtn.classList.add("modal-close");

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  modalContent.appendChild(text);
  modalContent.appendChild(closeBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  modal.classList.add("show");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
