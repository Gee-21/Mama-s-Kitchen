/* Shared cart, navigation, PWA install, and money helpers.
   Cart lives in localStorage so it survives refreshes on a phone. */

const CART_KEY = "mamas-kitchen-cart-v1";
const LAST_ORDER_KEY = "mamas-kitchen-last-order";
const SITE_ROOT = document.documentElement.getAttribute("data-root") || "";

function asset(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  return SITE_ROOT + path.replace(/^\.\//, "");
}

/* ---------- Money ---------- */

function formatRand(amount) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR"
  }).format(amount);
}

/* ---------- Cart persistence ---------- */

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
}

function cartCount() {
  return Object.values(getCart()).reduce((sum, qty) => sum + qty, 0);
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
}

function setCartQty(id, qty) {
  const cart = getCart();
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
}

function clearCart() {
  saveCart({});
}

function cartLines() {
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, qty]) => {
      const item = getItemById(id);
      if (!item) return null;
      return { item, qty, lineTotal: item.price * qty };
    })
    .filter(Boolean);
}

function cartTotals(fulfilment = "delivery") {
  const lines = cartLines();
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const delivery =
    fulfilment === "delivery" && subtotal > 0
      ? subtotal >= STORE.freeDeliveryFrom
        ? 0
        : STORE.deliveryFee
      : 0;
  return { lines, subtotal, delivery, total: subtotal + delivery };
}

/* ---------- UI: header, bottom nav, toast ---------- */

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === page);
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function bindAddButtons(root = document) {
  root.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add");
      const item = getItemById(id);
      addToCart(id);
      showToast(item ? `${item.name} added` : "Added to cart");
    });
  });
}

function foodCard(item) {
  const img = asset(item.image);
  return `
    <article class="card" data-item="${item.id}">
      <div class="card__media">
        <img src="${img}" alt="${item.name}" width="400" height="250" loading="lazy">
        ${item.popular ? '<span class="pill pill--hot">Popular</span>' : ""}
      </div>
      <div class="card__body">
        <h3 class="card__title">${item.name}</h3>
        <p class="card__desc">${item.desc}</p>
        <div class="card__row">
          <span class="price">${formatRand(item.price)}</span>
          <button type="button" class="btn btn--add" data-add="${item.id}" aria-label="Add ${item.name} to cart">
            Add
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ---------- PWA install prompt ---------- */

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  document.querySelectorAll("[data-install]").forEach((el) => {
    el.hidden = false;
  });
});

async function promptInstall() {
  if (!deferredPrompt) {
    showToast("Use your browser menu → Add to Home Screen");
    return;
  }
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.querySelectorAll("[data-install]").forEach((el) => {
    el.hidden = true;
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(asset("sw.js")).catch(() => {
      /* Offline cache is optional; the shop still works online. */
    });
  });
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  updateCartBadge();
  bindAddButtons();
  registerServiceWorker();

  document.querySelectorAll("[data-install]").forEach((btn) => {
    btn.addEventListener("click", promptInstall);
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
