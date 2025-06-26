# Projet 9 - Débuggez et testez un SaaS RH

## 📋 Contexte

Ce projet fait partie du parcours Développeur Front-End chez OpenClassrooms. L’objectif est de maintenir, corriger et tester une application existante destinée aux employés RH pour la gestion des notes de frais.

L'application **Billed** permet aux employés de :
- soumettre de nouvelles notes de frais via un formulaire
- visualiser les justificatifs
- consulter l’historique des dépenses

## 🚀 Objectifs pédagogiques

- Corriger des bugs JavaScript dans une application existante
- Écrire des tests unitaires et d’intégration avec Jest
- Écrire un plan de test end-to-end (E2E)
- Mettre en place une couverture de test d’au moins 80%

---

## 🛠️ Installation du projet

### 1. Cloner le dépôt

```
git clone https://github.com/votre-utilisateur/Billed-app-FR-Front.git
cd Billed-app-FR-Front
```

2. Installer les dépendances
```
npm install
```
3. Lancer le serveur de développement
```
npm run dev
```
4.  Lancer les tests
```
npm run test
```
### ✅ Couverture de tests
- Taux de couverture global : > 88%

- Tous les composants dans src/views sont couverts à 100%

- Les composants critiques (Bills.js, NewBill.js) atteignent une couverture ≥ 80%

## 🔬 Structure des tests

Les tests sont situés dans le dossier `src/__tests__`.

### 🔹 Tests unitaires

- Testent des comportements isolés (ex. : validation de fichiers, soumission de formulaire)
- **Fichiers concernés** : `NewBill.js`, `Bills.js`

### 🔹 Tests d’intégration

- Vérifient l'interaction entre le store et les composants (`getBills`, `updateBill`)
- Mocks d’API intégrés pour simuler des erreurs 404 et 500

### 🔹 Plan de test manuel (E2E)

- Document séparé au format PDF
- Contient **au moins 10 scénarios** décrivant le parcours employé
- Structure de scénario :
  - **Given** : l’état initial
  - **When** : l’action de l’utilisateur
  - **Then** : le comportement attendu

---

## 🐛 Bugs corrigés

- ✅ L’icône de menu ne s’activait pas correctement → **corrigé**
- ✅ L’ordre des notes de frais était inversé → **corrigé**
- ✅ L’upload de fichiers `.pdf` était autorisé → **bloqué**
- ✅ Les erreurs API `404` et `500` n’étaient pas gérées → **mockées et testées**

---

## 📁 Arborescence du projet

```bash
├── src
│   ├── app
│   ├── components
│   ├── containers
│   ├── views
│   └── __tests__          # Tous les fichiers de test
├── __mocks__              # Mocks Jest (store, localStorage)
├── coverage               # Rapport de couverture Jest
├── README.md


