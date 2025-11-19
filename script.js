let workers = [];
let currentRoom = "";

const roomSizes = {
  conference: 10,
  reception: 3,
  server: 5,
  security: 4,
  staff: 15,
  archives: 5,
};

const roomPermissions = {
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

const roomTitles = {
  conference: "Salle de Conférence",
  reception: "Réception",
  server: "Salle des Serveurs",
  security: "Salle de Sécurité",
  staff: "Salle du Personnel",
  archives: "Salle d'Archives",
};

const roleColors = {
  Réceptionniste: "role-receptionist",
  "Technicien IT": "role-it",
  "Agent de Sécurité": "role-security",
  Manager: "role-manager",
  Nettoyage: "role-cleaning",
};

async function getWorkers() {
  try {
    let response = await fetch("workers.json");
    if (response.ok) {
      let data = await response.json();
      workers = data.workers;
    } else {
      workers = [];
    }
  } catch (err) {
    console.log("Error loading workers:", err);
    workers = [];
  }
  startApp();
}

function getElement(id) {
  return document.getElementById(id);
}

function getValue(id) {
  return getElement(id).value.trim();
}

function getRoleStyle(role) {
  return roleColors[role] || "role-default";
}

function canWorkInRoom(role, room) {
  if (room === "conference" || room === "staff") return true;
  if (room === "archives" && role !== "Nettoyage") return true;
  if (role === "Manager") return true;
  if (!roomPermissions[room]) return true;
  return roomPermissions[room].includes(role);
}

function isValidEmail(email) {
  let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function isValidPhone(phone) {
  let numbers = phone.replace(/\s/g, "");
  return /^\d{10}$/.test(numbers);
}

function checkDates(start, end) {
  let startDate = new Date(start);
  let endDate = new Date(end);

  if (endDate < startDate) {
    return {
      ok: false,
      msg: "La date de fin ne peut pas être avant la date de début",
    };
  }
  return { ok: true };
}

function showError(input, message) {
  let field = typeof input === "string" ? getElement(input) : input;
  if (!field) return;

  field.classList.add("error");

  let nextElement = field.nextElementSibling;
  if (nextElement && nextElement.classList.contains("error-msg")) {
    nextElement.textContent = message;
    return;
  }

  let errorDiv = document.createElement("div");
  errorDiv.className = "error-msg";
  errorDiv.textContent = message;
  errorDiv.style.color = "#e74c3c";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";

  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function hideError(input) {
  let field = typeof input === "string" ? getElement(input) : input;
  if (!field) return;

  field.classList.remove("error");
  let nextElement = field.nextElementSibling;
  if (nextElement && nextElement.classList.contains("error-msg")) {
    nextElement.remove();
  }
}

const fieldChecks = {
  workerName: function (value) {
    if (!value) {
      showError("workerName", "Le nom complet est requis");
      return false;
    }
    return true;
  },
  workerRole: function (value) {
    if (!value) {
      showError("workerRole", "Veuillez sélectionner un rôle");
      return false;
    }
    return true;
  },
  workerEmail: function (value) {
    if (!value) {
      showError("workerEmail", "L'email est requis");
      return false;
    }
    if (!isValidEmail(value)) {
      showError("workerEmail", "Veuillez entrer un email valide");
      return false;
    }
    return true;
  },
  workerPhone: function (value) {
    if (!value) {
      showError("workerPhone", "Le téléphone est requis");
      return false;
    }
    if (!isValidPhone(value)) {
      showError(
        "workerPhone",
        "Le téléphone doit contenir exactement 10 chiffres"
      );
      return false;
    }
    return true;
  },
};

function checkField(fieldName, value) {
  hideError(fieldName);
  if (fieldChecks[fieldName]) {
    return fieldChecks[fieldName](value);
  }
  return true;
}

function checkExperiences() {
  let experienceItems = document.querySelectorAll(".experience-item");
  if (experienceItems.length === 0) {
    showError(
      "experiencesList",
      "Au moins une expérience professionnelle est requise"
    );
    return false;
  }

  let allGood = true;

  experienceItems.forEach(function (item) {
    let titleField = item.querySelector(".exp-title");
    let companyField = item.querySelector(".exp-company");
    let startField = item.querySelector(".exp-start-date");
    let endField = item.querySelector(".exp-end-date");

    hideError(titleField);
    hideError(companyField);
    hideError(startField);
    hideError(endField);

    if (!titleField.value.trim()) {
      showError(titleField, "Le poste est requis");
      allGood = false;
    }
    if (!companyField.value.trim()) {
      showError(companyField, "L'entreprise est requise");
      allGood = false;
    }
    if (!startField.value) {
      showError(startField, "La date de début est requise");
      allGood = false;
    }
    if (!endField.value) {
      showError(endField, "La date de fin est requise");
      allGood = false;
    }

    if (startField.value && endField.value) {
      let dateCheck = checkDates(startField.value, endField.value);
      if (!dateCheck.ok) {
        showError(startField, dateCheck.msg);
        allGood = false;
      }
    }
  });

  return allGood;
}

function checkAllFields() {
  document.querySelectorAll(".error-msg").forEach(function (el) {
    el.remove();
  });
  document.querySelectorAll(".error").forEach(function (el) {
    el.classList.remove("error");
  });

  let field1 = checkField("workerName", getValue("workerName"));
  let field2 = checkField("workerRole", getValue("workerRole"));
  let field3 = checkField("workerEmail", getValue("workerEmail"));
  let field4 = checkField("workerPhone", getValue("workerPhone"));
  let field5 = checkExperiences();

  return field1 && field2 && field3 && field4 && field5;
}

function openModal(modalId, doAfter) {
  getElement(modalId).classList.add("active");
  if (doAfter) doAfter();
}

function closeModal(modalId) {
  getElement(modalId).classList.remove("active");
  if (modalId === "addWorkerModal") {
    getElement("workerForm").reset();
    getElement("photoPreview").style.display = "none";
    getElement("experiencesList").innerHTML = "";
    document.querySelectorAll(".error-msg").forEach(function (el) {
      el.remove();
    });
    document.querySelectorAll(".error").forEach(function (el) {
      el.classList.remove("error");
    });
  }
  if (modalId === "selectWorkerModal") {
    currentRoom = "";
  }
}

function addExperience() {
  let list = getElement("experiencesList");
  let firstOne = list.children.length === 0;
  let newExp = document.createElement("div");
  newExp.className = "experience-item";

  newExp.innerHTML =
    (firstOne
      ? ""
      : '<button type="button" class="remove-exp-btn">✕</button>') +
    '<div class="form-group"><label>Poste *</label><input type="text" class="exp-title" placeholder="Ex: Développeur Web" required></div>' +
    '<div class="form-group"><label>Entreprise *</label><input type="text" class="exp-company" placeholder="Ex: TechCorp" required></div>' +
    '<div class="form-group"><label>Période *</label><div class="date-period">' +
    '<div class="date-input-group"><label class="date-label">Début</label><input type="date" class="exp-start-date" required></div>' +
    '<div class="date-input-group"><label class="date-label">Fin</label><input type="date" class="exp-end-date" required></div>' +
    "</div></div>";

  list.appendChild(newExp);

  let removeBtn = newExp.querySelector(".remove-exp-btn");
  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      removeBtn.parentElement.remove();
      checkExperiences();
    });
  }
}

function addNewWorker(e) {
  e.preventDefault();
  if (!checkAllFields()) return;

  let experiences = [];
  let experienceItems = document.querySelectorAll(".experience-item");

  experienceItems.forEach(function (item) {
    let startDate = new Date(item.querySelector(".exp-start-date").value);
    let endDate = new Date(item.querySelector(".exp-end-date").value);

    experiences.push({
      title: item.querySelector(".exp-title").value.trim(),
      company: item.querySelector(".exp-company").value.trim(),
      startDate: item.querySelector(".exp-start-date").value,
      endDate: item.querySelector(".exp-end-date").value,
      period:
        startDate.toLocaleDateString("fr-FR") +
        " - " +
        endDate.toLocaleDateString("fr-FR"),
    });
  });

  let name = getValue("workerName");
  let newWorker = {
    id: Date.now(),
    name: name,
    role: getElement("workerRole").value,
    photo:
      getValue("workerPhoto") ||
      "https://www.aljazeera.com/wp-content/uploads/2023/06/AP23171755115969-1687309761.jpg?resize=1200%2C675",
    email: getValue("workerEmail"),
    phone: getValue("workerPhone"),
    experiences: experiences,
    room: null,
  };

  workers.push(newWorker);
  showUnassigned();
  closeModal("addWorkerModal");
}

function makeWorkerCard(worker) {
  return (
    '<div class="worker-card" data-id="' +
    worker.id +
    '">' +
    '<img src="' +
    worker.photo +
    '" alt="' +
    worker.name +
    '">' +
    '<div class="worker-info">' +
    "<h3>" +
    worker.name +
    "</h3>" +
    "<p>" +
    worker.email +
    "</p>" +
    '<span class="role-badge ' +
    getRoleStyle(worker.role) +
    '">' +
    worker.role +
    "</span>" +
    "</div>" +
    "</div>"
  );
}

function showUnassigned() {
  let list = getElement("unassignedList");
  let noRoomWorkers = workers.filter(function (w) {
    return !w.room;
  });

  if (noRoomWorkers.length === 0) {
    list.innerHTML = '<div class="empty-state">Aucun employé non assigné</div>';
  } else {
    list.innerHTML = noRoomWorkers.map(makeWorkerCard).join("");
  }

  list.querySelectorAll(".worker-card").forEach((card) => {
    card.addEventListener("click", () => {
      showWorkerProfile(parseInt(card.getAttribute("data-id")));
    });
  });
}

function showRoom(room) {
  let roomWorkers = workers.filter(function (w) {
    return w.room === room;
  });
  getElement("cap-" + room).textContent = roomWorkers.length;

  let workersContainer = getElement("workers-" + room);
  workersContainer.innerHTML = "";

  roomWorkers.forEach(function (worker) {
    let workerDiv = document.createElement("div");
    workerDiv.className = "room-worker";
    workerDiv.innerHTML =
      '<img src="' +
      worker.photo +
      '" alt="' +
      worker.name +
      '" data-id="' +
      worker.id +
      '">' +
      '<div class="room-worker-info" data-id="' +
      worker.id +
      '"><h4>' +
      worker.name +
      "</h4><p>" +
      worker.role +
      "</p></div>" +
      '<button class="remove-btn" data-id="' +
      worker.id +
      '" title="Retirer">✕</button>';

    workersContainer.appendChild(workerDiv);
  });

  document
    .querySelectorAll(
      "#workers-" + room + " img, #workers-" + room + " .room-worker-info"
    )
    .forEach((el) => {
      el.addEventListener("click", () => {
        showWorkerProfile(parseInt(el.getAttribute("data-id")));
      });
    });

  document
    .querySelectorAll("#workers-" + room + " .remove-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        removeWorkerFromRoom(parseInt(btn.getAttribute("data-id")));
      });
    });

  updateRoomDisplay(room);
}

function updateRoomDisplay(room) {
  let card = getElement("room-" + room);
  let needsSpecificRole =
    roomPermissions[room] && room !== "conference" && room !== "staff";

  if (needsSpecificRole) {
    let hasRequiredWorker = workers.some(function (w) {
      return w.room === room;
    });
    if (hasRequiredWorker) {
      card.classList.remove("required-empty");
    } else {
      card.classList.add("required-empty");
    }
  }
}

function removeWorkerFromRoom(workerId) {
  let worker = workers.find(function (w) {
    return w.id === workerId;
  });
  if (worker) {
    let previousRoom = worker.room;
    worker.room = null;
    showUnassigned();
    if (previousRoom) showRoom(previousRoom);
  }
}

function putWorkerInRoom(workerId, room) {
  let worker = workers.find(function (w) {
    return w.id === workerId;
  });
  if (!worker) return;

  let currentWorkerCount = workers.filter(function (w) {
    return w.room === room;
  }).length;
  if (currentWorkerCount >= roomSizes[room]) {
    alert("Cette zone a atteint sa capacité maximale");
    return;
  }

  worker.room = room;
  showUnassigned();
  showRoom(room);
  closeModal("selectWorkerModal");
}

function openWorkerSelection(room) {
  let currentWorkerCount = workers.filter(function (w) {
    return w.room === room;
  }).length;
  if (currentWorkerCount >= roomSizes[room]) {
    alert("Cette zone a atteint sa capacité maximale");
    return;
  }

  currentRoom = room;
  let availableWorkers = workers.filter(function (w) {
    return !w.room && canWorkInRoom(w.role, room);
  });

  let list = getElement("workerSelectList");

  if (availableWorkers.length === 0) {
    list.innerHTML =
      '<div class="empty-state">Aucun employé éligible pour cette zone</div>';
  } else {
    list.innerHTML = availableWorkers.map(makeWorkerCard).join("");
  }

  list.querySelectorAll(".worker-card").forEach((card) => {
    card.addEventListener("click", () => {
      putWorkerInRoom(parseInt(card.getAttribute("data-id")), room);
    });
  });

  openModal("selectWorkerModal");
}

function showWorkerProfile(workerId) {
  let worker = workers.find(function (w) {
    return w.id === workerId;
  });
  if (!worker) return;

  let experiencesHTML = "";
  if (worker.experiences.length > 0) {
    worker.experiences.forEach(function (exp) {
      experiencesHTML +=
        '<div class="info-row"><div class="info-label">' +
        exp.title +
        "</div>" +
        '<div class="info-value">' +
        exp.company +
        " (" +
        exp.period +
        ")</div></div>";
    });
  } else {
    experiencesHTML =
      '<div class="info-row"><div class="info-value">Aucune expérience renseignée</div></div>';
  }

  getElement("profileContent").innerHTML =
    '<div class="profile-header">' +
    '<img src="' +
    worker.photo +
    '" alt="' +
    worker.name +
    '"><h2>' +
    worker.name +
    "</h2>" +
    '<span class="role-badge ' +
    getRoleStyle(worker.role) +
    '" style="font-size: 14px; padding: 8px 16px;">' +
    worker.role +
    "</span>" +
    "</div>" +
    '<div class="profile-info">' +
    '<div class="info-row"><div class="info-label">Email</div><div class="info-value">' +
    worker.email +
    "</div></div>" +
    '<div class="info-row"><div class="info-label">Téléphone</div><div class="info-value">' +
    worker.phone +
    "</div></div>" +
    '<div class="info-row"><div class="info-label">Localisation</div>' +
    '<div class="info-value">' +
    (worker.room ? roomTitles[worker.room] : "Non assigné") +
    "</div></div>" +
    "</div>" +
    '<div class="profile-info">' +
    '<h3 style="margin-bottom: 15px; color: #495057;">Expériences Professionnelles</h3>' +
    experiencesHTML +
    "</div>";

  openModal("profileModal");
}

function setupEvents() {
  getElement("addWorkerBtn").addEventListener("click", () => {
    openModal("addWorkerModal", addExperience);
  });

  document
    .getElementById("closeAddWorkerModal")
    .addEventListener("click", () => {
      closeModal("addWorkerModal");
    });
  document.getElementById("closeProfileModal").addEventListener("click", () => {
    closeModal("profileModal");
  });
  document
    .getElementById("closeSelectWorkerModal")
    .addEventListener("click", () => {
      closeModal("selectWorkerModal");
    });

  getElement("workerForm").addEventListener("submit", addNewWorker);

  getElement("workerPhoto").addEventListener("change", () => {
    let preview = getElement("photoPreview");
    preview.src = getElement("workerPhoto").value;
    preview.style.display = getElement("workerPhoto").value ? "block" : "none";
  });

  getElement("addExperienceBtn").addEventListener("click", addExperience);

  document.querySelectorAll(".add-to-room-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openWorkerSelection(btn.getAttribute("data-room"));
    });
  });

  ["workerName", "workerRole", "workerEmail", "workerPhone"].forEach(
    (field) => {
      getElement(field).addEventListener("blur", () => {
        checkField(field, getElement(field).value.trim());
      });
    }
  );

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

function startApp() {
  setupEvents();
  showUnassigned();
  [
    "conference",
    "reception",
    "server",
    "security",
    "staff",
    "archives",
  ].forEach(function (room) {
    showRoom(room);
  });
}

getWorkers();
