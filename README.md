WorkSphere - Virtual Workspace

Description du Projet
WorkSphere est une application web interactive de gestion du personnel qui permet aux utilisateurs de créer, visualiser et affecter des employés dans différents espaces de travail virtuels. L'application offre une interface intuitive pour organiser le personnel dans un environnement de bureau virtuel avec 6 zones distinctes.

Fonctionnalités

🏢 Gestion des Espaces de Travail
6 salles différentes avec des capacités spécifiques :

Salle de Conférence (capacité: 10 personnes)

Réception (capacité: 3 personnes)

Salle des Serveurs (capacité: 5 personnes)

Salle de Sécurité (capacité: 4 personnes)

Salle du Personnel (capacité: 15 personnes)

Salle d'Archives (capacité: 5 personnes)

👥 Gestion du Personnel

Ajout d'employés avec informations complètes :

Nom complet

Rôle (Réceptionniste, Technicien IT, Agent de Sécurité, Manager, Nettoyage, Employé)

Photo de profil (URL)

Email et téléphone

Expériences professionnelles multiples

Affectation intelligente avec restrictions par rôle

Visualisation des profils détaillés

🔧 Fonctionnalités Avancées
Système de permissions par salle

Validation des données en temps réel

Interface responsive pour tous les appareils

Design moderne avec animations fluides

Gestion des capacités avec indicateurs visuels

Technologies Utilisées
HTML5 - Structure de l'application

CSS3 - Styles et design responsive

JavaScript (ES6+) - Logique métier et interactions

Grid Layout - Mise en page avancée

Flexbox - Alignement des éléments

Installation et Utilisation
Prérequis
Navigateur web moderne (Chrome, Firefox, Safari, Edge)

Connexion internet pour les avatars (optionnel)

Installation
Téléchargez tous les fichiers du projet

Ouvrez index.html dans votre navigateur

L'application est prête à être utilisée !

Utilisation
Ajouter un employé : Cliquez sur "+ Ajouter un Employé" dans la sidebar

Remplir le formulaire : Saisissez toutes les informations requises

Affecter à une salle : Cliquez sur "+" dans la salle souhaitée

Consulter un profil : Cliquez sur une carte employé

Retirer d'une salle : Cliquez sur "✕" à côté de l'employé

Structure des Données
Employé
javascript
{
id: Number,
name: String,
role: String,
photo: String (URL),
email: String,
phone: String,
experiences: Array,
room: String|null
}
Expérience Professionnelle
javascript
{
title: String,
company: String,
period: String,
startDate: String,
endDate: String
}
Règles d'Affectation
Permissions par Salle
Réception : Réceptionniste, Manager, Nettoyage

Salle des Serveurs : Technicien IT, Manager

Salle de Sécurité : Agent de Sécurité, Manager, Nettoyage

Salle d'Archives : Manager uniquement

Salle du Personnel : Tous les rôles

Salle de Conférence : Tous les rôles

Capacités Maximales
Salle de Conférence : 10 personnes

Réception : 3 personnes

Salle des Serveurs : 5 personnes

Salle de Sécurité : 4 personnes

Salle du Personnel : 15 personnes

Salle d'Archives : 5 personnes

Validation des Données
Champs Obligatoires
Nom complet

Rôle

Email (format valide)

Téléphone (10 chiffres)

Au moins une expérience professionnelle

Validation Spécifique
Email : format email standard

Téléphone : exactement 10 chiffres

Dates d'expérience : date de fin ≥ date de début

Design et Interface
Couleurs par Rôle
Réceptionniste : Bleu clair

Technicien IT : Jaune

Agent de Sécurité : Rouge

Manager : Violet

Nettoyage : Vert

Employé : Gris

Responsive Design
Desktop : Layout complet avec sidebar

Tablette : Adaptation avec scroll

Mobile : Interface rotative pour optimisation

Fonctions Principales
Gestion des Employés
addNewWorker() : Ajout d'un nouvel employé

showWorkerProfile() : Affichage du profil

removeWorkerFromRoom() : Retrait d'une salle

Gestion des Salles
showRoom() : Affichage du contenu d'une salle

openWorkerSelection() : Sélection d'employés pour une salle

putWorkerInRoom() : Affectation à une salle

Validation
checkAllFields() : Validation complète du formulaire

checkExperiences() : Validation des expériences

canWorkInRoom() : Vérification des permissions

Personnalisation
Modification des Capacités
Modifiez l'objet roomSizes dans script.js :

javascript
const roomSizes = {
conference: 10,
reception: 3,
// ... autres salles
};
Ajout de Rôles
Ajoutez l'option dans le sélecteur HTML

Définissez la couleur dans roleColors

Ajoutez les permissions dans roomPermissions

Navigateurs Supportés
Chrome 90+

Firefox 88+

Safari 14+

Edge 90+

Planification

Trello : https://trello.com/invite/b/69187f8db33a0289abcc982e/ATTI3d5471b80d321bee6bd637f92f493ebf5B32654E/worksphere-virtual-workspace

Auteur

Amine SAHHOUTI
📧 Email : midoriaduko@gmail.com
🐙 GitHub : sahhoutiamine

Développé avec ❤️ pour la gestion moderne des espaces de travail

Licence
Projet open-source - Libre d'utilisation et de modification

WorkSphere - Réinventez la gestion de votre personnel dans un environnement de travail virtuel intuitif et efficace !
