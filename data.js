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

// Preset search centers for discovery + default map view.
const AREAS = {
  bgc: { label: "BGC", lat: 14.5508, lng: 121.0509 },
  makati: { label: "Makati", lat: 14.5547, lng: 121.0244 },
};
