let workers = {
  workers: [
    {
      id: 1,
      name: "Sophie Martin",
      role: "Réceptionniste",
      photo: "https://i.pravatar.cc/150?img=1",
      email: "sophie.martin@worksphere.com",
      phone: "+33 6 12 34 56 78",
      experiences: [
        {
          title: "Réceptionniste Senior",
          company: "Hotel Luxe",
          period: "2020-2024",
        },
      ],
      room: null,
    },
    {
      id: 2,
      name: "Thomas Dubois",
      role: "Technicien IT",
      photo: "https://i.pravatar.cc/150?img=12",
      email: "thomas.dubois@worksphere.com",
      phone: "+33 6 23 45 67 89",
      experiences: [
        {
          title: "Administrateur Système",
          company: "TechCorp",
          period: "2018-2024",
        },
      ],
      room: null,
    },
    {
      id: 3,
      name: "Marie Lefebvre",
      role: "Agent de Sécurité",
      photo: "https://i.pravatar.cc/150?img=5",
      email: "marie.lefebvre@worksphere.com",
      phone: "+33 6 34 56 78 90",
      experiences: [
        {
          title: "Agent de Sécurité",
          company: "SecureGuard",
          period: "2019-2024",
        },
      ],
      room: null,
    },
    {
      id: 4,
      name: "Pierre Moreau",
      role: "Manager",
      photo: "https://i.pravatar.cc/150?img=13",
      email: "pierre.moreau@worksphere.com",
      phone: "+33 6 45 67 89 01",
      experiences: [
        {
          title: "Directeur des Opérations",
          company: "BusinessPro",
          period: "2015-2024",
        },
      ],
      room: null,
    },
    {
      id: 5,
      name: "Julie Bernard",
      role: "Nettoyage",
      photo: "https://i.pravatar.cc/150?img=9",
      email: "julie.bernard@worksphere.com",
      phone: "+33 6 56 78 90 12",
      experiences: [
        {
          title: "Responsable Nettoyage",
          company: "CleanPro",
          period: "2021-2024",
        },
      ],
      room: null,
    },
    {
      id: 6,
      name: "Lucas Petit",
      role: "Employé",
      photo: "https://i.pravatar.cc/150?img=14",
      email: "lucas.petit@worksphere.com",
      phone: "+33 6 67 89 01 23",
      experiences: [
        {
          title: "Assistant Administratif",
          company: "OfficePro",
          period: "2022-2024",
        },
      ],
      room: null,
    },
  ],
};

const roleColors = {
  Réceptionniste: "role-receptionist",
  "Technicien IT": "role-it",
  "Agent de Sécurité": "role-security",
  Manager: "role-manager",
  Nettoyage: "role-cleaning",
};
const roomSizes = {
  conference: 10,
  reception: 3,
  server: 5,
  security: 4,
  staff: 15,
  archives: 5,
};

const roomPermissions = {
  reception: ["Manager", "Réceptionniste", "Nettoyage"],
  server: ["Manager", "Technicien IT"],
  security: ["Manager", "Agent de sécurité", "Nettoyage"],
  archives: ["Manager"],
};

const roomTitles = {
  conference: "Salle de Conférence",
  reception: "Réception",
  server: "Salle des Serveurs",
  security: "Salle de Sécurité",
  staff: "Salle du Personnel",
  archives: "Salle d'Archives",
};

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

let workersList = workers.workers;
const unassignedList = document.getElementById("unassignedList");

if (workersList.length === 0) {
  unassignedList.innerHTML =
    '<div class="empty-state">Aucun employé non assigné</div>';
} else {
  unassignedList.innerHTML = workersList
    .map(
      (worker) =>
        `<div class="worker-card" data-id="${worker.id}">
          <img src="${worker.photo}" alt="${worker.name}">
          <div class="worker-info">
            <h3>${worker.name}</h3>
            <p>${worker.email}</p>
            <span class="role-badge ${getRoleStyle(worker.role)}">${
          worker.role
        }</span>
          </div>
        </div>`
    )
    .join("");
}

function getRoleStyle(role) {
  return roleColors[role] || "role-default";
}
// open modal to add worker
document.getElementById("addWorkerBtn").addEventListener("click", () => {
  document.getElementById("addWorkerModal").style.display = "flex";
});
// close add modal
document.getElementById("closeAddWorkerModal").addEventListener("click", () => {
  document.getElementById("addWorkerModal").style.display = "none";
});

// form validation
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value.trim() === "" && input.id !== "workerPhoto") {
      showError(input, "Ce champ est requis.");
    } else {
      switch (input.id) {
        case "workerName": {
          if (input.value.trim().length < 3 || input.value.trim().length > 50) {
            showError(input, "Le nom doit contenir entre 3 et 50 character.");
          }
          break;
        }
        case "entrepriseInput": {
          if (input.value.trim().length < 2 || input.value.trim().length > 50) {
            showError(
              input,
              "Le nom d'entreprise doit contenir entre 2 et 50 character."
            );
          }
          break;
        }
        case "posteInput": {
          if (input.value.trim().length < 2 || input.value.trim().length > 50) {
            showError(
              input,
              "Le nom de poste doit contenir entre 2 et 50 character."
            );
          }
          break;
        }
        case "workerEmail": {
          if (!isValidEmail(input.value.trim())) {
            showError(input, "Veuillez entrer une adresse e-mail valide.");
          }
          break;
        }
        case "workerPhone": {
          if (!isValidPhone(input.value.trim())) {
            showError(input, "Veuillez entrer un numéro de téléphone valide.");
          }
          break;
        }
        default:
          break;
      }
    }
  });
});

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("change", () => {
    if (
      input.value.trim() === "" &&
      (input.id === "startDate" || input.id === "endDate")
    ) {
      showError(input, "Ce champ est requis.");
    } else {
      switch (input.id) {
        case "startDate": {
          let endDateInput = document.getElementById("endDate");
          hideError(input);
          if (endDateInput.value.trim() !== "") {
            hideError(endDateInput);
            let result = checkDates(
              input.value.trim(),
              endDateInput.value.trim()
            );
            if (!result.ok) {
              showError(input, result.msg);
            }
          }
          break;
        }
        case "endDate": {
          let startDateInput = document.getElementById("startDate");
          hideError(input);
          if (startDateInput.value.trim() !== "") {
            hideError(startDateInput);
            let result = checkDates(
              startDateInput.value.trim(),
              input.value.trim()
            );
            if (!result.ok) {
              showError(input, result.msg);
            }
          }
          break;
        }
        default:
          break;
      }
    }
  });
});
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("focus", () => {
    hideError(input);
  });
});

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
