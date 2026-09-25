/* Cart page: quantity steppers, remove, running totals. */

function renderCartPage() {
  const root = document.getElementById("cart-root");
  if (!root) return;

  const { lines, subtotal, delivery, total } = cartTotals("delivery");

  if (!lines.length) {
    root.innerHTML = `
      <div class="empty-state">
        <h1>Your cart is empty</h1>
        <p>Add a bunny chow or a braai platter and we’ll keep it warm.</p>
        <a class="btn btn--primary" href="menu.html">Browse the menu</a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <h1 class="page-title">Cart</h1>
    <ul class="cart-list">
      ${lines
        .map(
          ({ item, qty, lineTotal }) => `
        <li class="cart-row" data-id="${item.id}">
          <img src="${asset(item.image)}" alt="" width="72" height="72">
          <div class="cart-row__info">
            <h2>${item.name}</h2>
            <p>${formatRand(item.price)} each</p>
            <div class="qty">
              <button type="button" data-qty="-1" aria-label="Decrease ${item.name}">−</button>
              <span>${qty}</span>
              <button type="button" data-qty="1" aria-label="Increase ${item.name}">+</button>
            </div>
          </div>
          <div class="cart-row__side">
            <strong>${formatRand(lineTotal)}</strong>
            <button type="button" class="linkish" data-remove>Remove</button>
          </div>
        </li>`
        )
        .join("")}
    </ul>
    <aside class="summary">
      <div class="summary__row"><span>Subtotal</span><span>${formatRand(subtotal)}</span></div>
      <div class="summary__row"><span>Delivery (est.)</span><span>${delivery === 0 ? "Free" : formatRand(delivery)}</span></div>
      <p class="hint">Free delivery from ${formatRand(STORE.freeDeliveryFrom)}. Collection is free at checkout.</p>
      <div class="summary__row summary__row--total"><span>Total</span><span>${formatRand(total)}</span></div>
      <a class="btn btn--primary btn--block" href="checkout.html">Go to checkout</a>
    </aside>
  `;

  root.querySelectorAll(".cart-row").forEach((row) => {
    const id = row.dataset.id;
    row.querySelectorAll("[data-qty]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = Number(btn.dataset.qty);
        const current = getCart()[id] || 0;
        setCartQty(id, current + delta);
        renderCartPage();
      });
    });
    row.querySelector("[data-remove]").addEventListener("click", () => {
      setCartQty(id, 0);
      renderCartPage();
    });
  });
}

document.addEventListener("DOMContentLoaded", renderCartPage);
