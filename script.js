/**
 * Portal de Papá — Main Application Script
 * Vanilla JS single-page app with localStorage persistence.
 */

// ==========================================================================
// --- Configuration ---
// ==========================================================================

const ROUTES = {
  home: "/",
  garage: "/garage",
  tools: "/caja-de-herramientas",
  family: "/familia"
};

const ROUTE_SECTIONS = {
  [ROUTES.home]: ["hero", "dashboard"],
  [ROUTES.garage]: ["garage"],
  [ROUTES.tools]: ["herramientas"],
  [ROUTES.family]: ["familia"]
};

/** Add family photo filenames here when you drop images in images/assets/ */
const FAMILY_IMAGES = [
  "images/assets/family-01.jpg",
  "images/assets/family-02.jpg",
  "images/assets/family-03.jpg",
  "images/assets/family-04.jpg",
  "images/assets/family-05.jpg",
  "images/assets/family-06.jpg",
  "images/assets/family-07.jpg",
  "images/assets/family-08.jpg",
  "images/assets/family-09.jpg",
  "images/assets/family-10.jpg",
  "images/assets/family-11.jpg",
  "images/assets/family-12.jpg",
  "images/assets/family-13.jpg",
  "images/assets/family-14.jpg",
  "images/assets/family-15.jpg",
  "images/assets/family-16.jpg"
];

const STORAGE_KEYS = {
  vehicles: "portalPapa_vehicles",
  toolPrefs: "portalPapa_toolPrefs"
};

const MAINTENANCE_CATEGORIES = [
  { key: "mileage", label: "Registro de kilometraje" },
  { key: "oil", label: "Cambios de aceite" },
  { key: "battery", label: "Reemplazo de batería" },
  { key: "filters", label: "Filtros" },
  { key: "sparkPlugs", label: "Bujías" },
  { key: "diskBrakes", label: "Discos de freno" },
  { key: "brakePads", label: "Pastillas de freno" }
];

const STATUS_OPTIONS = [
  { value: "ok", label: "O.K." },
  { value: "soon", label: "Change soon" },
  { value: "urgent", label: "Urgent" },
  { value: "extreme", label: "Extremely urgent" }
];

// E12 standard resistor values (ohms)
const E12_VALUES = [
  10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82,
  100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820,
  1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200,
  10000, 12000, 15000, 18000, 22000, 27000, 33000, 39000, 47000, 56000, 68000, 82000,
  100000, 120000, 150000, 180000, 220000, 270000, 330000, 390000, 470000, 560000, 680000, 820000,
  1000000
];

// AWG wire data: [diameter mm, area mm², ampacity A]
const AWG_TABLE = {
  0: [8.25, 53.5, 150], 1: [7.35, 42.4, 130], 2: [6.54, 33.6, 115],
  3: [5.83, 26.7, 100], 4: [5.19, 21.2, 85], 5: [4.62, 16.8, 75],
  6: [4.11, 13.3, 65], 7: [3.67, 10.5, 55], 8: [3.26, 8.37, 50],
  9: [2.91, 6.63, 45], 10: [2.59, 5.26, 40], 11: [2.30, 4.17, 35],
  12: [2.05, 3.31, 30], 13: [1.83, 2.62, 25], 14: [1.63, 2.08, 20],
  15: [1.45, 1.65, 18], 16: [1.29, 1.31, 15], 17: [1.15, 1.04, 14],
  18: [1.02, 0.823, 12], 19: [0.912, 0.653, 10], 20: [0.812, 0.518, 10],
  21: [0.723, 0.410, 9], 22: [0.644, 0.326, 7], 23: [0.573, 0.258, 7],
  24: [0.511, 0.205, 5], 25: [0.455, 0.163, 5], 26: [0.405, 0.129, 4],
  27: [0.361, 0.102, 4], 28: [0.321, 0.0810, 3], 29: [0.286, 0.0642, 3],
  30: [0.255, 0.0509, 2.5], 31: [0.227, 0.0404, 2], 32: [0.202, 0.0320, 2],
  33: [0.180, 0.0254, 1.5], 34: [0.160, 0.0201, 1.5], 35: [0.143, 0.0160, 1],
  36: [0.127, 0.0127, 1], 37: [0.113, 0.0100, 1], 38: [0.101, 0.00797, 0.8],
  39: [0.090, 0.00632, 0.8], 40: [0.080, 0.00501, 0.5]
};

const RESISTOR_COLORS = [
  { name: "Negro", hex: "#1a1a1a", digit: 0, mult: 1, tol: null },
  { name: "Marrón", hex: "#8B4513", digit: 1, mult: 10, tol: 1 },
  { name: "Rojo", hex: "#CC0000", digit: 2, mult: 100, tol: 2 },
  { name: "Naranja", hex: "#FF8C00", digit: 3, mult: 1000, tol: null },
  { name: "Amarillo", hex: "#FFD700", digit: 4, mult: 10000, tol: null },
  { name: "Verde", hex: "#228B22", digit: 5, mult: 100000, tol: 0.5 },
  { name: "Azul", hex: "#0047AB", digit: 6, mult: 1000000, tol: 0.25 },
  { name: "Violeta", hex: "#8B008B", digit: 7, mult: 10000000, tol: 0.1 },
  { name: "Gris", hex: "#808080", digit: 8, mult: 100000000, tol: 0.05 },
  { name: "Blanco", hex: "#F5F5F5", digit: 9, mult: 1000000000, tol: null },
  { name: "Dorado", hex: "#DAA520", digit: null, mult: 0.1, tol: 5 },
  { name: "Plateado", hex: "#C0C0C0", digit: null, mult: 0.01, tol: 10 }
];

const UNIT_DEFINITIONS = {
  length: {
    m: 1, ft: 0.3048, in: 0.0254, mm: 0.001, cm: 0.01, km: 1000, mi: 1609.344
  },
  temperature: { C: "C", F: "F", K: "K" },
  pressure: {
    Pa: 1, psi: 6894.76, bar: 100000, atm: 101325, kPa: 1000
  }
};

// ==========================================================================
// --- Storage ---
// ==========================================================================

// ==========================================================================
// --- Routing ---
// ==========================================================================

function initRouter() {
  window.addEventListener("popstate", handlePopState);
  handleInitialRoute();
}

function handleInitialRoute() {
  const path = window.location.pathname.replace(/\/index\.html$/, "") || "/";
  renderRoute(path);
}

function handlePopState() {
  const path = window.location.pathname;
  renderRoute(path);
}

function navigateTo(route) {
  window.history.pushState({}, "", route);
  renderRoute(route);
}

function renderRoute(path) {
  const normalizedPath = path.replace(/\/index\.html$/, "") || "/";
  
  // Hide all sections first
  document.querySelectorAll(".section, .hero").forEach(el => {
    el.hidden = true;
  });

  // Show sections for current route
  const sectionsToShow = ROUTE_SECTIONS[normalizedPath] || ROUTE_SECTIONS[ROUTES.home];
  sectionsToShow.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) section.hidden = false;
  });

  // Update active nav
  const routeKey = Object.keys(ROUTES).find(key => ROUTES[key] === normalizedPath) || "home";
  setActiveNav(routeKey);

  // Render dashboard if on home
  if (normalizedPath === ROUTES.home) {
    renderDashboard();
  }
}

function getGarageSummary() {
  const total = vehicles.length;
  const lastVehicle = vehicles.length > 0 ? vehicles[vehicles.length - 1] : null;
  return { total, lastVehicle };
}

function getToolList() {
  return [
    "Ley de Ohm",
    "Calculadora de potencia",
    "Conversor de unidades",
    "Calibre de cable (AWG)",
    "Resistencia para LED",
    "Código de colores"
  ];
}

function getFamilyPhotoCount() {
  return FAMILY_IMAGES.filter(img => img).length;
}

function renderDashboard() {
  const dashboardGrid = document.getElementById("dashboard-grid");
  if (!dashboardGrid) return;

  const garageSummary = getGarageSummary();
  const tools = getToolList();
  const photoCount = getFamilyPhotoCount();

  dashboardGrid.innerHTML = `
    <!-- Garage Card -->
    <article class="dashboard-card">
      <div class="dashboard-card__header">
        <h3 class="dashboard-card__title">Garage</h3>
        <span class="dashboard-card__icon" aria-hidden="true">&#128663;</span>
      </div>
      <div class="dashboard-card__stat">${garageSummary.total}</div>
      <div class="dashboard-card__stat-label">Vehículos registrados</div>
      <p class="dashboard-card__content">
        ${garageSummary.lastVehicle 
          ? `Último agregado: ${escapeHtml(garageSummary.lastVehicle.brand)} ${escapeHtml(garageSummary.lastVehicle.model)}`
          : "No hay vehículos registrados"}
      </p>
      <button type="button" class="btn btn--primary" onclick="navigateTo('${ROUTES.garage}')">Ir al Garage</button>
    </article>

    <!-- Tools Card -->
    <article class="dashboard-card">
      <div class="dashboard-card__header">
        <h3 class="dashboard-card__title">Caja de herramientas</h3>
        <span class="dashboard-card__icon" aria-hidden="true">&#128295;</span>
      </div>
      <div class="dashboard-card__stat">${tools.length}</div>
      <div class="dashboard-card__stat-label">Herramientas disponibles</div>
      <p class="dashboard-card__content">
        ${tools.join(" · ")}
      </p>
      <button type="button" class="btn btn--primary" onclick="navigateTo('${ROUTES.tools}')">Abrir Herramientas</button>
    </article>

    <!-- Family Card -->
    <article class="dashboard-card">
      <div class="dashboard-card__header">
        <h3 class="dashboard-card__title">Familia</h3>
        <span class="dashboard-card__icon" aria-hidden="true">&#128247;</span>
      </div>
      <div class="dashboard-card__stat">${photoCount}</div>
      <div class="dashboard-card__stat-label">Fotografías</div>
      <div class="dashboard-card__preview">
        ${FAMILY_IMAGES.slice(0, 9).map((img, i) => 
          img ? `<img src="${img}" alt="Foto ${i + 1}" loading="lazy">` : '<div class="empty-slot"></div>'
        ).join('')}
      </div>
      <button type="button" class="btn btn--primary" onclick="navigateTo('${ROUTES.family}')">Ver Galería</button>
    </article>
  `;
}

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function createDefaultMaintenance() {
  const maintenance = {};
  MAINTENANCE_CATEGORIES.forEach(({ key }) => {
    maintenance[key] = key === "mileage"
      ? { status: "ok", entries: [] }
      : { status: "ok" };
  });
  return maintenance;
}

function loadVehicles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.vehicles);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVehicles(vehicles) {
  try {
    localStorage.setItem(STORAGE_KEYS.vehicles, JSON.stringify(vehicles));
  } catch (e) {
    alert("No se pudo guardar. El almacenamiento local puede estar lleno. Intenta con una imagen más pequeña.");
    console.error("localStorage save failed:", e);
  }
}

function loadToolPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.toolPrefs);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToolPrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEYS.toolPrefs, JSON.stringify(prefs));
  } catch {
    /* non-critical */
  }
}

let toolPrefs = loadToolPrefs();
let savePrefsTimer = null;

function debouncedSavePrefs() {
  clearTimeout(savePrefsTimer);
  savePrefsTimer = setTimeout(() => saveToolPrefs(toolPrefs), 400);
}

// ==========================================================================
// --- Image Compression ---
// localStorage is ~5MB; compress uploads to ~800px max width, JPEG 0.8
// ==========================================================================

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==========================================================================
// --- Garage ---
// ==========================================================================

let vehicles = loadVehicles();
let pendingImageData = null;

const vehicleList = document.getElementById("vehicle-list");
const garageEmpty = document.getElementById("garage-empty");
const vehicleModal = document.getElementById("vehicle-modal");
const vehicleForm = document.getElementById("vehicle-form");
const modalTitle = document.getElementById("modal-title");
const vehicleIdInput = document.getElementById("vehicle-id");
const vehicleBrandInput = document.getElementById("vehicle-brand");
const vehicleModelInput = document.getElementById("vehicle-model");
const vehicleYearInput = document.getElementById("vehicle-year");
const vehicleNotesInput = document.getElementById("vehicle-notes");
const vehicleImageInput = document.getElementById("vehicle-image");
const imagePreview = document.getElementById("image-preview");
const previewImg = document.getElementById("preview-img");

function renderVehicles() {
  vehicleList.innerHTML = "";

  if (vehicles.length === 0) {
    garageEmpty.hidden = false;
    return;
  }

  garageEmpty.hidden = true;

  vehicles.forEach((vehicle) => {
    const card = document.createElement("article");
    card.className = "vehicle-card" + (vehicle.expanded ? " is-expanded" : "");
    card.setAttribute("role", "listitem");
    card.dataset.id = vehicle.id;

    const thumbHtml = vehicle.imageData
      ? `<img class="vehicle-card__thumb" src="${vehicle.imageData}" alt="${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.model)}">`
      : `<div class="vehicle-card__thumb vehicle-card__thumb--placeholder" aria-hidden="true">&#128663;</div>`;

    const title = `${vehicle.brand} ${vehicle.model}`;
    const meta = vehicle.year ? `Año ${vehicle.year}` : "";

    card.innerHTML = `
      <div class="vehicle-card__header" data-action="toggle">
        ${thumbHtml}
        <div class="vehicle-card__info">
          <h3 class="vehicle-card__title">${escapeHtml(title)}</h3>
          <p class="vehicle-card__meta">${escapeHtml(meta)}</p>
        </div>
        <div class="vehicle-card__actions">
          <button type="button" class="btn-icon" data-action="edit" aria-label="Editar ${escapeHtml(title)}">&#9998;</button>
          <button type="button" class="btn-icon btn-icon--danger" data-action="delete" aria-label="Eliminar ${escapeHtml(title)}">&#128465;</button>
        </div>
        <span class="vehicle-card__chevron" aria-hidden="true"></span>
      </div>
      <div class="vehicle-card__body-wrap">
        <div class="vehicle-card__body">
          <div class="vehicle-card__body-inner">
            ${vehicle.notes ? `<p class="vehicle-card__notes">${escapeHtml(vehicle.notes)}</p>` : ""}
            <div class="maintenance-list">
              ${MAINTENANCE_CATEGORIES.map(({ key, label }) => `
                <div class="maintenance-row">
                  <span class="maintenance-row__label">${label}</span>
                  <div class="status-group" role="radiogroup" aria-label="${label}" data-category="${key}">
                    ${STATUS_OPTIONS.map(({ value, label: statusLabel }) => `
                      <button type="button"
                        class="status-btn${vehicle.maintenance[key]?.status === value ? " status-btn--active" : ""}"
                        data-status="${value}"
                        data-vehicle="${vehicle.id}"
                        data-category="${key}"
                        role="radio"
                        aria-checked="${vehicle.maintenance[key]?.status === value}">
                        ${statusLabel}
                      </button>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    vehicleList.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function openVehicleModal(vehicle = null) {
  pendingImageData = vehicle?.imageData || null;
  vehicleIdInput.value = vehicle?.id || "";
  vehicleBrandInput.value = vehicle?.brand || "";
  vehicleModelInput.value = vehicle?.model || "";
  vehicleYearInput.value = vehicle?.year || "";
  vehicleNotesInput.value = vehicle?.notes || "";
  vehicleImageInput.value = "";

  modalTitle.textContent = vehicle ? "Editar vehículo" : "Nuevo vehículo";

  if (pendingImageData) {
    previewImg.src = pendingImageData;
    imagePreview.hidden = false;
  } else {
    previewImg.src = "";
    imagePreview.hidden = true;
  }

  vehicleModal.showModal();
  vehicleBrandInput.focus();
}

function closeVehicleModal() {
  vehicleModal.close();
  pendingImageData = null;
}

function addVehicle(data) {
  const vehicle = {
    id: generateId(),
    brand: data.brand,
    model: data.model,
    year: data.year,
    notes: data.notes,
    imageData: data.imageData || "",
    maintenance: createDefaultMaintenance(),
    expanded: false
  };
  vehicles.push(vehicle);
  saveVehicles(vehicles);
  renderVehicles();
}

function updateVehicle(id, data) {
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return;
  vehicles[index] = {
    ...vehicles[index],
    brand: data.brand,
    model: data.model,
    year: data.year,
    notes: data.notes,
    imageData: data.imageData !== undefined ? data.imageData : vehicles[index].imageData
  };
  saveVehicles(vehicles);
  renderVehicles();
}

function deleteVehicle(id) {
  vehicles = vehicles.filter((v) => v.id !== id);
  saveVehicles(vehicles);
  renderVehicles();
}

function setMaintenanceStatus(vehicleId, category, status) {
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle || !vehicle.maintenance[category]) return;
  vehicle.maintenance[category].status = status;
  saveVehicles(vehicles);
  renderVehicles();
}

function toggleVehicleExpanded(id) {
  const vehicle = vehicles.find((v) => v.id === id);
  if (!vehicle) return;
  vehicle.expanded = !vehicle.expanded;
  saveVehicles(vehicles);
  renderVehicles();
}

// Garage event listeners
document.getElementById("btn-add-vehicle").addEventListener("click", () => openVehicleModal());

document.getElementById("modal-close").addEventListener("click", closeVehicleModal);
document.getElementById("modal-cancel").addEventListener("click", closeVehicleModal);

vehicleModal.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeVehicleModal();
});

vehicleImageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    pendingImageData = await compressImage(file);
    previewImg.src = pendingImageData;
    imagePreview.hidden = false;
  } catch {
    alert("No se pudo procesar la imagen.");
  }
});

vehicleForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const brand = vehicleBrandInput.value.trim();
  const model = vehicleModelInput.value.trim();
  if (!brand || !model) return;

  const data = {
    brand,
    model,
    year: vehicleYearInput.value.trim(),
    notes: vehicleNotesInput.value.trim(),
    imageData: pendingImageData || ""
  };

  const editId = vehicleIdInput.value;
  if (editId) {
    const existing = vehicles.find((v) => v.id === editId);
    if (existing && !pendingImageData && existing.imageData) {
      data.imageData = existing.imageData;
    }
    updateVehicle(editId, data);
  } else {
    addVehicle(data);
  }

  closeVehicleModal();
});

vehicleList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) {
    const statusBtn = e.target.closest(".status-btn");
    if (statusBtn) {
      const { vehicle, category, status } = statusBtn.dataset;
      setMaintenanceStatus(vehicle, category, status);
    }
    return;
  }

  const card = btn.closest(".vehicle-card");
  const id = card?.dataset.id;
  if (!id) return;

  const action = btn.dataset.action;

  if (action === "toggle") {
    if (e.target.closest(".vehicle-card__actions")) return;
    toggleVehicleExpanded(id);
  } else if (action === "edit") {
    e.stopPropagation();
    const vehicle = vehicles.find((v) => v.id === id);
    if (vehicle) openVehicleModal(vehicle);
  } else if (action === "delete") {
    e.stopPropagation();
    const vehicle = vehicles.find((v) => v.id === id);
    const name = vehicle ? `${vehicle.brand} ${vehicle.model}` : "este vehículo";
    if (confirm(`¿Eliminar ${name}? Esta acción no se puede deshacer.`)) {
      deleteVehicle(id);
    }
  }
});

// ==========================================================================
// --- Caja de herramientas ---
// ==========================================================================

// --- Ohm's Law ---
const ohmSolve = document.getElementById("ohm-solve");
const ohmA = document.getElementById("ohm-a");
const ohmB = document.getElementById("ohm-b");
const ohmResult = document.getElementById("ohm-result");

function resetOhms() {
  ohmA.value = "";
  ohmB.value = "";
  ohmResult.textContent = "—";
}

function calcOhms() {
  const solve = ohmSolve.value;
  const a = parseFloat(ohmA.value);
  const b = parseFloat(ohmB.value);

  if (isNaN(a) || isNaN(b)) {
    ohmResult.textContent = "—";
    return;
  }

  let result, unit;
  if (solve === "V") {
    result = a * b;
    unit = "V";
  } else if (solve === "I") {
    if (b === 0) { ohmResult.textContent = "División por cero"; return; }
    result = a / b;
    unit = "A";
  } else {
    if (b === 0) { ohmResult.textContent = "División por cero"; return; }
    result = a / b;
    unit = "Ω";
  }

  ohmResult.textContent = `${formatNum(result)} ${unit}`;
  toolPrefs.ohmSolve = solve;
  debouncedSavePrefs();
}

function updateOhmLabels() {
  const solve = ohmSolve.value;
  const labels = { V: ["Corriente (A)", "Resistencia (Ω)"], I: ["Voltaje (V)", "Resistencia (Ω)"], R: ["Voltaje (V)", "Corriente (A)"] };
  const [l1, l2] = labels[solve];
  ohmA.previousElementSibling.textContent = l1;
  ohmB.previousElementSibling.textContent = l2;
}

ohmSolve.addEventListener("change", () => { updateOhmLabels(); calcOhms(); });
ohmA.addEventListener("input", calcOhms);
ohmB.addEventListener("input", calcOhms);

// --- Power Calculator ---
const powerMode = document.getElementById("power-mode");
const powerA = document.getElementById("power-a");
const powerB = document.getElementById("power-b");
const powerALabel = document.getElementById("power-a-label");
const powerBLabel = document.getElementById("power-b-label");
const powerResult = document.getElementById("power-result");

function resetPower() {
  powerA.value = "";
  powerB.value = "";
  powerResult.textContent = "—";
}

function updatePowerLabels() {
  const mode = powerMode.value;
  const labels = {
    vi: ["Voltaje (V)", "Corriente (A)"],
    i2r: ["Corriente (A)", "Resistencia (Ω)"],
    v2r: ["Voltaje (V)", "Resistencia (Ω)"]
  };
  const [l1, l2] = labels[mode];
  powerALabel.textContent = l1;
  powerBLabel.textContent = l2;
}

function calcPower() {
  const mode = powerMode.value;
  const a = parseFloat(powerA.value);
  const b = parseFloat(powerB.value);

  if (isNaN(a) || isNaN(b)) {
    powerResult.textContent = "—";
    return;
  }

  let result;
  if (mode === "vi") {
    result = a * b;
  } else if (mode === "i2r") {
    result = a * a * b;
  } else {
    if (b === 0) { powerResult.textContent = "División por cero"; return; }
    result = (a * a) / b;
  }

  powerResult.textContent = `${formatNum(result)} W`;
  toolPrefs.powerMode = mode;
  debouncedSavePrefs();
}

powerMode.addEventListener("change", () => { updatePowerLabels(); calcPower(); });
powerA.addEventListener("input", calcPower);
powerB.addEventListener("input", calcPower);

// --- Unit Converter ---
const unitCategory = document.getElementById("unit-category");
const unitFrom = document.getElementById("unit-from");
const unitTo = document.getElementById("unit-to");
const unitValue = document.getElementById("unit-value");
const unitResult = document.getElementById("unit-result");

function resetUnits() {
  unitValue.value = "";
  unitResult.textContent = "—";
}

function populateUnitSelects() {
  const cat = unitCategory.value;
  const units = Object.keys(UNIT_DEFINITIONS[cat]);
  unitFrom.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join("");
  unitTo.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join("");
  if (units.length > 1) unitTo.selectedIndex = 1;
}

function convertTemperature(value, from, to) {
  let celsius;
  if (from === "C") celsius = value;
  else if (from === "F") celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === "C") return celsius;
  if (to === "F") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

function calcUnits() {
  const cat = unitCategory.value;
  const from = unitFrom.value;
  const to = unitTo.value;
  const val = parseFloat(unitValue.value);

  if (isNaN(val)) {
    unitResult.textContent = "—";
    return;
  }

  let result;
  if (cat === "temperature") {
    result = convertTemperature(val, from, to);
  } else {
    const base = val * UNIT_DEFINITIONS[cat][from];
    result = base / UNIT_DEFINITIONS[cat][to];
  }

  unitResult.textContent = `${formatNum(result)} ${to}`;
  toolPrefs.unitCategory = cat;
  toolPrefs.unitFrom = from;
  toolPrefs.unitTo = to;
  debouncedSavePrefs();
}

unitCategory.addEventListener("change", () => { populateUnitSelects(); calcUnits(); });
unitFrom.addEventListener("change", calcUnits);
unitTo.addEventListener("change", calcUnits);
unitValue.addEventListener("input", calcUnits);

// --- Wire Gauge ---
const wireAwg = document.getElementById("wire-awg");
const wireResult = document.getElementById("wire-result");

function resetWire() {
  wireAwg.value = "";
  wireResult.textContent = "—";
}

function calcWire() {
  const awg = parseInt(wireAwg.value, 10);
  if (isNaN(awg) || !(awg in AWG_TABLE)) {
    wireResult.textContent = "—";
    return;
  }
  const [diam, area, amp] = AWG_TABLE[awg];
  wireResult.textContent = `Ø ${diam} mm · ${area} mm² · ~${amp} A`;
}

wireAwg.addEventListener("input", calcWire);

// --- LED Resistor ---
const ledVsupply = document.getElementById("led-vsupply");
const ledVf = document.getElementById("led-vf");
const ledIf = document.getElementById("led-if");
const ledResult = document.getElementById("led-result");

function resetLed() {
  ledVsupply.value = "";
  ledVf.value = "";
  ledIf.value = "";
  ledResult.textContent = "—";
}

function nearestE12(value) {
  if (value <= 0) return 0;
  let closest = E12_VALUES[0];
  let minDiff = Math.abs(value - closest);
  for (const v of E12_VALUES) {
    const diff = Math.abs(value - v);
    if (diff < minDiff) {
      minDiff = diff;
      closest = v;
    }
  }
  return closest;
}

function formatResistor(ohms) {
  if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(ohms % 1000000 === 0 ? 0 : 1)} MΩ`;
  if (ohms >= 1000) return `${(ohms / 1000).toFixed(ohms % 1000 === 0 ? 0 : 1)} kΩ`;
  return `${ohms} Ω`;
}

function calcLed() {
  const vs = parseFloat(ledVsupply.value);
  const vf = parseFloat(ledVf.value);
  const imA = parseFloat(ledIf.value);

  if (isNaN(vs) || isNaN(vf) || isNaN(imA) || imA === 0) {
    ledResult.textContent = "—";
    return;
  }

  const iA = imA / 1000;
  const rExact = (vs - vf) / iA;
  if (rExact <= 0) {
    ledResult.textContent = "Fuente insuficiente para el LED";
    return;
  }

  const rStd = nearestE12(rExact);
  const pW = iA * iA * rStd;
  ledResult.textContent = `R = ${formatNum(rExact)} Ω → estándar ${formatResistor(rStd)} · Potencia ≥ ${formatNum(pW * 1.5)} W`;
}

ledVsupply.addEventListener("input", calcLed);
ledVf.addEventListener("input", calcLed);
ledIf.addEventListener("input", calcLed);

// --- Resistor Color Code ---
const resBand1 = document.getElementById("res-band1");
const resBand2 = document.getElementById("res-band2");
const resBand3 = document.getElementById("res-band3");
const resBand4 = document.getElementById("res-band4");
const resistorResult = document.getElementById("resistor-result");
const bandEls = [
  document.getElementById("band-1"),
  document.getElementById("band-2"),
  document.getElementById("band-3"),
  document.getElementById("band-4")
];

const DIGIT_COLORS = RESISTOR_COLORS.filter((c) => c.digit !== null);
const TOL_COLORS = RESISTOR_COLORS.filter((c) => c.tol !== null);

function resetResistor() {
  resBand1.selectedIndex = 0;
  resBand2.selectedIndex = 0;
  resBand3.selectedIndex = 0;
  resBand4.selectedIndex = 0;
  resistorResult.textContent = "—";
  bandEls.forEach(el => el.style.background = "");
}

function populateResistorSelects() {
  resBand1.innerHTML = DIGIT_COLORS.map((c, i) => `<option value="${i}">${c.name}</option>`).join("");
  resBand2.innerHTML = DIGIT_COLORS.map((c, i) => `<option value="${i}">${c.name}</option>`).join("");
  resBand3.innerHTML = RESISTOR_COLORS.map((c, i) => `<option value="${i}">${c.name} (×${c.mult})</option>`).join("");
  resBand4.innerHTML = TOL_COLORS.map((c, i) => `<option value="${i}">${c.name} (±${c.tol}%)</option>`).join("");
}

function calcResistor() {
  const i1 = parseInt(resBand1.value, 10);
  const i2 = parseInt(resBand2.value, 10);
  const i3 = parseInt(resBand3.value, 10);
  const i4 = parseInt(resBand4.value, 10);

  const c1 = DIGIT_COLORS[i1];
  const c2 = DIGIT_COLORS[i2];
  const c3 = RESISTOR_COLORS[i3];
  const c4 = TOL_COLORS[i4];

  bandEls[0].style.background = c1.hex;
  bandEls[1].style.background = c2.hex;
  bandEls[2].style.background = c3.hex;
  bandEls[3].style.background = c4.hex;

  const ohms = (c1.digit * 10 + c2.digit) * c3.mult;
  resistorResult.textContent = `${formatResistor(ohms)} ±${c4.tol}%`;
}

[resBand1, resBand2, resBand3, resBand4].forEach((el) => {
  el.addEventListener("change", calcResistor);
});

// Reset button event listeners
document.getElementById("reset-ohms").addEventListener("click", resetOhms);
document.getElementById("reset-power").addEventListener("click", resetPower);
document.getElementById("reset-units").addEventListener("click", resetUnits);
document.getElementById("reset-wire").addEventListener("click", resetWire);
document.getElementById("reset-led").addEventListener("click", resetLed);
document.getElementById("reset-resistor").addEventListener("click", resetResistor);

// ==========================================================================
// --- Familia Gallery ---
// ==========================================================================

const familyGallery = document.getElementById("family-gallery");

function renderFamilyGallery() {
  familyGallery.innerHTML = "";

  // Always create 16 slots for 4x4 grid
  for (let i = 0; i < 16; i++) {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";
    figure.setAttribute("role", "listitem");

    const src = FAMILY_IMAGES[i];
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Familia ${i + 1}`;
      img.loading = "lazy";
      figure.appendChild(img);
    }
    // Empty slots remain empty (no placeholder content)

    familyGallery.appendChild(figure);
  }
}

// ==========================================================================
// --- Navigation ---
// ==========================================================================

const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveNav(routeKey) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === routeKey;
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function closeMobileNav() {
  navToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("is-open");
}

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", !expanded);
  mainNav.classList.toggle("is-open", !expanded);
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const routeKey = link.dataset.section;
    const route = ROUTES[routeKey];
    if (route) {
      navigateTo(route);
    }
    closeMobileNav();
  });
});

// ==========================================================================
// --- Utilities ---
// ==========================================================================

function formatNum(n) {
  if (Math.abs(n) >= 1000000 || (Math.abs(n) < 0.001 && n !== 0)) {
    return n.toExponential(2);
  }
  if (Math.abs(n) >= 100) return n.toFixed(1);
  if (Math.abs(n) >= 10) return n.toFixed(2);
  return n.toFixed(3).replace(/\.?0+$/, "");
}

function restoreToolPrefs() {
  if (toolPrefs.ohmSolve) {
    ohmSolve.value = toolPrefs.ohmSolve;
    updateOhmLabels();
  }
  if (toolPrefs.powerMode) {
    powerMode.value = toolPrefs.powerMode;
    updatePowerLabels();
  }
  if (toolPrefs.unitCategory) {
    unitCategory.value = toolPrefs.unitCategory;
    populateUnitSelects();
    if (toolPrefs.unitFrom) unitFrom.value = toolPrefs.unitFrom;
    if (toolPrefs.unitTo) unitTo.value = toolPrefs.unitTo;
  }
}

// ==========================================================================
// --- Init ---
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  renderVehicles();
  renderFamilyGallery();
  populateUnitSelects();
  populateResistorSelects();
  restoreToolPrefs();

  updateOhmLabels();
  calcOhms();
  calcPower();
  calcUnits();
  calcWire();
  calcLed();
  calcResistor();

  initRouter();
});
