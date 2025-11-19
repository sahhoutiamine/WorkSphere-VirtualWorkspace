// script.js
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
  conference: null,
  staff: null,
  archives: [
    "Réceptionniste",
    "Technicien IT",
    "Agent de Sécurité",
    "Manager",
    "Employé",
  ],
};

// Fetch workers data from JSON file
async function fetchWorkersData() {
  try {
    const response = await fetch("workers.json");
    if (!response.ok) {
      throw new Error("Failed to fetch workers data");
    }
    const data = await response.json();
    workers = data.workers;
    initializeApp();
  } catch (error) {
    console.error("Error loading workers data:", error);
    // Fallback to empty array if fetch fails
    workers = [];
    initializeApp();
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Add worker button
  document
    .getElementById("addWorkerBtn")
    .addEventListener("click", openAddWorkerModal);

  // Close modal buttons
  document
    .getElementById("closeAddWorkerModal")
    .addEventListener("click", closeAddWorkerModal);
  document
    .getElementById("closeProfileModal")
    .addEventListener("click", closeProfileModal);
  document
    .getElementById("closeSelectWorkerModal")
    .addEventListener("click", closeSelectWorkerModal);

  // Form submission
  document.getElementById("workerForm").addEventListener("submit", addWorker);

  // Photo preview
  document
    .getElementById("workerPhoto")
    .addEventListener("change", previewPhoto);

  // Add experience button
  document
    .getElementById("addExperienceBtn")
    .addEventListener("click", addExperienceField);

  // Add to room buttons
  document.querySelectorAll(".add-to-room-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const room = this.getAttribute("data-room");
      openSelectWorkerModal(room);
    });
  });

  // Close modals on outside click
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (event) {
      if (event.target === this) {
        this.classList.remove("active");
      }
    });
  });

  // Setup blur event validation
  setupBlurValidation();
}

// Setup blur event validation for form fields
function setupBlurValidation() {
  // Name field
  document.getElementById("workerName").addEventListener("blur", function () {
    validateNameField(this.value.trim());
  });

  // Role field
  document.getElementById("workerRole").addEventListener("blur", function () {
    validateRoleField(this.value);
  });

  // Email field
  document.getElementById("workerEmail").addEventListener("blur", function () {
    validateEmailField(this.value.trim());
  });

  // Phone field
  document.getElementById("workerPhone").addEventListener("blur", function () {
    validatePhoneField(this.value.trim());
  });

  // Experience fields (will be handled dynamically when added)
}

// Individual field validation functions for blur events
function validateNameField(name) {
  clearError("workerName");
  if (!name) {
    showError("workerName", "Le nom complet est requis");
    return false;
  }
  return true;
}

function validateRoleField(role) {
  clearError("workerRole");
  if (!role) {
    showError("workerRole", "Veuillez sélectionner un rôle");
    return false;
  }
  return true;
}

function validateEmailField(email) {
  clearError("workerEmail");
  if (!email) {
    showError("workerEmail", "L'email est requis");
    return false;
  } else if (!validateEmail(email)) {
    showError("workerEmail", "Veuillez entrer un email valide");
    return false;
  }
  return true;
}

function validatePhoneField(phone) {
  clearError("workerPhone");
  if (!phone) {
    showError("workerPhone", "Le téléphone est requis");
    return false;
  } else if (!validatePhone(phone)) {
    showError(
      "workerPhone",
      "Le téléphone doit contenir exactement 10 chiffres"
    );
    return false;
  }
  return true;
}

function validateExperienceFields() {
  let isValid = true;
  const experienceItems = document.querySelectorAll(".experience-item");

  if (experienceItems.length === 0) {
    showError(
      "experiencesList",
      "Au moins une expérience professionnelle est requise"
    );
    isValid = false;
  } else {
    experienceItems.forEach((item, index) => {
      const title = item.querySelector(".exp-title").value.trim();
      const company = item.querySelector(".exp-company").value.trim();
      const startDate = item.querySelector(".exp-start-date").value;
      const endDate = item.querySelector(".exp-end-date").value;

      // Clear previous errors for this item
      clearError(item.querySelector(".exp-title"));
      clearError(item.querySelector(".exp-company"));
      clearError(item.querySelector(".exp-start-date"));
      clearError(item.querySelector(".exp-end-date"));

      if (!title) {
        showError(item.querySelector(".exp-title"), "Le poste est requis");
        isValid = false;
      }

      if (!company) {
        showError(
          item.querySelector(".exp-company"),
          "L'entreprise est requise"
        );
        isValid = false;
      }

      if (!startDate) {
        showError(
          item.querySelector(".exp-start-date"),
          "La date de début est requise"
        );
        isValid = false;
      }

      if (!endDate) {
        showError(
          item.querySelector(".exp-end-date"),
          "La date de fin est requise"
        );
        isValid = false;
      }

      if (startDate && endDate) {
        const dateValidation = validateDates(startDate, endDate);
        if (!dateValidation.isValid) {
          showError(
            item.querySelector(".exp-start-date"),
            dateValidation.message
          );
          isValid = false;
        }
      }
    });
  }

  return isValid;
}

// Clear error for a specific field
function clearError(elementOrId) {
  let element;
  if (typeof elementOrId === "string") {
    element = document.getElementById(elementOrId);
  } else {
    element = elementOrId;
  }

  if (!element) return;

  element.classList.remove("error");

  // Remove error message
  const errorElement = element.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error-message")) {
    errorElement.remove();
  }
}

function getRoleClass(role) {
  const roleMap = {
    Réceptionniste: "role-receptionist",
    "Technicien IT": "role-it",
    "Agent de Sécurité": "role-security",
    Manager: "role-manager",
    Nettoyage: "role-cleaning",
  };
  return roleMap[role] || "role-default";
}

function canAssignToRoom(role, room) {
  if (room === "conference" || room === "staff") return true;
  if (room === "archives" && role === "Nettoyage") return false;
  if (roomRules[room]) {
    if (role === "Manager") return true;
    return roomRules[room].includes(role);
  }
  return true;
}

function openAddWorkerModal() {
  document.getElementById("addWorkerModal").classList.add("active");
  // Add one experience field by default
  addExperienceField();
}

function closeAddWorkerModal() {
  document.getElementById("addWorkerModal").classList.remove("active");
  document.getElementById("workerForm").reset();
  document.getElementById("photoPreview").style.display = "none";
  document.getElementById("experiencesList").innerHTML = "";

  // Clear all errors when closing modal
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));
}

function previewPhoto() {
  const url = document.getElementById("workerPhoto").value;
  const preview = document.getElementById("photoPreview");
  if (url) {
    preview.src = url;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }
}

function addExperienceField() {
  const list = document.getElementById("experiencesList");
  const index = list.children.length;
  const expDiv = document.createElement("div");
  expDiv.className = "experience-item";
  expDiv.innerHTML = `
    <button type="button" class="remove-experience-btn">✕</button>
    <div class="form-group">
      <label>Poste *</label>
      <input type="text" class="exp-title" placeholder="Ex: Développeur Web" required>
    </div>
    <div class="form-group">
      <label>Entreprise *</label>
      <input type="text" class="exp-company" placeholder="Ex: TechCorp" required>
    </div>
    <div class="form-group">
      <label>Période *</label>
      <div class="date-period">
        <div class="date-input-group">
          <label class="date-label">Début</label>
          <input type="date" class="exp-start-date" required>
        </div>
        <div class="date-input-group">
          <label class="date-label">Fin</label>
          <input type="date" class="exp-end-date" required>
        </div>
      </div>
    </div>
  `;
  list.appendChild(expDiv);

  // Set min date for both date inputs to today
  const today = new Date().toISOString().split("T")[0];
  expDiv.querySelector(".exp-start-date").min = today;
  expDiv.querySelector(".exp-end-date").min = today;

  // Add blur event listeners for experience fields
  const titleInput = expDiv.querySelector(".exp-title");
  const companyInput = expDiv.querySelector(".exp-company");
  const startDateInput = expDiv.querySelector(".exp-start-date");
  const endDateInput = expDiv.querySelector(".exp-end-date");

  titleInput.addEventListener("blur", function () {
    validateExperienceTitle(this.value.trim());
  });

  companyInput.addEventListener("blur", function () {
    validateExperienceCompany(this.value.trim());
  });

  startDateInput.addEventListener("blur", function () {
    validateExperienceDates();
  });

  endDateInput.addEventListener("blur", function () {
    validateExperienceDates();
  });

  // Add event listener to the new remove button
  expDiv
    .querySelector(".remove-experience-btn")
    .addEventListener("click", function () {
      removeExperience(this);
    });
}

// Individual experience field validation
function validateExperienceTitle(title) {
  if (!title) {
    showError(event.target, "Le poste est requis");
    return false;
  }
  clearError(event.target);
  return true;
}

function validateExperienceCompany(company) {
  if (!company) {
    showError(event.target, "L'entreprise est requise");
    return false;
  }
  clearError(event.target);
  return true;
}

function validateExperienceDates() {
  const experienceItems = document.querySelectorAll(".experience-item");
  experienceItems.forEach((item) => {
    const startDate = item.querySelector(".exp-start-date").value;
    const endDate = item.querySelector(".exp-end-date").value;

    clearError(item.querySelector(".exp-start-date"));
    clearError(item.querySelector(".exp-end-date"));

    if (startDate && endDate) {
      const dateValidation = validateDates(startDate, endDate);
      if (!dateValidation.isValid) {
        showError(
          item.querySelector(".exp-start-date"),
          dateValidation.message
        );
        return false;
      }
    }
    return true;
  });
}

function removeExperience(btn) {
  btn.parentElement.remove();
  // Re-validate experiences after removal
  validateExperienceFields();
}

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

function validateDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return {
      isValid: false,
      message: "La date de début ne peut pas être dans le passé",
    };
  }

  if (end < start) {
    return {
      isValid: false,
      message: "La date de fin ne peut pas être avant la date de début",
    };
  }

  return { isValid: true };
}

function validateForm() {
  // Reset previous error states
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  document
    .querySelectorAll(".error")
    .forEach((el) => el.classList.remove("error"));

  let isValid = true;

  // Validate name
  const name = document.getElementById("workerName").value.trim();
  if (!validateNameField(name)) isValid = false;

  // Validate role
  const role = document.getElementById("workerRole").value;
  if (!validateRoleField(role)) isValid = false;

  // Validate email
  const email = document.getElementById("workerEmail").value.trim();
  if (!validateEmailField(email)) isValid = false;

  // Validate phone
  const phone = document.getElementById("workerPhone").value.trim();
  if (!validatePhoneField(phone)) isValid = false;

  // Validate experiences
  if (!validateExperienceFields()) isValid = false;

  return isValid;
}

function showError(elementOrId, message) {
  let element;
  if (typeof elementOrId === "string") {
    element = document.getElementById(elementOrId);
  } else {
    element = elementOrId;
  }

  if (!element) return;

  element.classList.add("error");

  // Check if error message already exists
  const existingError = element.nextElementSibling;
  if (existingError && existingError.classList.contains("error-message")) {
    existingError.textContent = message;
    return;
  }

  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  errorElement.style.color = "#e74c3c";
  errorElement.style.fontSize = "12px";
  errorElement.style.marginTop = "5px";

  // Insert after the input element
  element.parentNode.insertBefore(errorElement, element.nextSibling);
}

function addWorker(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const experiences = [];
  document.querySelectorAll(".experience-item").forEach((item) => {
    const title = item.querySelector(".exp-title").value.trim();
    const company = item.querySelector(".exp-company").value.trim();
    const startDate = item.querySelector(".exp-start-date").value;
    const endDate = item.querySelector(".exp-end-date").value;

    if (title && company && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const period = `${start.toLocaleDateString(
        "fr-FR"
      )} - ${end.toLocaleDateString("fr-FR")}`;

      experiences.push({
        title,
        company,
        startDate: startDate,
        endDate: endDate,
        period,
      });
    }
  });

  const worker = {
    id: Date.now(),
    name: document.getElementById("workerName").value.trim(),
    role: document.getElementById("workerRole").value,
    photo:
      document.getElementById("workerPhoto").value ||
      "https://via.placeholder.com/150/667eea/ffffff?text=" +
        document.getElementById("workerName").value.charAt(0),
    email: document.getElementById("workerEmail").value.trim(),
    phone: document.getElementById("workerPhone").value.trim(),
    experiences: experiences,
    room: null,
  };

  workers.push(worker);
  renderUnassigned();
  closeAddWorkerModal();
}

function renderUnassigned() {
  const list = document.getElementById("unassignedList");
  const unassigned = workers.filter((w) => !w.room);

  if (unassigned.length === 0) {
    list.innerHTML = '<div class="empty-state">Aucun employé non assigné</div>';
    return;
  }

  list.innerHTML = unassigned
    .map(
      (w) => `
                <div class="worker-card" data-id="${w.id}">
                    <img src="${w.photo}" alt="${w.name}">
                    <div class="worker-info">
                        <h3>${w.name}</h3>
                        <p>${w.email}</p>
                        <span class="role-badge ${getRoleClass(w.role)}">${
        w.role
      }</span>
                    </div>
                </div>
            `
    )
    .join("");

  // Add event listeners to worker cards
  document.querySelectorAll("#unassignedList .worker-card").forEach((card) => {
    card.addEventListener("click", function () {
      const workerId = parseInt(this.getAttribute("data-id"));
      showProfile(workerId);
    });
  });
}

function renderRoom(room) {
  const container = document.getElementById(`workers-${room}`);
  const roomWorkers = workers.filter((w) => w.room === room);
  const capacity = roomCapacity[room];

  document.getElementById(`cap-${room}`).textContent = roomWorkers.length;
  container.innerHTML = roomWorkers
    .map(
      (w) => `
                <div class="room-worker">
                    <img src="${w.photo}" alt="${w.name}" data-id="${w.id}">
                    <div class="room-worker-info" data-id="${w.id}">
                        <h4>${w.name}</h4>
                        <p>${w.role}</p>
                    </div>
                    <button class="remove-btn" data-id="${w.id}" title="Retirer">✕</button>
                </div>
            `
    )
    .join("");

  // Add event listeners to room worker elements
  document
    .querySelectorAll(
      `#workers-${room} .room-worker img, #workers-${room} .room-worker-info`
    )
    .forEach((element) => {
      element.addEventListener("click", function () {
        const workerId = parseInt(this.getAttribute("data-id"));
        showProfile(workerId);
      });
    });

  // Add event listeners to remove buttons
  document
    .querySelectorAll(`#workers-${room} .remove-btn`)
    .forEach((button) => {
      button.addEventListener("click", function () {
        const workerId = parseInt(this.getAttribute("data-id"));
        removeFromRoom(workerId);
      });
    });

  updateRoomStatus(room);
}

function updateRoomStatus(room) {
  const card = document.getElementById(`room-${room}`);
  const roomWorkers = workers.filter((w) => w.room === room);
  const needsStaff =
    roomRules[room] !== null &&
    roomRules[room] !== undefined &&
    room !== "conference" &&
    room !== "staff";

  if (needsStaff && roomWorkers.length === 0) {
    card.classList.add("required-empty");
  } else {
    card.classList.remove("required-empty");
  }
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

function openSelectWorkerModal(room) {
  currentRoomForSelection = room;
  const eligible = workers.filter(
    (w) => !w.room && canAssignToRoom(w.role, room)
  );
  const list = document.getElementById("workerSelectList");

  const currentCount = workers.filter((w) => w.room === room).length;
  if (currentCount >= roomCapacity[room]) {
    alert("Cette zone a atteint sa capacité maximale");
    return;
  }

  if (eligible.length === 0) {
    list.innerHTML =
      '<div class="empty-state">Aucun employé éligible pour cette zone</div>';
    document.getElementById("selectWorkerModal").classList.add("active");
    return;
  }

  list.innerHTML = eligible
    .map(
      (w) => `
                <div class="worker-card" data-id="${w.id}">
                    <img src="${w.photo}" alt="${w.name}">
                    <div class="worker-info">
                        <h3>${w.name}</h3>
                        <p>${w.email}</p>
                        <span class="role-badge ${getRoleClass(w.role)}">${
        w.role
      }</span>
                    </div>
                </div>
            `
    )
    .join("");

  // Add event listeners to worker cards in selection modal
  document
    .querySelectorAll("#workerSelectList .worker-card")
    .forEach((card) => {
      card.addEventListener("click", function () {
        const workerId = parseInt(this.getAttribute("data-id"));
        assignToRoom(workerId, room);
      });
    });

  document.getElementById("selectWorkerModal").classList.add("active");
}

function closeSelectWorkerModal() {
  document.getElementById("selectWorkerModal").classList.remove("active");
  currentRoomForSelection = "";
}

function assignToRoom(workerId, room) {
  const worker = workers.find((w) => w.id === workerId);
  if (worker) {
    const currentCount = workers.filter((w) => w.room === room).length;
    if (currentCount >= roomCapacity[room]) {
      alert("Cette zone a atteint sa capacité maximale");
      return;
    }

    worker.room = room;
    renderUnassigned();
    renderRoom(room);
    closeSelectWorkerModal();
  }
}

function showProfile(workerId) {
  const worker = workers.find((w) => w.id === workerId);
  if (!worker) return;

  const roomNames = {
    conference: "Salle de Conférence",
    reception: "Réception",
    server: "Salle des Serveurs",
    security: "Salle de Sécurité",
    staff: "Salle du Personnel",
    archives: "Salle d'Archives",
  };

  const experiencesHTML =
    worker.experiences.length > 0
      ? worker.experiences
          .map(
            (exp) => `
                    <div class="info-row">
                        <div class="info-label">${exp.title}</div>
                        <div class="info-value">${exp.company} (${exp.period})</div>
                    </div>
                `
          )
          .join("")
      : '<div class="info-row"><div class="info-value">Aucune expérience renseignée</div></div>';

  document.getElementById("profileContent").innerHTML = `
                <div class="profile-header">
                    <img src="${worker.photo}" alt="${worker.name}">
                    <h2>${worker.name}</h2>
                    <span class="role-badge ${getRoleClass(
                      worker.role
                    )}" style="font-size: 14px; padding: 8px 16px;">${
    worker.role
  }</span>
                </div>
                <div class="profile-info">
                    <div class="info-row">
                        <div class="info-label">Email</div>
                        <div class="info-value">${worker.email}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Téléphone</div>
                        <div class="info-value">${worker.phone}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Localisation</div>
                        <div class="info-value">${
                          worker.room ? roomNames[worker.room] : "Non assigné"
                        }</div>
                    </div>
                </div>
                <div class="profile-info">
                    <h3 style="margin-bottom: 15px; color: #495057;">Expériences Professionnelles</h3>
                    ${experiencesHTML}
                </div>
            `;

  document.getElementById("profileModal").classList.add("active");
}

function closeProfileModal() {
  document.getElementById("profileModal").classList.remove("active");
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
  ].forEach((room) => {
    renderRoom(room);
  });
}

// Start the application by fetching data
fetchWorkersData();
