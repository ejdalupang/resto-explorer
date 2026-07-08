const STORAGE_KEY = "bgc-makati-eats-v1";
const THEME_KEY = "bgc-makati-theme";
const CATEGORIES = ["Meal", "Dessert"];

function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyThemeIcon() {
  document.getElementById("theme-toggle").textContent = getTheme() === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  applyThemeIcon();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { evergreens: {}, discovered: [] };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const state = loadState();
let evergreenFilter = { cuisineGroup: "all", category: "all" };
let discoverFilter = { cuisineGroup: "all", category: "all" };
let foodQuery = ""; // shared between Home and Discover so it doesn't reset when switching tabs
let lastDiscoverResults = [];
let lastDiscoverAreaLabel = "";

function googleMapsLink(name, area) {
  const q = encodeURIComponent(`${name} ${area || ""} Philippines`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function reviewsLink(name, area) {
  const q = encodeURIComponent(`${name} ${area || ""} Philippines reviews`);
  return `https://www.google.com/search?q=${q}`;
}

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("geocode failed");
  const data = await res.json();
  if (!data.length) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    address: data[0].display_name,
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getEvergreenData(id) {
  return state.evergreens[id] || {};
}

function setEvergreenData(id, patch) {
  state.evergreens[id] = { ...getEvergreenData(id), ...patch };
  saveState();
}

function getCuisine(item, data) {
  return (data && data.cuisine) || item.cuisine || "Unspecified";
}

function getCuisineGroup(item, data) {
  return (data && data.cuisineGroup) || item.cuisineGroup || "Other";
}

function getCategory(item, data) {
  return (data && data.category) || item.category || "Meal";
}

function getDishes(item, data) {
  return (data && data.dishes) || item.dishes || "";
}

// OpenStreetMap almost never tags a restaurant with the literal dish/protein a
// diner searches for ("pork", "beef") — it tags the cuisine ("korean", "hotpot").
// This maps common food searches to the cuisine tags that plausibly serve them,
// so Discover search isn't limited to exact substring matches on sparse tags.
const FOOD_SYNONYMS = {
  pork: ["korean", "chinese", "filipino", "barbecue", "bbq", "hotpot", "vietnamese", "taiwanese", "hongkong"],
  beef: ["steak", "korean", "japanese", "american", "brazilian", "burger", "hotpot", "vietnamese"],
  chicken: ["chicken", "fried_chicken", "korean", "filipino", "kebab", "american", "wings"],
  lamb: ["kebab", "middle_eastern", "greek", "indian", "turkish", "persian", "lebanese"],
  seafood: ["seafood", "sushi", "japanese", "fish"],
  fish: ["seafood", "sushi", "fish_and_chips", "japanese"],
  noodles: ["noodle", "ramen", "chinese", "vietnamese", "thai", "asian", "pho"],
  rice: ["asian", "filipino", "chinese", "japanese", "korean"],
  vegetarian: ["vegetarian", "vegan", "salad", "indian"],
  spicy: ["korean", "thai", "indian", "sichuan", "mexican"],
};

function titleCase(str) {
  return str
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Best-effort guess for OSM discover results — cuisine/amenity tags aren't
// reliable, so this is meant to be corrected via Edit after adding.
function classifyCategory(tags) {
  const cuisine = (tags.cuisine || "").toLowerCase();
  const dessertKeywords = [
    "ice_cream", "dessert", "bakery", "confectionery", "bubble_tea",
    "chocolate", "donut", "cake", "pastry", "coffee_shop",
  ];
  if (dessertKeywords.some((k) => cuisine.includes(k))) return "Dessert";
  if (tags.amenity === "cafe" && !cuisine) return "Dessert";
  return "Meal";
}

// Bold flat-color palette — same cuisine group always maps to the same color.
const PALETTE = [
  { bg: "#B18CFF", text: "#1f1147" },
  { bg: "#D7F26D", text: "#24310a" },
  { bg: "#4C5CF0", text: "#ffffff" },
  { bg: "#FF6A3D", text: "#2b0e02" },
  { bg: "#FF7FB6", text: "#3a0d1f" },
  { bg: "#33C7B5", text: "#04302b" },
  { bg: "#FFD93D", text: "#3a2c00" },
  { bg: "#FF5A5F", text: "#ffffff" },
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function colorFor(key) {
  return PALETTE[hashString(key) % PALETTE.length];
}

function populateFilterOptions(selectEl, groups, current) {
  const options = ["all", ...groups];
  selectEl.innerHTML = options
    .map(
      (g) =>
        `<option value="${g}" ${g === current ? "selected" : ""}>${
          g === "all" ? "All cuisines" : g
        }</option>`
    )
    .join("");
}

function populateAreaSelect() {
  const select = document.getElementById("area-select");
  const regions = {};
  Object.entries(AREAS).forEach(([key, area]) => {
    if (!regions[area.region]) regions[area.region] = [];
    regions[area.region].push({ key, label: area.label });
  });
  const placeholder = select.querySelector("option");
  select.innerHTML = "";
  select.appendChild(placeholder);
  Object.keys(regions).forEach((region) => {
    const group = document.createElement("optgroup");
    group.label = region;
    regions[region].forEach(({ key, label }) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = label;
      group.appendChild(option);
    });
    select.appendChild(group);
  });
}

function renderEvergreens() {
  const list = document.getElementById("evergreen-list");
  const cuisineSelect = document.getElementById("cuisine-filter-evergreen");

  const groups = [
    ...new Set(EVERGREENS.map((item) => getCuisineGroup(item, getEvergreenData(item.id)))),
  ].sort();
  populateFilterOptions(cuisineSelect, groups, evergreenFilter.cuisineGroup);

  list.innerHTML = "";
  const query = foodQuery.trim().toLowerCase();
  const filtered = EVERGREENS.filter((item) => {
    const data = getEvergreenData(item.id);
    const groupOk =
      evergreenFilter.cuisineGroup === "all" ||
      getCuisineGroup(item, data) === evergreenFilter.cuisineGroup;
    const catOk =
      evergreenFilter.category === "all" ||
      getCategory(item, data) === evergreenFilter.category;
    const textOk =
      !query ||
      [
        item.name,
        getCuisine(item, data),
        getCuisineGroup(item, data),
        getDishes(item, data),
        data.notes || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    return groupOk && catOk && textOk;
  });

  if (!filtered.length) {
    list.innerHTML = `<div class="status">No evergreens match this filter yet.</div>`;
  }

  filtered.forEach((item) => {
    const data = getEvergreenData(item.id);
    const cuisine = getCuisine(item, data);
    const cuisineGroup = getCuisineGroup(item, data);
    const category = getCategory(item, data);
    const dishes = getDishes(item, data);
    const color = colorFor(cuisineGroup);
    const card = document.createElement("div");
    card.className = "card";
    card.style.background = color.bg;
    card.style.color = color.text;
    card.innerHTML = `
      <div class="card-head">
        <h3>${item.name}</h3>
        ${data.area ? `<span class="badge">${data.area}</span>` : ""}
      </div>
      <div class="tags">
        <span class="tag">${cuisine}</span>
        <span class="tag">${category}</span>
      </div>
      ${
        data.address || data.hours || data.price || data.notes || dishes
          ? `<div class="meta">
              ${data.address ? `<div>📍 ${data.address}</div>` : ""}
              ${data.hours ? `<div>🕒 ${data.hours}</div>` : ""}
              ${data.price ? `<div>💰 ${data.price}</div>` : ""}
              ${dishes ? `<div>🍽️ ${dishes}</div>` : ""}
              ${data.notes ? `<div>📝 ${data.notes}</div>` : ""}
            </div>`
          : `<div class="meta">📍 No address saved yet — tap ✎ to add details</div>`
      }
      <div class="card-actions">
        <a class="icon-btn" target="_blank" href="${reviewsLink(item.name, data.area || "BGC Makati")}" aria-label="See reviews">★</a>
        <a class="icon-btn" target="_blank" href="${googleMapsLink(item.name, data.area || "BGC Makati")}" aria-label="Open in Google Maps">➜</a>
        <button class="icon-btn edit-toggle" data-id="${item.id}" aria-label="Edit">✎</button>
      </div>
      <div class="edit-form" id="form-${item.id}">
        <select data-field="area">
          <option value="BGC" ${data.area === "BGC" ? "selected" : ""}>BGC</option>
          <option value="Makati" ${data.area === "Makati" ? "selected" : ""}>Makati</option>
        </select>
        <input data-field="cuisine" placeholder="Cuisine label e.g. Japanese Ramen" value="${cuisine}">
        <input data-field="cuisineGroup" placeholder="Cuisine group for filtering e.g. Japanese" value="${cuisineGroup}">
        <input data-field="dishes" placeholder="Dishes, comma-separated e.g. chicken, ramen, pork" value="${dishes}">
        <select data-field="category">
          ${CATEGORIES.map(
            (c) => `<option value="${c}" ${category === c ? "selected" : ""}>${c}</option>`
          ).join("")}
        </select>
        <input data-field="address" placeholder="Address / mall / branch" value="${data.address || ""}">
        <button type="button" class="locate-inline locate" data-id="${item.id}">🔍 Look up address</button>
        <input data-field="hours" placeholder="Opening hours e.g. 11am-10pm daily" value="${data.hours || ""}">
        <input data-field="price" placeholder="Price range e.g. ₱₱ (₱300-600/head)" value="${data.price || ""}">
        <textarea data-field="notes" placeholder="Notes / go-to order">${data.notes || ""}</textarea>
        <button class="save" data-id="${item.id}">Save</button>
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll(".edit-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById(`form-${btn.dataset.id}`).classList.toggle("open");
    });
  });

  list.querySelectorAll(".save").forEach((btn) => {
    btn.addEventListener("click", () => {
      const form = document.getElementById(`form-${btn.dataset.id}`);
      const patch = {};
      form.querySelectorAll("[data-field]").forEach((el) => {
        patch[el.dataset.field] = el.value.trim();
      });
      setEvergreenData(btn.dataset.id, patch);
      renderEvergreens();
    });
  });

  list.querySelectorAll(".locate").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.textContent = "Looking up…";
      const status = document.getElementById("evergreen-status");
      const item = EVERGREENS.find((e) => e.id === btn.dataset.id);
      const data = getEvergreenData(item.id);
      const area = data.area || "BGC";
      try {
        const found = await geocode(`${item.name}, ${area}, Metro Manila, Philippines`);
        if (found) {
          setEvergreenData(item.id, { address: found.address });
          status.textContent = "";
          renderEvergreens();
        } else {
          status.textContent = `Couldn't find "${item.name}" on OpenStreetMap — fill in the address manually instead.`;
        }
      } catch (e) {
        status.textContent = "Lookup failed — check your connection and try again.";
      }
      btn.textContent = "🔍 Look up address";
    });
  });
}

async function locateAllEvergreens() {
  const status = document.getElementById("evergreen-status");
  for (const item of EVERGREENS) {
    const data = getEvergreenData(item.id);
    if (data.address) continue;
    status.textContent = `Looking up ${item.name}…`;
    try {
      const found = await geocode(`${item.name}, ${data.area || "BGC"}, Metro Manila, Philippines`);
      if (found) setEvergreenData(item.id, { address: found.address });
    } catch (e) {}
    await sleep(1100); // respect Nominatim's 1 req/sec usage policy
  }
  status.textContent = "Done looking up what OpenStreetMap could find.";
  renderEvergreens();
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

async function runOverpassQuery(lat, lng, radius) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|cafe|fast_food"](around:${radius},${lat},${lng});
      way["amenity"~"restaurant|cafe|fast_food"](around:${radius},${lat},${lng});
    );
    out center tags;
  `;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  if (!res.ok) throw new Error("overpass failed");
  return res.json();
}

function isKnownEvergreen(name) {
  const lower = name.toLowerCase();
  return EVERGREENS.some(
    (e) =>
      lower.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(lower)
  );
}

async function discover(areaKeyOrCenter) {
  const status = document.getElementById("discover-status");
  const list = document.getElementById("discover-list");
  list.innerHTML = "";
  status.textContent = "Searching OpenStreetMap for nearby places…";
  discoverFilter = { cuisineGroup: "all", category: "all" };

  const area =
    typeof areaKeyOrCenter === "string" ? AREAS[areaKeyOrCenter] : areaKeyOrCenter;
  const radius = area.radius || 1500;

  try {
    const data = await runOverpassQuery(area.lat, area.lng, radius);
    const seen = new Set();
    const results = [];
    for (const el of data.elements) {
      const tags = el.tags || {};
      const name = tags.name;
      if (!name || seen.has(name)) continue;
      if (isKnownEvergreen(name)) continue;
      seen.add(name);
      const lat = el.lat || (el.center && el.center.lat);
      const lng = el.lon || (el.center && el.center.lon);
      if (!lat || !lng) continue;
      const addrParts = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean);
      const rawCuisine = tags.cuisine || tags.amenity;
      results.push({
        name,
        cuisine: rawCuisine ? titleCase(rawCuisine) : "Unspecified",
        cuisineGroup: rawCuisine ? titleCase(rawCuisine.split(";")[0]) : "Other",
        category: classifyCategory(tags),
        hours: tags.opening_hours,
        website: tags.website || tags["contact:website"],
        address: addrParts.join(" "),
        lat,
        lng,
        distance: haversine(area.lat, area.lng, lat, lng),
      });
    }
    results.sort((a, b) => a.distance - b.distance);
    lastDiscoverResults = results;
    lastDiscoverAreaLabel = area.label;
    renderDiscoverResults();
  } catch (e) {
    status.textContent = "Search failed — check your connection and try again.";
  }
}

function renderDiscoverResults() {
  const list = document.getElementById("discover-list");
  const cuisineSelect = document.getElementById("cuisine-filter-discover");
  const groups = [...new Set(lastDiscoverResults.map((r) => r.cuisineGroup))].sort();
  populateFilterOptions(cuisineSelect, groups, discoverFilter.cuisineGroup);

  list.innerHTML = "";

  const query = foodQuery.trim().toLowerCase();
  const synonyms = query
    .split(/\s+/)
    .flatMap((word) => FOOD_SYNONYMS[word] || []);
  const filtered = lastDiscoverResults.filter((r) => {
    const groupOk =
      discoverFilter.cuisineGroup === "all" || r.cuisineGroup === discoverFilter.cuisineGroup;
    const catOk = discoverFilter.category === "all" || r.category === discoverFilter.category;
    const haystack = [r.name, r.cuisine, r.cuisineGroup].join(" ").toLowerCase();
    const textOk =
      !query || haystack.includes(query) || synonyms.some((s) => haystack.includes(s));
    return groupOk && catOk && textOk;
  });

  const status = document.getElementById("discover-status");
  const isFiltered =
    discoverFilter.cuisineGroup !== "all" || discoverFilter.category !== "all" || !!query;
  status.textContent = isFiltered
    ? `Showing ${filtered.length} of ${lastDiscoverResults.length} spot(s) near ${lastDiscoverAreaLabel} matching this filter.`
    : `Found ${lastDiscoverResults.length} spot(s) near ${lastDiscoverAreaLabel} not already in your evergreen list.`;

  if (!filtered.length) {
    list.innerHTML = `<div class="status">No results match this filter.</div>`;
  }

  filtered.slice(0, 40).forEach((r) => {
    const color = colorFor(r.cuisineGroup);
    const card = document.createElement("div");
    card.className = "card";
    card.style.background = color.bg;
    card.style.color = color.text;
    card.innerHTML = `
      <div class="card-head">
        <h3>${r.name}</h3>
        <span class="badge">~${r.distance.toFixed(1)} km</span>
      </div>
      <div class="tags">
        <span class="tag">${r.cuisine}</span>
        <span class="tag">${r.category}</span>
      </div>
      <div class="meta">
        ${r.address ? `<div>📍 ${r.address}</div>` : ""}
        ${r.hours ? `<div>🕒 ${r.hours}</div>` : `<div>🕒 Hours not listed on OSM — check Google Maps</div>`}
      </div>
      <div class="card-actions">
        ${r.website ? `<a class="icon-btn" target="_blank" href="${r.website}" aria-label="Website">🌐</a>` : ""}
        <a class="icon-btn" target="_blank" href="${reviewsLink(r.name, lastDiscoverAreaLabel)}" aria-label="See reviews">★</a>
        <a class="icon-btn" target="_blank" href="${googleMapsLink(r.name, lastDiscoverAreaLabel)}" aria-label="Open in Google Maps">➜</a>
        <button class="add-evergreen icon-btn">+ Add</button>
      </div>
    `;
    card.querySelector(".add-evergreen").addEventListener("click", () => {
      const id = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (!EVERGREENS.find((e) => e.id === id)) {
        EVERGREENS.push({
          id,
          name: r.name,
          cuisine: r.cuisine,
          cuisineGroup: r.cuisineGroup,
          category: r.category,
        });
      }
      setEvergreenData(id, {
        address: r.address,
        hours: r.hours,
        area: lastDiscoverAreaLabel,
      });
      renderEvergreens();
      switchTab("evergreens");
      card.querySelector(".add-evergreen").textContent = "Added ✓";
      card.querySelector(".add-evergreen").disabled = true;
    });
    list.appendChild(card);
  });
}

function switchTab(tab) {
  document.querySelectorAll(".bottom-nav button[data-tab]").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab)
  );
  document.querySelectorAll(".view").forEach((v) =>
    v.classList.toggle("active", v.id === `view-${tab}`)
  );
}

function openSheet() {
  document.getElementById("settings-sheet").classList.add("open");
  document.getElementById("settings-backdrop").classList.add("open");
}

function closeSheet() {
  document.getElementById("settings-sheet").classList.remove("open");
  document.getElementById("settings-backdrop").classList.remove("open");
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "explo-resto-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const status = document.getElementById("evergreen-status");
    try {
      const parsed = JSON.parse(reader.result);
      state.evergreens = { ...state.evergreens, ...(parsed.evergreens || {}) };
      saveState();
      renderEvergreens();
      status.textContent = "Import complete.";
    } catch (e) {
      status.textContent = "That file didn't look right — import skipped.";
    }
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  applyThemeIcon();
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  renderEvergreens();

  document.querySelectorAll(".bottom-nav button[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("settings-toggle").addEventListener("click", openSheet);
  document.getElementById("settings-backdrop").addEventListener("click", closeSheet);

  document.getElementById("locate-all").addEventListener("click", () => {
    closeSheet();
    locateAllEvergreens();
  });

  populateAreaSelect();

  function clearButtonActiveStates() {
    document
      .querySelectorAll(".discover-controls button")
      .forEach((b) => b.classList.remove("active"));
  }

  document.querySelectorAll(".discover-controls button[data-area]").forEach((btn) => {
    btn.addEventListener("click", () => {
      clearButtonActiveStates();
      btn.classList.add("active");
      document.getElementById("area-select").selectedIndex = 0;
      discover(btn.dataset.area);
    });
  });

  document.getElementById("use-location").addEventListener("click", () => {
    const status = document.getElementById("discover-status");
    if (!navigator.geolocation) {
      status.textContent = "Your browser doesn't support location access.";
      return;
    }
    clearButtonActiveStates();
    document.getElementById("use-location").classList.add("active");
    document.getElementById("area-select").selectedIndex = 0;
    status.textContent = "Getting your location…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        discover({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: "your location",
        });
      },
      () => {
        status.textContent =
          "Couldn't get your location — check your browser's location permission and try again.";
      },
      { timeout: 10000 }
    );
  });

  document.getElementById("area-select").addEventListener("change", (e) => {
    if (!e.target.value) return;
    clearButtonActiveStates();
    discover(e.target.value);
  });

  document.getElementById("cuisine-filter-evergreen").addEventListener("change", (e) => {
    evergreenFilter.cuisineGroup = e.target.value;
    renderEvergreens();
  });
  document.querySelectorAll("#category-filter-evergreen button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("#category-filter-evergreen button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      evergreenFilter.category = btn.dataset.cat;
      renderEvergreens();
    });
  });

  document.getElementById("cuisine-filter-discover").addEventListener("change", (e) => {
    discoverFilter.cuisineGroup = e.target.value;
    renderDiscoverResults();
  });
  document.querySelectorAll("#category-filter-discover button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("#category-filter-discover button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      discoverFilter.category = btn.dataset.cat;
      renderDiscoverResults();
    });
  });

  document.getElementById("export-btn").addEventListener("click", exportData);
  document.getElementById("import-input").addEventListener("change", (e) => {
    if (e.target.files[0]) importData(e.target.files[0]);
    closeSheet();
  });

  document.getElementById("food-search-evergreen").addEventListener("input", (e) => {
    foodQuery = e.target.value;
    document.getElementById("food-search-discover").value = foodQuery;
    renderEvergreens();
    if (lastDiscoverResults.length) renderDiscoverResults();
  });
  document.getElementById("food-search-discover").addEventListener("input", (e) => {
    foodQuery = e.target.value;
    document.getElementById("food-search-evergreen").value = foodQuery;
    renderEvergreens();
    if (lastDiscoverResults.length) renderDiscoverResults();
  });
});
