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

Tous les tests sont situés dans le dossier `src/__tests__`.

### 🔹 Tests unitaires

Ils vérifient des comportements isolés (validation d’un fichier, affichage d’un bouton, soumission d’un formulaire...).

- 📁 Fichiers concernés :  
  `NewBill.js`, `Bills.js`, `Dashboard.js`

- 🧪 Exemple :  
  - Vérification que seuls les fichiers au bon format sont acceptés (`handleChangeFile`)
  - Soumission du formulaire `NewBill` déclenche `updateBill`

### 🔹 Tests d’intégration

Ils testent l’interaction entre composants et le store (ex. : `getBills`, `updateBill`), avec des appels à une API **mockée**.

- 📁 Fichiers concernés :
  `NewBill.js`, `Bills.js`, `Dashboard.js`

- 🧪 Incluent :
  - Un test **GET** des bills (inspiré du test `Dashboard`)
  - Un test **POST** d'ajout de note de frais (`NewBill`)
  - Gestion des erreurs **404** et **500**

### 🔹 Plan de test manuel (E2E)

- 📄 Document au format **PDF**
- 💡 Contient **au moins 10 scénarios** décrivant le parcours employé
- Utilise la structure **Given / When / Then**

---

## 🐛 Bugs corrigés

Liste extraite du rapport Notion :

### [Bills] L’ordre des notes de frais était inversé

- Le tri se faisait par défaut dans le mauvais ordre.
- ✅ Corrigé : les dates sont maintenant triées du plus récent au plus ancien.

### [Login] L’administrateur ne naviguait pas vers Dashboard

- Le test échouait à cause d’une mauvaise redirection.
- ✅ Corrigé : la navigation vers Dashboard fonctionne avec les bons identifiants admin.

### [NewBill] L’upload de fichiers invalides ne bloquait pas

- Les fichiers `.pdf` passaient malgré l’interface.
- ✅ Corrigé : seuls les formats `.jpg`, `.jpeg` et `.png` sont désormais acceptés dans le formulaire `NewBill`.

### [Dashboard] Les listes de tickets se bloquaient

- Après avoir ouvert une liste (ex. : "validé"), impossible d’en ouvrir une autre (ex. : "refusé").
- ✅ Corrigé : on peut maintenant naviguer librement entre les statuts.

### [Justificatifs] Les images ne s’affichaient pas dans les modales

- Problème d’extension, ou `fileName` null côté admin.
- ✅ Corrigé : la modale affiche bien les justificatifs.

---

## 📁 Arborescence du projet

```bash
├── src
│   ├── app              # Navigation
│   ├── components       # Composants UI (modale, icônes...)
│   ├── containers       # Logique des pages (Bills, NewBill...)
│   ├── views            # UI des pages
│   └── __tests__        # Fichiers de test Jest
├── __mocks__            # Mocks Jest (store, localStorage)
├── coverage             # Rapport de couverture Jest
├── README.md


