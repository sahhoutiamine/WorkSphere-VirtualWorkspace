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

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value.trim() === "") {
      showError(input, "Ce champ est requis.");
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
