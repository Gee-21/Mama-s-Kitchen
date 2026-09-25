/* Contact form: client-side check, then a mailto fallback (no backend). */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || message.length < 8) {
      showToast("Please complete all fields.");
      return;
    }
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:${STORE.email}?subject=${encodeURIComponent("Mama's Kitchen enquiry")}&body=${body}`;
  });
});
