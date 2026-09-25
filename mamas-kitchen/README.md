# Mama's Kitchen PWA

Mobile-first ordering site for a Melville, Johannesburg restaurant. Static HTML, CSS, and JavaScript — no build step.

## Run locally

Service workers and install-to-home-screen need `http://localhost` (not `file://`).

```bash
npx --yes serve .
```

Or:

```bash
python -m http.server 8080
```

Then open `http://localhost:3000` (serve) or `http://localhost:8080`.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Menu | `menu.html` |
| Cart | `cart.html` |
| Checkout | `checkout.html` |
| Confirmation | `confirmation.html` |
| Contact | `contact.html` |

Menu data and PayFast sandbox placeholders live in `js/data.js`.

## Go live

1. Replace `STORE.payfast` with your live merchant id and key.
2. Add a server endpoint for PayFast ITN (`notify_url`) before taking real payments.
3. Point `STORE.whatsappE164` at the kitchen WhatsApp.
4. Swap `mamaskitchen.example` in canonical URLs, `robots.txt`, and `sitemap.xml`.
5. Host on HTTPS (Netlify, Cloudflare Pages, or any static host).

Prices are sample ZAR figures, VAT included.
