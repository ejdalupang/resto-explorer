// Your evergreen list.
// - cuisine: descriptive label shown on the card
// - cuisineGroup: broader bucket used for the cuisine filter dropdown
// - category: "Meal" or "Dessert", used for the meal/dessert filter
// - dishes: specific foods this place is known for, used so search (e.g. "chicken",
//   "steak") can surface it even when the cuisine label doesn't say so. Best-effort
//   guesses — correct them via a card's Edit panel if wrong.
// All fields (plus area/address/hours/price/notes) can also be overridden per-item
// from the app itself (saved on your phone).
const EVERGREENS = [
  { id: "nan-ban-tei", name: "Nan Ban Tei", cuisine: "Japanese (Yakitori)", cuisineGroup: "Japanese", category: "Meal", dishes: "yakitori, chicken skewers, grilled chicken" },
  { id: "nihon-bashi-tei", name: "Nihon Bashi Tei", cuisine: "Japanese", cuisineGroup: "Japanese", category: "Meal", dishes: "sushi, sashimi, tempura, udon" },
  { id: "botejyu", name: "Botejyu", cuisine: "Japanese (Okonomiyaki)", cuisineGroup: "Japanese", category: "Meal", dishes: "okonomiyaki, yakisoba, takoyaki, pork" },
  { id: "ramen-nagi", name: "Ramen Nagi", cuisine: "Japanese (Ramen)", cuisineGroup: "Japanese", category: "Meal", dishes: "ramen, pork, chashu, noodles" },
  { id: "mendokoro", name: "Mendokoro", cuisine: "Japanese (Ramen)", cuisineGroup: "Japanese", category: "Meal", dishes: "ramen, tsukemen, pork, noodles" },
  { id: "soban", name: "Soban", cuisine: "Korean", cuisineGroup: "Korean", category: "Meal", dishes: "korean bbq, samgyupsal, pork belly, beef, kimchi" },
  { id: "ginos-pizza", name: "Gino's Pizza", cuisine: "Pizza / Italian", cuisineGroup: "Italian", category: "Meal", dishes: "pizza, pasta" },
  { id: "chatter-box", name: "Chatter Box", cuisine: "International", cuisineGroup: "International", category: "Meal", dishes: "buffet, steak, seafood, pasta, chicken" },
  { id: "paradise-dynasty", name: "Paradise Dynasty", cuisine: "Chinese", cuisineGroup: "Chinese", category: "Meal", dishes: "xiao long bao, dumplings, noodles, pork" },
  { id: "shi-lin", name: "Shi Lin", cuisine: "Taiwanese Street Food", cuisineGroup: "Taiwanese", category: "Meal", dishes: "fried chicken, popcorn chicken, bubble tea" },
  { id: "nanyang", name: "Nanyang", cuisine: "Singaporean / Malaysian", cuisineGroup: "Singaporean / Malaysian", category: "Meal", dishes: "laksa, chicken rice, satay, chicken, noodles" },
  { id: "racks", name: "Racks", cuisine: "American BBQ", cuisineGroup: "American", category: "Meal", dishes: "ribs, pork ribs, chicken, bbq" },
  { id: "texas-roadhouse", name: "Texas Roadhouse", cuisine: "American Steakhouse", cuisineGroup: "American", category: "Meal", dishes: "steak, ribs, chicken, sirloin, beef" },
  { id: "itallianis", name: "Itallianni's", cuisine: "Italian", cuisineGroup: "Italian", category: "Meal", dishes: "pasta, pizza, lasagna, chicken parmigiana" },
  { id: "8cuts", name: "8Cuts", cuisine: "Steakhouse / Burgers", cuisineGroup: "American", category: "Meal", dishes: "steak, burgers, beef" },
  { id: "manam", name: "Manam", cuisine: "Filipino", cuisineGroup: "Filipino", category: "Meal", dishes: "sisig, crispy pata, adobo, pork, chicken inasal" },
  { id: "mesa", name: "Mesa", cuisine: "Filipino", cuisineGroup: "Filipino", category: "Meal", dishes: "kare-kare, adobo, lechon kawali, pork, chicken" },
  { id: "uncle-mos", name: "Uncle Mo's", cuisine: "Chicken / BBQ", cuisineGroup: "Filipino", category: "Meal", dishes: "fried chicken, chicken" },
  { id: "hosseins", name: "Hossein's", cuisine: "Persian / Middle Eastern", cuisineGroup: "Middle Eastern", category: "Meal", dishes: "kebab, lamb, chicken, rice" },
  { id: "lugang", name: "Lugang", cuisine: "Taiwanese / Chinese", cuisineGroup: "Taiwanese", category: "Meal", dishes: "beef noodle soup, dumplings, fried chicken, beef" },
  { id: "yabu", name: "YABU", cuisine: "Japanese (Tonkatsu)", cuisineGroup: "Japanese", category: "Meal", dishes: "tonkatsu, pork cutlet, katsu, chicken katsu, pork" },
  { id: "ramen-kuroda", name: "Ramen Kuroda", cuisine: "Japanese (Ramen)", cuisineGroup: "Japanese", category: "Meal", dishes: "ramen, pork, noodles" },
  { id: "mazza", name: "Mazza", cuisine: "Lebanese / Middle Eastern", cuisineGroup: "Middle Eastern", category: "Meal", dishes: "kebab, hummus, lamb, chicken shawarma" },
  { id: "pinks-hotdog", name: "Pink's Hotdog", cuisine: "American Hotdogs", cuisineGroup: "American", category: "Meal", dishes: "hotdogs, sausage" },
  { id: "pound", name: "Pound", cuisine: "Burgers", cuisineGroup: "American", category: "Meal", dishes: "burgers, beef, fries" },
  { id: "ooma", name: "OOMA", cuisine: "Japanese (Izakaya)", cuisineGroup: "Japanese", category: "Meal", dishes: "sushi, sashimi, chicken karaage, izakaya small plates" },
  { id: "mediterranean-cafe", name: "Mediterranean Café", cuisine: "Mediterranean", cuisineGroup: "Mediterranean", category: "Meal", dishes: "shawarma, hummus, kebab, lamb, chicken" },
  { id: "bom-gosto", name: "Bom Gosto", cuisine: "Brazilian", cuisineGroup: "Brazilian", category: "Meal", dishes: "churrasco, grilled meats, steak, picanha, beef" },
  { id: "salad-stop", name: "Salad Stop", cuisine: "Salads / Healthy", cuisineGroup: "Healthy", category: "Meal", dishes: "salad, grilled chicken, quinoa, chicken" },
  { id: "cyma", name: "CYMA", cuisine: "Greek", cuisineGroup: "Greek", category: "Meal", dishes: "souvlaki, gyro, lamb, chicken, moussaka" },
  { id: "mr-kabab", name: "Mr. Kabab", cuisine: "Middle Eastern", cuisineGroup: "Middle Eastern", category: "Meal", dishes: "kebab, lamb, chicken, rice" },
  { id: "ember", name: "Ember", cuisine: "Filipino Grill", cuisineGroup: "Filipino", category: "Meal", dishes: "inasal, grilled chicken, pork bbq, chicken" },
  { id: "made-nice", name: "Made Nice", cuisine: "Filipino / International", cuisineGroup: "Filipino", category: "Meal", dishes: "comfort food, pasta, rice meals, chicken" },
];

// Preset search centers for discovery + default map view, grouped by region
// for the "More areas" picker. Coordinates are approximate city/town centers.
// radius (meters) controls how far Discover searches around that point — dense
// Metro Manila districts stay walkable-sized (1.5km); spread-out, car-based
// towns in the outer provinces get a much wider net (8km) since a single point
// can't otherwise cover a town that stretches for kilometers along a highway
// (e.g. Tagaytay — this is why Antonio's was missing before this fix).
const AREAS = {
  bgc: { label: "BGC, Taguig", lat: 14.5508, lng: 121.0509, region: "Metro Manila", radius: 1500 },
  makati: { label: "Makati", lat: 14.5547, lng: 121.0244, region: "Metro Manila", radius: 1500 },
  manila: { label: "Manila", lat: 14.5995, lng: 120.9842, region: "Metro Manila", radius: 1500 },
  quezon_city: { label: "Quezon City", lat: 14.676, lng: 121.0437, region: "Metro Manila", radius: 1500 },
  pasig: { label: "Pasig / Ortigas", lat: 14.5764, lng: 121.0851, region: "Metro Manila", radius: 1500 },
  mandaluyong: { label: "Mandaluyong", lat: 14.5794, lng: 121.0359, region: "Metro Manila", radius: 1500 },
  san_juan: { label: "San Juan", lat: 14.6019, lng: 121.0355, region: "Metro Manila", radius: 1500 },
  marikina: { label: "Marikina", lat: 14.6507, lng: 121.1029, region: "Metro Manila", radius: 1500 },
  pasay: { label: "Pasay", lat: 14.5378, lng: 121.0014, region: "Metro Manila", radius: 1500 },
  paranaque: { label: "Parañaque", lat: 14.4793, lng: 121.0198, region: "Metro Manila", radius: 1500 },
  las_pinas: { label: "Las Piñas", lat: 14.4499, lng: 120.9829, region: "Metro Manila", radius: 1500 },
  muntinlupa: { label: "Muntinlupa / Alabang", lat: 14.4081, lng: 121.0415, region: "Metro Manila", radius: 1500 },
  caloocan: { label: "Caloocan", lat: 14.6488, lng: 120.9673, region: "Metro Manila", radius: 1500 },
  malabon: { label: "Malabon", lat: 14.6681, lng: 120.9569, region: "Metro Manila", radius: 1500 },
  navotas: { label: "Navotas", lat: 14.6667, lng: 120.9437, region: "Metro Manila", radius: 1500 },
  valenzuela: { label: "Valenzuela", lat: 14.7, lng: 120.983, region: "Metro Manila", radius: 1500 },
  pateros: { label: "Pateros", lat: 14.5445, lng: 121.0687, region: "Metro Manila", radius: 1500 },

  tagaytay: { label: "Tagaytay", lat: 14.1153, lng: 120.9621, region: "Cavite", radius: 8000 },
  bacoor: { label: "Bacoor", lat: 14.4624, lng: 120.8967, region: "Cavite", radius: 8000 },
  imus: { label: "Imus", lat: 14.4297, lng: 120.9367, region: "Cavite", radius: 8000 },
  dasmarinas: { label: "Dasmariñas", lat: 14.3294, lng: 120.9367, region: "Cavite", radius: 8000 },
  general_trias: { label: "General Trias", lat: 14.386, lng: 120.8809, region: "Cavite", radius: 8000 },
  silang: { label: "Silang", lat: 14.2333, lng: 120.9667, region: "Cavite", radius: 8000 },

  batangas_city: { label: "Batangas City", lat: 13.7565, lng: 121.0583, region: "Batangas", radius: 8000 },
  lipa: { label: "Lipa", lat: 13.9411, lng: 121.1622, region: "Batangas", radius: 8000 },
  nasugbu: { label: "Nasugbu", lat: 14.0736, lng: 120.6319, region: "Batangas", radius: 8000 },

  malolos: { label: "Malolos", lat: 14.8433, lng: 120.8114, region: "Bulacan", radius: 8000 },
  san_jose_del_monte: { label: "San Jose del Monte", lat: 14.8136, lng: 121.0453, region: "Bulacan", radius: 8000 },
  marilao: { label: "Marilao", lat: 14.7575, lng: 120.9481, region: "Bulacan", radius: 8000 },

  san_fernando_pampanga: { label: "San Fernando", lat: 15.0286, lng: 120.6898, region: "Pampanga", radius: 8000 },
  angeles: { label: "Angeles", lat: 15.145, lng: 120.5887, region: "Pampanga", radius: 8000 },
  clark: { label: "Clark", lat: 15.1855, lng: 120.5364, region: "Pampanga", radius: 8000 },
};
