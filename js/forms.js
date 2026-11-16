const CIPC_WHATSAPP_NUMBER = "2250758699590";
const CIPC_WHATSAPP_CONFIRMED = true;

function setupRequestForm(formId, resultId, fields) {
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);

  if (!form || !result) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const summary = result.querySelector("dl");
    const fragment = document.createDocumentFragment();

    fields.forEach(([key, label]) => {
      const value = (formData.get(key) || "").toString().trim();

      if (!value) {
        return;
      }

      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = label;
      description.textContent = value;
      fragment.append(term, description);
    });

    summary.replaceChildren(fragment);

    const message = result.querySelector(".result-message");
    const whatsappLink = result.querySelector(".whatsapp-link");

    if (CIPC_WHATSAPP_CONFIRMED) {
      const lines = fields
        .map(([key, label]) => {
          const value = (formData.get(key) || "").toString().trim();
          return value ? `${label} : ${value}` : "";
        })
        .filter(Boolean);

      whatsappLink.href = `https://wa.me/${CIPC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
        lines.join("\n"),
      )}`;
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener noreferrer";
      whatsappLink.hidden = false;
      message.textContent =
        "Vérifiez le récapitulatif, puis choisissez si vous souhaitez transmettre la demande.";
    } else {
      whatsappLink.hidden = true;
      whatsappLink.removeAttribute("href");
      message.textContent =
        "Votre demande n'a pas été envoyée. Le numéro WhatsApp n'étant pas confirmé, vous pouvez appeler l'Église.";
    }

    result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
    });
  });
}

setupRequestForm("contactForm", "contactResult", [
  ["name", "Nom"],
  ["phone", "Téléphone"],
  ["email", "E-mail"],
  ["reason", "Motif"],
  ["date", "Date souhaitée"],
  ["message", "Message"],
]);

setupRequestForm("departmentForm", "departmentResult", [
  ["name", "Nom"],
  ["phone", "Téléphone"],
  ["email", "E-mail"],
  ["department", "Département souhaité"],
  ["message", "Message"],
]);
