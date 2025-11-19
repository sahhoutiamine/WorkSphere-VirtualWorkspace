// script.js - Refactored
let workers = [];
let currentRoomForSelection = "";

const roomCapacity = {
  conference: 10,
  reception: 3,
  server: 5,
  security: 4,
  staff: 15,
  archives: 5,
};
const roomRules = {
  reception: ["Réceptionniste"],
  server: ["Technicien IT"],
  security: ["Agent de Sécurité"],
  archives: [
    "Réceptionniste",
    "Technicien IT",
    "Agent de Sécurité",
    "Manager",
    "Employé",
  ],
};
const roomNames = {
  conference: "Salle de Conférence",
  reception: "Réception",
  server: "Salle des Serveurs",
  security: "Salle de Sécurité",
  staff: "Salle du Personnel",
  archives: "Salle d'Archives",
};
const roleClasses = {
  Réceptionniste: "role-receptionist",
  "Technicien IT": "role-it",
  "Agent de Sécurité": "role-security",
  Manager: "role-manager",
  Nettoyage: "role-cleaning",
};

// Fetch workers data
async function fetchWorkersData() {
  try {
    const response = await fetch("workers.json");
    workers = response.ok ? (await response.json()).workers : [];
  } catch (error) {
    console.error("Error loading workers data:", error);
    workers = [];
  }
  initializeApp();
}

// Utility functions
const getEl = (id) => document.getElementById(id);
const getElValue = (id) => getEl(id).value.trim();
const getRoleClass = (role) => roleClasses[role] || "role-default";
const canAssignToRoom = (role, room) =>
  ["conference", "staff"].includes(room) ||
  (room === "archives" && role !== "Nettoyage") ||
  role === "Manager" ||
  !roomRules[room] ||
  roomRules[room].includes(role);

// Validation
const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone) => /^\d{10}$/.test(phone.replace(/\s/g, "")),
  dates: (startDate, endDate) => {
    const start = new Date(startDate),
      end = new Date(endDate),
      today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today)
      return {
        isValid: false,
        message: "La date de début ne peut pas être dans le passé",
      };
    if (end < start)
      return {
        isValid: false,
        message: "La date de fin ne peut pas être avant la date de début",
      };
    return { isValid: true };
  },
};

function showError(elementOrId, message) {
  const el = typeof elementOrId === "string" ? getEl(elementOrId) : elementOrId;
  if (!el) return;
  el.classList.add("error");
  const existing = el.nextElementSibling;
  if (existing?.classList.contains("error-message")) {
    existing.textContent = message;
    return;
  }
  const errorEl = document.createElement("div");
  errorEl.className = "error-message";
  errorEl.textContent = message;
  Object.assign(errorEl.style, {
    color: "#e74c3c",
    fontSize: "12px",
    marginTop: "5px",
  });
  el.parentNode.insertBefore(errorEl, el.nextSibling);
}

function clearError(elementOrId) {
  const el = typeof elementOrId === "string" ? getEl(elementOrId) : elementOrId;
  if (!el) return;
  el.classList.remove("error");
  const errorEl = el.nextElementSibling;
  if (errorEl?.classList.contains("error-message")) errorEl.remove();
}

// Field validators with error handling
const fieldValidators = {
  workerName: (val) =>
    val ? true : (showError("workerName", "Le nom complet est requis"), false),
  workerRole: (val) =>
    val
      ? true
      : (showError("workerRole", "Veuillez sélectionner un rôle"), false),
  workerEmail: (val) => {
    if (!val) return showError("workerEmail", "L'email est requis"), false;
    if (!validators.email(val))
      return showError("workerEmail", "Veuillez entrer un email valide"), false;
    return true;
  },
  workerPhone: (val) => {
    if (!val) return showError("workerPhone", "Le téléphone est requis"), false;
    if (!validators.phone(val))
      return (
        showError(
          "workerPhone",
          "Le téléphone doit contenir exactement 10 chiffres"
        ),
        false
      );
    return true;
  },
};

function validateField(field, value) {
  clearError(field);
  return fieldValidators[field] ? fieldValidators[field](value) : true;
}

function validateExperienceFields() {
  const items = document.querySelectorAll(".experience-item");
  if (items.length === 0)
    return (
      showError(
        "experiencesList",
        "Au moins une expérience professionnelle est requise"
      ),
      false
    );

  let isValid = true;
  items.forEach((item) => {
    const fields = {
      title: item.querySelector(".exp-title"),
      company: item.querySelector(".exp-company"),
      startDate: item.querySelector(".exp-start-date"),
      endDate: item.querySelector(".exp-end-date"),
    };

    Object.values(fields).forEach((f) => clearError(f));

    if (!fields.title.value.trim()) {
      showError(fields.title, "Le poste est requis");
      isValid = false;
    }
    if (!fields.company.value.trim()) {
      showError(fields.company, "L'entreprise est requise");
      isValid = false;
    }
    if (!fields.startDate.value) {
      showError(fields.startDate, "La date de début est requise");
      isValid = false;
    }
    if (!fields.endDate.value) {
      showError(fields.endDate, "La date de fin est requise");
      isValid = false;
    }

    if (fields.startDate.value && fields.endDate.value) {
      const dateValidation = validators.dates(
        fields.startDate.value,
        fields.endDate.value
      );
      if (!dateValidation.isValid) {
        showError(fields.startDate, dateValidation.message);
        isValid = false;
      }
    }
  });
  return isValid;
}

function validateForm() {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));

  return ["workerName", "workerRole", "workerEmail", "workerPhone"]
    .map((field) => validateField(field, getElValue(field)))
    .concat(validateExperienceFields())
    .every(Boolean);
}

// Modal management
const modals = {
  open: (modalId, callback) => {
    getEl(modalId).classList.add("active");
    if (callback) callback();
  },
  close: (modalId) => {
    getEl(modalId).classList.remove("active");
    if (modalId === "addWorkerModal") {
      getEl("workerForm").reset();
      getEl("photoPreview").style.display = "none";
      getEl("experiencesList").innerHTML = "";
      document.querySelectorAll(".error-message").forEach((el) => el.remove());
      document
        .querySelectorAll(".error")
        .forEach((el) => el.classList.remove("error"));
    }
    if (modalId === "selectWorkerModal") currentRoomForSelection = "";
  },
};

// Experience management
function addExperienceField() {
  const list = getEl("experiencesList");
  const isFirst = list.children.length === 0;
  const expDiv = document.createElement("div");
  expDiv.className = "experience-item";
  expDiv.innerHTML = `
    ${
      !isFirst
        ? '<button type="button" class="remove-experience-btn">✕</button>'
        : ""
    }
    <div class="form-group"><label>Poste *</label><input type="text" class="exp-title" placeholder="Ex: Développeur Web" required></div>
    <div class="form-group"><label>Entreprise *</label><input type="text" class="exp-company" placeholder="Ex: TechCorp" required></div>
    <div class="form-group"><label>Période *</label><div class="date-period">
      <div class="date-input-group"><label class="date-label">Début</label><input type="date" class="exp-start-date" required></div>
      <div class="date-input-group"><label class="date-label">Fin</label><input type="date" class="exp-end-date" required></div>
    </div></div>`;
  list.appendChild(expDiv);

  const today = new Date().toISOString().split("T")[0];
  expDiv
    .querySelectorAll('input[type="date"]')
    .forEach((input) => (input.min = today));

  expDiv
    .querySelector(".remove-experience-btn")
    ?.addEventListener("click", function () {
      this.parentElement.remove();
      validateExperienceFields();
    });
}

// Worker management
function addWorker(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const experiences = Array.from(
    document.querySelectorAll(".experience-item")
  ).map((item) => {
    const start = new Date(item.querySelector(".exp-start-date").value);
    const end = new Date(item.querySelector(".exp-end-date").value);
    return {
      title: item.querySelector(".exp-title").value.trim(),
      company: item.querySelector(".exp-company").value.trim(),
      startDate: item.querySelector(".exp-start-date").value,
      endDate: item.querySelector(".exp-end-date").value,
      period: `${start.toLocaleDateString("fr-FR")} - ${end.toLocaleDateString(
        "fr-FR"
      )}`,
    };
  });

  const name = getElValue("workerName");
  workers.push({
    id: Date.now(),
    name,
    role: getEl("workerRole").value,
    photo:
      getElValue("workerPhoto") ||
      `https://via.placeholder.com/150/667eea/ffffff?text=${name.charAt(0)}`,
    email: getElValue("workerEmail"),
    phone: getElValue("workerPhone"),
    experiences,
    room: null,
  });

  renderUnassigned();
  modals.close("addWorkerModal");
}

// Rendering
function renderWorkerCard(w) {
  return `<div class="worker-card" data-id="${w.id}">
    <img src="${w.photo}" alt="${w.name}">
    <div class="worker-info">
      <h3>${w.name}</h3>
      <p>${w.email}</p>
      <span class="role-badge ${getRoleClass(w.role)}">${w.role}</span>
    </div>
  </div>`;
}

function renderUnassigned() {
  const list = getEl("unassignedList");
  const unassigned = workers.filter((w) => !w.room);
  list.innerHTML =
    unassigned.length === 0
      ? '<div class="empty-state">Aucun employé non assigné</div>'
      : unassigned.map(renderWorkerCard).join("");
  list
    .querySelectorAll(".worker-card")
    .forEach((card) =>
      card.addEventListener("click", () =>
        showProfile(parseInt(card.dataset.id))
      )
    );
}

function renderRoom(room) {
  const roomWorkers = workers.filter((w) => w.room === room);
  getEl(`cap-${room}`).textContent = roomWorkers.length;
  getEl(`workers-${room}`).innerHTML = roomWorkers
    .map(
      (w) =>
        `<div class="room-worker">
      <img src="${w.photo}" alt="${w.name}" data-id="${w.id}">
      <div class="room-worker-info" data-id="${w.id}"><h4>${w.name}</h4><p>${w.role}</p></div>
      <button class="remove-btn" data-id="${w.id}" title="Retirer">✕</button>
    </div>`
    )
    .join("");

  document
    .querySelectorAll(
      `#workers-${room} img, #workers-${room} .room-worker-info`
    )
    .forEach((el) =>
      el.addEventListener("click", () => showProfile(parseInt(el.dataset.id)))
    );
  document
    .querySelectorAll(`#workers-${room} .remove-btn`)
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        removeFromRoom(parseInt(btn.dataset.id))
      )
    );

  updateRoomStatus(room);
}

function updateRoomStatus(room) {
  const card = getEl(`room-${room}`);
  const needsStaff = roomRules[room] && !["conference", "staff"].includes(room);
  card.classList.toggle(
    "required-empty",
    needsStaff && !workers.some((w) => w.room === room)
  );
}

function removeFromRoom(workerId) {
  const worker = workers.find((w) => w.id === workerId);
  if (worker) {
    const oldRoom = worker.room;
    worker.room = null;
    renderUnassigned();
    if (oldRoom) renderRoom(oldRoom);
  }
}

function assignToRoom(workerId, room) {
  const worker = workers.find((w) => w.id === workerId);
  if (!worker) return;

  const currentCount = workers.filter((w) => w.room === room).length;
  if (currentCount >= roomCapacity[room]) {
    alert("Cette zone a atteint sa capacité maximale");
    return;
  }

  worker.room = room;
  renderUnassigned();
  renderRoom(room);
  modals.close("selectWorkerModal");
}

function openSelectWorkerModal(room) {
  const currentCount = workers.filter((w) => w.room === room).length;
  if (currentCount >= roomCapacity[room]) {
    alert("Cette zone a atteint sa capacité maximale");
    return;
  }

  currentRoomForSelection = room;
  const eligible = workers.filter(
    (w) => !w.room && canAssignToRoom(w.role, room)
  );
  const list = getEl("workerSelectList");

  list.innerHTML =
    eligible.length === 0
      ? '<div class="empty-state">Aucun employé éligible pour cette zone</div>'
      : eligible.map(renderWorkerCard).join("");

  list
    .querySelectorAll(".worker-card")
    .forEach((card) =>
      card.addEventListener("click", () =>
        assignToRoom(parseInt(card.dataset.id), room)
      )
    );

  modals.open("selectWorkerModal");
}

function showProfile(workerId) {
  const worker = workers.find((w) => w.id === workerId);
  if (!worker) return;

  const experiencesHTML =
    worker.experiences.length > 0
      ? worker.experiences
          .map(
            (exp) =>
              `<div class="info-row"><div class="info-label">${exp.title}</div>
        <div class="info-value">${exp.company} (${exp.period})</div></div>`
          )
          .join("")
      : '<div class="info-row"><div class="info-value">Aucune expérience renseignée</div></div>';

  getEl("profileContent").innerHTML = `
    <div class="profile-header">
      <img src="${worker.photo}" alt="${worker.name}"><h2>${worker.name}</h2>
      <span class="role-badge ${getRoleClass(
        worker.role
      )}" style="font-size: 14px; padding: 8px 16px;">${worker.role}</span>
    </div>
    <div class="profile-info">
      <div class="info-row"><div class="info-label">Email</div><div class="info-value">${
        worker.email
      }</div></div>
      <div class="info-row"><div class="info-label">Téléphone</div><div class="info-value">${
        worker.phone
      }</div></div>
      <div class="info-row"><div class="info-label">Localisation</div>
        <div class="info-value">${
          worker.room ? roomNames[worker.room] : "Non assigné"
        }</div></div>
    </div>
    <div class="profile-info">
      <h3 style="margin-bottom: 15px; color: #495057;">Expériences Professionnelles</h3>
      ${experiencesHTML}
    </div>`;

  modals.open("profileModal");
}

// Event listeners
function setupEventListeners() {
  getEl("addWorkerBtn").addEventListener("click", () =>
    modals.open("addWorkerModal", addExperienceField)
  );
  ["addWorkerModal", "profileModal", "selectWorkerModal"].forEach((modal) =>
    getEl(
      `close${
        modal.charAt(0).toUpperCase() + modal.slice(1).replace("Modal", "Modal")
      }`
    ).addEventListener("click", () => modals.close(modal))
  );
  getEl("workerForm").addEventListener("submit", addWorker);
  getEl("workerPhoto").addEventListener("change", function () {
    const preview = getEl("photoPreview");
    preview.src = this.value;
    preview.style.display = this.value ? "block" : "none";
  });
  getEl("addExperienceBtn").addEventListener("click", addExperienceField);

  document
    .querySelectorAll(".add-to-room-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        openSelectWorkerModal(btn.dataset.room)
      )
    );

  ["workerName", "workerRole", "workerEmail", "workerPhone"].forEach((field) =>
    getEl(field).addEventListener("blur", function () {
      validateField(field, this.value.trim());
    })
  );

  document.querySelectorAll(".modal").forEach((modal) =>
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modals.close(modal.id);
    })
  );
}

// Initialize
function initializeApp() {
  setupEventListeners();
  renderUnassigned();
  [
    "conference",
    "reception",
    "server",
    "security",
    "staff",
    "archives",
  ].forEach(renderRoom);
}

fetchWorkersData();
