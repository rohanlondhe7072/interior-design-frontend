const API_URL = "http://localhost:5000/api";

// CONTACT / CONSULTATION FORM
const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name?.value || "",
      phone: form.phone?.value || "",
      email: form.email?.value || "",
      page: window.location.pathname
    };

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        window.location.href = "save-lead.html";
      } else {
        alert("Form submit failed");
      }
    } catch (err) {
      alert("Backend not reachable");
      console.error(err);
    }
  });
}
