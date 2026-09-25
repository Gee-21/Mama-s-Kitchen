/* Order confirmation: read the pending order, then empty the cart. */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("confirm-root");
  if (!root) return;

  let order = null;
  try {
    order = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) || "null");
  } catch {
    order = null;
  }

  const paid = new URLSearchParams(window.location.search).get("paid") === "1";

  if (!order) {
    root.innerHTML = `
      <div class="empty-state">
        <h1>No order found</h1>
        <p>If you just paid, keep this tab open until PayFast returns you here.</p>
        <a class="btn btn--primary" href="menu.html">Back to menu</a>
      </div>`;
    return;
  }

  clearCart();

  root.innerHTML = `
    <p class="eyebrow">${paid ? "Payment submitted" : "Order captured"}</p>
    <h1 class="page-title">Thanks, ${order.customer.name.split(" ")[0]}</h1>
    <p class="lede">Order <strong>${order.id}</strong> is in. We’ll WhatsApp you on ${order.customer.phone} when the kitchen starts it.</p>
    <div class="confirm-card">
      <p><strong>${order.customer.fulfilment === "delivery" ? "Delivering to" : "Collect from"}</strong><br>
      ${order.customer.fulfilment === "delivery" ? order.customer.address : STORE.address}</p>
      <ul class="mini-lines">
        ${order.items.map((line) => `<li><span>${line.qty}× ${line.name}</span><span>${formatRand(line.lineTotal)}</span></li>`).join("")}
      </ul>
      <div class="summary__row summary__row--total"><span>Total</span><span>${formatRand(order.totals.total)}</span></div>
    </div>
    <p class="hint">PayFast on this demo uses sandbox credentials — no live card charge is taken. WhatsApp orders are sent to the restaurant number as a fallback.</p>
    <a class="btn btn--primary" href="menu.html">Order again</a>
  `;
});
