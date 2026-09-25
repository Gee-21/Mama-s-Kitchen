/* Home page featured dishes — popular items from the menu data. */

document.addEventListener("DOMContentLoaded", () => {
  const rail = document.getElementById("featured-grid");
  if (!rail) return;
  const featured = MENU.filter((item) => item.popular).slice(0, 6);
  rail.innerHTML = featured.map(foodCard).join("");
  bindAddButtons(rail);
});
