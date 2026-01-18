const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");

navToggle?.addEventListener("click", () => {
  nav.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

const setFormStatus = (message, isError = false) => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.dataset.state = isError ? "error" : "success";
};

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFormStatus("Sending your request...");

  const formData = new FormData(contactForm);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    contactForm.reset();
    setFormStatus("Thanks! We will get back to you shortly.");
  } catch (error) {
    setFormStatus("Something went wrong. Please email hello@clouddudes.co.za.", true);
  }
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((section) => observer.observe(section));
