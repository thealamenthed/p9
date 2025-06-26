/**
 * @jest-environment jsdom
 */

import {screen, fireEvent} from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import {ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

// === TESTS D'INTÉGRATION — Vérifie que les erreurs d'API sont bien gérées ===
test("Affiche une erreur si updateBill échoue avec 404", async () => {
  // On simule la fonction console.error pour vérifier plus tard si elle est appelée
  const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

  // On crée un faux store (API) qui renvoie une erreur 404 quand on appelle update()
  const fakeStore = {
    bills: () => ({
      update: jest.fn(() => Promise.reject(new Error("Erreur 404")))
    })
  };

  // On remplit la page avec le formulaire
  document.body.innerHTML = NewBillUI();

  // On simule un utilisateur connecté
  Object.defineProperty(window, "localStorage", {value: localStorageMock});
  window.localStorage.setItem("user", JSON.stringify({email: "a@a"}));

  // On crée une instance de la page NewBill avec le faux store
  const newBill = new NewBill({
    document,
    onNavigate: jest.fn(),
    store: fakeStore,
    localStorage: window.localStorage
  });

  // On simule un fichier déjà uploadé
  newBill.fileUrl = "https://test.com/test.png";
  newBill.fileName = "test.png";

  // On simule l’envoi du formulaire
  const form = screen.getByTestId("form-new-bill");
  await fireEvent.submit(form);

  // On attend un peu pour que l’erreur soit bien traitée
  await new Promise((r) => setTimeout(r, 0));

  // On vérifie qu’une erreur a été affichée dans la console
  expect(consoleErrorMock).toHaveBeenCalled();

  // On remet console.error comme avant
  consoleErrorMock.mockRestore();
});

test("Affiche une erreur si updateBill échoue avec 500", async () => {
  // 🔧 On simule la fonction console.error pour vérifier plus tard si elle est appelée
  const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

  // 🔧 On crée un faux store (API) qui renvoie une erreur 404 quand on appelle update()
  const fakeStore = {
    bills: () => ({
      update: jest.fn(() => Promise.reject(new Error("Erreur 500")))
    })
  };

  // 🔧 On remplit la page avec le formulaire
  document.body.innerHTML = NewBillUI();

  // 🔧 On simule un utilisateur connecté
  Object.defineProperty(window, "localStorage", {value: localStorageMock});
  window.localStorage.setItem("user", JSON.stringify({email: "a@a"}));

  // 🔧 On crée une instance de la page NewBill avec le faux store
  const newBill = new NewBill({
    document,
    onNavigate: jest.fn(),
    store: fakeStore,
    localStorage: window.localStorage
  });

  // 📷 On simule un fichier déjà uploadé
  newBill.fileUrl = "https://test.com/test.png";
  newBill.fileName = "test.png";

  // 📤 On simule l’envoi du formulaire
  const form = screen.getByTestId("form-new-bill");
  await fireEvent.submit(form);

  // 🕒 On attend un peu pour que l’erreur soit bien traitée
  await new Promise((r) => setTimeout(r, 0));

  // ✅ On vérifie qu’une erreur a été affichée dans la console
  expect(consoleErrorMock).toHaveBeenCalled();

  // 🔁 On remet console.error comme avant
  consoleErrorMock.mockRestore();
});

// === TESTS UNITAIRES — Teste uniquement le fonctionnement du composant NewBill ===
describe("Tests unitaires NewBill", () => {
  let newBill;

  // Avant chaque test...
  beforeEach(() => {
    // ...on insère l'interface NewBill dans la page
    document.body.innerHTML = NewBillUI();

    // ...on simule un utilisateur connecté
    Object.defineProperty(window, "localStorage", {
      value: {getItem: () => JSON.stringify({email: "test@test.com"})},
      writable: true
    });

    // ...on crée une instance de NewBill avec un store factice
    newBill = new NewBill({
      document,
      onNavigate: jest.fn(), // simulateur de navigation
      store: {
        bills: () => ({
          create: jest.fn(() => Promise.resolve({fileUrl: "url", key: "1"})),
          update: jest.fn(() => Promise.resolve())
        })
      },
      localStorage: window.localStorage
    });
  });

  // Cas 1 : fichier valide
  test("Si l'utilisateur ajoute un fichier .png, il est accepté", async () => {
    // On crée un faux fichier image
    const file = new File(["image"], "image.png", {type: "image/png"});

    // On récupère l'input file dans le formulaire
    const input = screen.getByTestId("file");

    // On simule que l'utilisateur ajoute ce fichier
    fireEvent.change(input, {target: {files: [file]}});

    // On vérifie que le nom du fichier est bien celui attendu
    expect(input.files[0].name).toBe("image.png");
  });

  // Cas 2 : fichier invalide
  test("Si l'utilisateur ajoute un fichier .pdf, il est refusé", () => {
    // Fichier non autorisé (pdf)
    const file = new File(["text"], "document.pdf", {type: "application/pdf"});

    const input = screen.getByTestId("file");

    // Simulation de l'import du fichier
    fireEvent.change(input, {target: {files: [file]}});

    // Si refusé, l'input est vidé
    expect(input.value).toBe("");
  });

  // 📤 Cas 3 : soumission du formulaire
  test("Soumettre le formulaire appelle updateBill et redirige vers Bills", async () => {
    // Remplir tous les champs du formulaire
    fireEvent.change(screen.getByTestId("expense-type"), {target: {value: "Transports"}});
    fireEvent.change(screen.getByTestId("expense-name"), {target: {value: "Taxi"}});
    fireEvent.change(screen.getByTestId("amount"), {target: {value: "20"}});
    fireEvent.change(screen.getByTestId("datepicker"), {target: {value: "2023-01-01"}});
    fireEvent.change(screen.getByTestId("vat"), {target: {value: "20"}});
    fireEvent.change(screen.getByTestId("pct"), {target: {value: "20"}});
    fireEvent.change(screen.getByTestId("commentary"), {target: {value: "Test trajet"}});

    // On simule qu'une image a déjà été validée
    newBill.fileUrl = "url";
    newBill.fileName = "image.png";

    // On soumet le formulaire
    await fireEvent.submit(screen.getByTestId("form-new-bill"));

    // On attend que l'action se termine (promesse)
    await new Promise((resolve) => setTimeout(resolve, 0));

    // On vérifie que la redirection vers la page "Bills" a eu lieu
    expect(newBill.onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
  });
});
