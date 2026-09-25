/* Checkout: validation, PayFast sandbox POST, WhatsApp fallback. */

function saPhoneOk(value) {
  const digits = value.replace(/\D/g, "");
  return /^(0[6-8]\d{8}|27[6-8]\d{8})$/.test(digits);
}

function orderText(customer, totals) {
  const lines = totals.lines
    .map(({ item, qty, lineTotal }) => `• ${qty}× ${item.name} (${formatRand(lineTotal)})`)
    .join("\n");
  return [
    `*Order for ${STORE.name}*`,
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Fulfilment: ${customer.fulfilment === "delivery" ? "Delivery" : "Collection"}`,
    customer.fulfilment === "delivery" ? `Address: ${customer.address}` : `Collect at: ${STORE.address}`,
    "",
    lines,
    "",
    `Subtotal: ${formatRand(totals.subtotal)}`,
    `Delivery: ${totals.delivery === 0 ? "Free" : formatRand(totals.delivery)}`,
    `Total: ${formatRand(totals.total)}`,
    customer.notes ? `Notes: ${customer.notes}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

function readCustomer(form) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    fulfilment: String(data.get("fulfilment") || "delivery"),
    address: String(data.get("address") || "").trim(),
    notes: String(data.get("notes") || "").trim()
  };
}

function validate(customer) {
  const errors = {};
  if (customer.name.length < 2) errors.name = "Please enter your name.";
  if (!saPhoneOk(customer.phone)) errors.phone = "Use a South African mobile number.";
  if (customer.fulfilment === "delivery" && customer.address.length < 8) {
    errors.address = "Add a street address for delivery.";
  }
  return errors;
}

function showErrors(form, errors) {
  form.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
  Object.entries(errors).forEach(([field, message]) => {
    const slot = form.querySelector(`[data-error="${field}"]`);
    if (slot) slot.textContent = message;
  });
}

function persistPendingOrder(customer, totals) {
  const order = {
    id: `MK-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer,
    totals,
    items: totals.lines.map(({ item, qty, lineTotal }) => ({
      id: item.id,
      name: item.name,
      qty,
      lineTotal
    }))
  };
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  return order;
}

function fillPayFast(form, order) {
  const { payfast } = STORE;
  const origin = window.location.origin + window.location.pathname.replace(/[^/]+$/, "");
  form.action = payfast.processUrl;
  form.querySelector('[name="merchant_id"]').value = payfast.merchantId;
  form.querySelector('[name="merchant_key"]').value = payfast.merchantKey;
  form.querySelector('[name="return_url"]').value = `${origin}confirmation.html?paid=1`;
  form.querySelector('[name="cancel_url"]').value = `${origin}checkout.html?cancelled=1`;
  form.querySelector('[name="notify_url"]').value = `${origin}confirmation.html`;
  form.querySelector('[name="name_first"]').value = order.customer.name;
  form.querySelector('[name="cell_number"]').value = order.customer.phone.replace(/\s/g, "");
  form.querySelector('[name="m_payment_id"]').value = order.id;
  form.querySelector('[name="amount"]').value = order.totals.total.toFixed(2);
  form.querySelector('[name="item_name"]').value = `${STORE.name} order ${order.id}`;
  form.querySelector('[name="item_description"]').value = order.items
    .map((line) => `${line.qty}× ${line.name}`)
    .join(", ")
    .slice(0, 255);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const summary = document.getElementById("checkout-summary");
  const addressWrap = document.getElementById("address-wrap");
  const payfastForm = document.getElementById("payfast-form");
  const whatsappBtn = document.getElementById("whatsapp-order");
  if (!form || !summary) return;

  if (new URLSearchParams(window.location.search).get("cancelled") === "1") {
    showToast("Payment cancelled. Your cart is still here.");
  }

  function refresh() {
    const fulfilment = form.querySelector('[name="fulfilment"]:checked')?.value || "delivery";
    const totals = cartTotals(fulfilment);
    addressWrap.hidden = fulfilment !== "delivery";
    addressWrap.querySelector("input").required = fulfilment === "delivery";

    if (!totals.lines.length) {
      summary.innerHTML = `<p>Your cart is empty. <a href="menu.html">Add dishes first</a>.</p>`;
      form.querySelectorAll("[data-submit]").forEach((btn) => {
        btn.disabled = true;
      });
      return;
    }

    summary.innerHTML = `
      <ul class="mini-lines">
        ${totals.lines.map(({ item, qty, lineTotal }) => `<li><span>${qty}× ${item.name}</span><span>${formatRand(lineTotal)}</span></li>`).join("")}
      </ul>
      <div class="summary__row"><span>Subtotal</span><span>${formatRand(totals.subtotal)}</span></div>
      <div class="summary__row"><span>${fulfilment === "delivery" ? "Delivery" : "Collection"}</span><span>${totals.delivery === 0 ? "Free" : formatRand(totals.delivery)}</span></div>
      <div class="summary__row summary__row--total"><span>To pay</span><span>${formatRand(totals.total)}</span></div>
    `;
    form.querySelectorAll("[data-submit]").forEach((btn) => {
      btn.disabled = false;
    });
  }

  form.addEventListener("change", refresh);
  refresh();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const customer = readCustomer(form);
    const errors = validate(customer);
    showErrors(form, errors);
    if (Object.keys(errors).length) return;

    const totals = cartTotals(customer.fulfilment);
    if (!totals.lines.length) return;
    const order = persistPendingOrder(customer, totals);
    fillPayFast(payfastForm, order);
    /* Demo: we still POST to PayFast sandbox. Live sites must add ITN verification on a server. */
    payfastForm.submit();
  });

  whatsappBtn.addEventListener("click", () => {
    const customer = readCustomer(form);
    const errors = validate(customer);
    showErrors(form, errors);
    if (Object.keys(errors).length) return;
    const totals = cartTotals(customer.fulfilment);
    if (!totals.lines.length) return;
    persistPendingOrder(customer, totals);
    const url = `https://wa.me/${STORE.whatsappE164}?text=${encodeURIComponent(orderText(customer, totals))}`;
    window.open(url, "_blank", "noopener");
    window.location.href = "confirmation.html";
  });
});
