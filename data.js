// Your evergreen list.
// - cuisine: descriptive label shown on the card
// - cuisineGroup: broader bucket used for the cuisine filter dropdown
// - category: "Meal" or "Dessert", used for the meal/dessert filter
// All three (plus area/address/hours/price/notes) can also be overridden per-item from the app itself (saved on your phone).
const EVERGREENS = [
  { id: "nan-ban-tei", name: "Nan Ban Tei", cuisine: "Japanese (Yakitori)", cuisineGroup: "Japanese", category: "Meal" },
  { id: "nihon-bashi-tei", name: "Nihon Bashi Tei", cuisine: "Japanese", cuisineGroup: "Japanese", category: "Meal" },
  { id: "botejyu", name: "Botejyu", cuisine: "Japanese (Okonomiyaki)", cuisineGroup: "Japanese", category: "Meal" },
  { id: "ramen-nagi", name: "Ramen Nagi", cuisine: "Japanese (Ramen)", cuisineGroup: "Japanese", category: "Meal" },
  { id: "mendokoro", name: "Mendokoro", cuisine: "Japanese (Ramen)", cuisineGroup: "Japanese", category: "Meal" },
  { id: "soban", name: "Soban", cuisine: "Korean", cuisineGroup: "Korean", category: "Meal" },
  { id: "ginos-pizza", name: "Gino's Pizza", cuisine: "Pizza / Italian", cuisineGroup: "Italian", category: "Meal" },
  { id: "chatter-box", name: "Chatter Box", cuisine: "International", cuisineGroup: "International", category: "Meal" },
  { id: "paradise-dynasty", name: "Paradise Dynasty", cuisine: "Chinese", cuisineGroup: "Chinese", category: "Meal" },
  { id: "shi-lin", name: "Shi Lin", cuisine: "Taiwanese Street Food", cuisineGroup: "Taiwanese", category: "Meal" },
  { id: "nanyang", name: "Nanyang", cuisine: "Singaporean / Malaysian", cuisineGroup: "Singaporean / Malaysian", category: "Meal" },
  { id: "racks", name: "Racks", cuisine: "American BBQ", cuisineGroup: "American", category: "Meal" },
  { id: "texas-roadhouse", name: "Texas Roadhouse", cuisine: "American Steakhouse", cuisineGroup: "American", category: "Meal" },
  { id: "itallianis", name: "Itallianni's", cuisine: "Italian", cuisineGroup: "Italian", category: "Meal" },
  { id: "8cuts", name: "8Cuts", cuisine: "Steakhouse / Burgers", cuisineGroup: "American", category: "Meal" },
  { id: "manam", name: "Manam", cuisine: "Filipino", cuisineGroup: "Filipino", category: "Meal" },
  { id: "mesa", name: "Mesa", cuisine: "Filipino", cuisineGroup: "Filipino", category: "Meal" },
  { id: "uncle-mos", name: "Uncle Mo's", cuisine: "Chicken / BBQ", cuisineGroup: "Filipino", category: "Meal" },
  { id: "hosseins", name: "Hossein's", cuisine: "Persian / Middle Eastern", cuisineGroup: "Middle Eastern", category: "Meal" },
  { id: "lugang", name: "Lugang", cuisine: "Taiwanese / Chinese", cuisineGroup: "Taiwanese", category: "Meal" },
  { id: "yabu", name: "YABU", cuisine: "Japanese (Tonkatsu)", cuisineGroup: "Japanese", category: "Meal" },
  { id: "ramen-kuroda", name: "Ramen Kuroda", cuisine: "Japanese (Ramen)", cuisineGroup: "Japanese", category: "Meal" },
  { id: "mazza", name: "Mazza", cuisine: "Lebanese / Middle Eastern", cuisineGroup: "Middle Eastern", category: "Meal" },
  { id: "pinks-hotdog", name: "Pink's Hotdog", cuisine: "American Hotdogs", cuisineGroup: "American", category: "Meal" },
  { id: "pound", name: "Pound", cuisine: "Burgers", cuisineGroup: "American", category: "Meal" },
  { id: "ooma", name: "OOMA", cuisine: "Japanese (Izakaya)", cuisineGroup: "Japanese", category: "Meal" },
  { id: "mediterranean-cafe", name: "Mediterranean Café", cuisine: "Mediterranean", cuisineGroup: "Mediterranean", category: "Meal" },
  { id: "bom-gosto", name: "Bom Gosto", cuisine: "Brazilian", cuisineGroup: "Brazilian", category: "Meal" },
  { id: "salad-stop", name: "Salad Stop", cuisine: "Salads / Healthy", cuisineGroup: "Healthy", category: "Meal" },
  { id: "cyma", name: "CYMA", cuisine: "Greek", cuisineGroup: "Greek", category: "Meal" },
  { id: "mr-kabab", name: "Mr. Kabab", cuisine: "Middle Eastern", cuisineGroup: "Middle Eastern", category: "Meal" },
  { id: "ember", name: "Ember", cuisine: "Filipino Grill", cuisineGroup: "Filipino", category: "Meal" },
  { id: "made-nice", name: "Made Nice", cuisine: "Filipino / International", cuisineGroup: "Filipino", category: "Meal" },
];

// Preset search centers for discovery + default map view.
const AREAS = {
  bgc: { label: "BGC", lat: 14.5508, lng: 121.0509 },
  makati: { label: "Makati", lat: 14.5547, lng: 121.0244 },
};
