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
let workersList = workers.workers;
const unassignedList = document.getElementById("unassignedList");

const roleColors = {
  Réceptionniste: "role-receptionist",
  "Technicien IT": "role-it",
  "Agent de Sécurité": "role-security",
  Manager: "role-manager",
  Nettoyage: "role-cleaning",
};

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
