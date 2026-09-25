/* Menu page: search, category chips, and card grid from MENU data. */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("menu-grid");
  const search = document.getElementById("menu-search");
  const chips = document.getElementById("category-chips");
  if (!grid || !chips) return;

  const params = new URLSearchParams(window.location.search);
  let active = params.get("cat") || "all";
  let query = (params.get("q") || "").trim().toLowerCase();
  if (search) search.value = params.get("q") || "";

  function renderChips() {
    const all = [{ id: "all", label: "All", blurb: "Full menu" }, ...CATEGORIES];
    chips.innerHTML = all
      .map(
        (cat) => `
        <button type="button" class="chip ${cat.id === active ? "is-active" : ""}" data-cat="${cat.id}">
          ${cat.label}
        </button>`
      )
      .join("");
    chips.querySelectorAll("[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = btn.dataset.cat;
        renderChips();
        renderGrid();
      });
    });
  }

  function matches(item) {
    const inCat = active === "all" || item.category === active;
    if (!inCat) return false;
    if (!query) return true;
    return `${item.name} ${item.desc}`.toLowerCase().includes(query);
  }

  function renderGrid() {
    const items = MENU.filter(matches);
    if (!items.length) {
      grid.innerHTML = `<p class="empty">No dishes match that search. Try “bunny”, “pap”, or “peri”.</p>`;
      return;
    }

    const grouped =
      active === "all"
        ? CATEGORIES.map((cat) => ({
            cat,
            items: items.filter((item) => item.category === cat.id)
          })).filter((group) => group.items.length)
        : [{ cat: CATEGORIES.find((c) => c.id === active), items }];

    grid.innerHTML = grouped
      .map(
        (group) => `
        <section class="menu-section" id="${group.cat.id}">
          <header class="section-head">
            <h2>${group.cat.label}</h2>
            <p>${group.cat.blurb} · prices include VAT</p>
          </header>
          <div class="grid">${group.items.map(foodCard).join("")}</div>
        </section>`
      )
      .join("");
    bindAddButtons(grid);
  }

  if (search) {
    search.addEventListener("input", () => {
      query = search.value.trim().toLowerCase();
      renderGrid();
    });
  }

  renderChips();
  renderGrid();
});
