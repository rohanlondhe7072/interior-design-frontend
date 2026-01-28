const applyFilters = async () => {
  const room = document.querySelector("#room").value;
  const style = document.querySelector("#style").value;
  const budget = document.querySelector("#budget").value;
  const search = document.querySelector("#search").value || "";

  const url = `http://localhost:5000/api/designs?room=${room}&style=${style}&budget=${budget}&search=${search}`;

  const res = await fetch(url);
  const data = await res.json();

  renderDesigns(data);
};

function renderDesigns(designs) {
  const grid = document.querySelector(".design-grid");
  grid.innerHTML = "";

  designs.forEach(d => {
    grid.innerHTML += `
      <article class="design-card">
        <div class="card-content">
          <h3>${d.title}</h3>
          <p>${d.description}</p>
          <small>${d.room} • ${d.style} • ${d.budget}</small>
        </div>
      </article>
    `;
  });
}
async function applyFilters() {
  const room = document.querySelector("#room").value;
  const style = document.querySelector("#style").value;
  const budget = document.querySelector("#budget").value;
  const search = document.querySelector("#search")?.value || "";

  const url = `http://localhost:5000/api/designs?room=${room}&style=${style}&budget=${budget}&search=${search}`;

  const res = await fetch(url);
  const data = await res.json();

  renderDesigns(data);
}

function renderDesigns(designs) {
  const grid = document.querySelector(".design-grid");
  grid.innerHTML = "";

  if (designs.length === 0) {
    grid.innerHTML = "<p>No designs found</p>";
    return;
  }

  designs.forEach(d => {
    grid.innerHTML += `
      <article class="design-card">
        <div class="card-content">
          <h3>${d.title}</h3>
          <p>${d.description}</p>
          <small>${d.room} • ${d.style} • ${d.budget}</small>
        </div>
      </article>
    `;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const filterBtn = document.querySelector(".filter-action button");

  if (filterBtn) {
    filterBtn.addEventListener("click", applyFilters);
  }
});



