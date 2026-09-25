/* Mama's Kitchen — restaurant PWA
   Merchant: demo / placeholder. Replace PayFast keys before going live. */

const STORE = {
  name: "Mama's Kitchen",
  tagline: "Homestyle South African food, delivered hot.",
  phoneDisplay: "011 482 0190",
  whatsappE164: "27825550148",
  email: "hello@mamaskitchen.co.za",
  address: "12 7th Street, Melville, Johannesburg, 2092",
  hours: "Tue–Sun · 07:00–21:30",
  deliveryFee: 35,
  freeDeliveryFrom: 250,
  /* PayFast sandbox placeholders — swap for live merchant_id / merchant_key */
  payfast: {
    processUrl: "https://sandbox.payfast.co.za/eng/process",
    merchantId: "10000100",
    merchantKey: "46f0cd694581a"
  }
};

const CATEGORIES = [
  { id: "breakfast", label: "Breakfast", blurb: "Until 11:30" },
  { id: "lunch", label: "Lunch", blurb: "11:00–16:00" },
  { id: "dinner", label: "Dinner", blurb: "From 17:00" },
  { id: "drinks", label: "Drinks", blurb: "All day" }
];

const MENU = [
  {
    id: "b1",
    category: "breakfast",
    name: "Vetkoek stuffed with mince",
    price: 48,
    desc: "Golden vetkoek filled with slow-cooked savoury mince and chutney.",
    image: "assets/images/vetkoek.svg",
    popular: true
  },
  {
    id: "b2",
    category: "breakfast",
    name: "Creamy pap & eggs",
    price: 42,
    desc: "Soft maize porridge, two eggs, butter, and a side of tomato relish.",
    image: "assets/images/pap-eggs.svg",
    popular: false
  },
  {
    id: "b3",
    category: "breakfast",
    name: "Mama's full breakfast",
    price: 95,
    desc: "Eggs, boerewors, bacon, grilled tomato, mushrooms, and toast.",
    image: "assets/images/full-breakfast.svg",
    popular: true
  },
  {
    id: "b4",
    category: "breakfast",
    name: "Avo & feta roosterkoek",
    price: 68,
    desc: "Wood-fired roosterkoek, smashed avo, feta, chilli flakes, lemon.",
    image: "assets/images/avo-toast.svg",
    popular: false
  },
  {
    id: "b5",
    category: "breakfast",
    name: "Melkkos with cinnamon",
    price: 36,
    desc: "Comfort in a bowl: silky milk porridge, cinnamon sugar, extra butter.",
    image: "assets/images/melkkos.svg",
    popular: false
  },
  {
    id: "b6",
    category: "breakfast",
    name: "Breakfast bunny chow",
    price: 58,
    desc: "Half-loaf filled with spicy scrambled eggs, beans, and chakalaka.",
    image: "assets/images/bunny-breakfast.svg",
    popular: false
  },
  {
    id: "l1",
    category: "lunch",
    name: "Peri-peri quarter chicken",
    price: 89,
    desc: "Flame-grilled, basted in Mama's peri-peri, chips or pap.",
    image: "assets/images/peri-chicken.svg",
    popular: true
  },
  {
    id: "l2",
    category: "lunch",
    name: "Durban beef bunny chow",
    price: 92,
    desc: "Quarter loaf packed with Durban-style beef curry and carrot salad.",
    image: "assets/images/bunny-beef.svg",
    popular: true
  },
  {
    id: "l3",
    category: "lunch",
    name: "Boerewors roll & chakalaka",
    price: 55,
    desc: "Coiled wors on a toasted roll, mustard, onion, spicy chakalaka.",
    image: "assets/images/boerewors.svg",
    popular: false
  },
  {
    id: "l4",
    category: "lunch",
    name: "Bobotie with yellow rice",
    price: 110,
    desc: "Baked spiced mince, egg custard lid, raisins, sambals, chutney.",
    image: "assets/images/bobotie.svg",
    popular: true
  },
  {
    id: "l5",
    category: "lunch",
    name: "Steak Gatsby (half)",
    price: 78,
    desc: "Cape Town classic: steak strips, slap chips, atchar, lazy sauce.",
    image: "assets/images/gatsby.svg",
    popular: false
  },
  {
    id: "l6",
    category: "lunch",
    name: "Samp, beans & stew",
    price: 72,
    desc: "Uphuthu-style samp, sugar beans, and a rich beef stew.",
    image: "assets/images/samp.svg",
    popular: false
  },
  {
    id: "d1",
    category: "dinner",
    name: "Sunday braai platter",
    price: 195,
    desc: "Boerewors, lamb chop, chicken, pap, chakalaka — feeds one hungry soul.",
    image: "assets/images/braai.svg",
    popular: true
  },
  {
    id: "d2",
    category: "dinner",
    name: "Oxtail potjie",
    price: 175,
    desc: "Slow-simmered oxtail, root veg, red wine gravy, dumplings.",
    image: "assets/images/oxtail.svg",
    popular: true
  },
  {
    id: "d3",
    category: "dinner",
    name: "Grilled kingklip",
    price: 210,
    desc: "Cape kingklip, lemon butter, seasonal greens, baby potatoes.",
    image: "assets/images/kingklip.svg",
    popular: false
  },
  {
    id: "d4",
    category: "dinner",
    name: "Chakalaka roast chicken",
    price: 125,
    desc: "Half chicken roasted over chakalaka, served with pap or rice.",
    image: "assets/images/chakalaka-chicken.svg",
    popular: false
  },
  {
    id: "d5",
    category: "dinner",
    name: "Lamb chops & pap",
    price: 185,
    desc: "Two thick chops, sheba tomato gravy, creamy pap, relish.",
    image: "assets/images/lamb-chops.svg",
    popular: false
  },
  {
    id: "d6",
    category: "dinner",
    name: "Malva pudding & custard",
    price: 48,
    desc: "Sticky apricot malva, hot vanilla custard, a scoop of ice cream.",
    image: "assets/images/malva.svg",
    popular: true
  },
  {
    id: "r1",
    category: "drinks",
    name: "Iced rooibos & lemon",
    price: 28,
    desc: "House-brewed rooibos, honey, fresh lemon, lots of ice.",
    image: "assets/images/rooibos.svg",
    popular: false
  },
  {
    id: "r2",
    category: "drinks",
    name: "Amarula milkshake",
    price: 45,
    desc: "Creamy Amarula shake — 18+ only. Ask for a virgin malt if you prefer.",
    image: "assets/images/amarula.svg",
    popular: true
  },
  {
    id: "r3",
    category: "drinks",
    name: "Homemade ginger beer",
    price: 26,
    desc: "Fiery ginger, brown sugar, naturally fizzy. Mama's recipe.",
    image: "assets/images/ginger-beer.svg",
    popular: false
  },
  {
    id: "r4",
    category: "drinks",
    name: "Mango lassi",
    price: 38,
    desc: "Ripe mango, yoghurt, a pinch of cardamom.",
    image: "assets/images/mango.svg",
    popular: false
  },
  {
    id: "r5",
    category: "drinks",
    name: "Filter coffee",
    price: 28,
    desc: "Locally roasted beans, served black or with steamed milk.",
    image: "assets/images/coffee.svg",
    popular: false
  },
  {
    id: "r6",
    category: "drinks",
    name: "Fresh granadilla juice",
    price: 32,
    desc: "Pressed granadilla, a splash of orange, no concentrate.",
    image: "assets/images/granadilla.svg",
    popular: false
  }
];

function getItemById(id) {
  return MENU.find((item) => item.id === id);
}
