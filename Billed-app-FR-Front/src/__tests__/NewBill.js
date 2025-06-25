/**
 * @jest-environment jsdom
 */

import {screen, fireEvent} from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import {ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

//
// TESTS D’INTÉGRATION — Simulent une interaction avec l'API (mockée)
//
describe("Tests d'intégration pour NewBill", () => {
  beforeEach(() => {
    // Affiche l'interface de NewBill
    document.body.innerHTML = NewBillUI();

    // Mock de localStorage
    Object.defineProperty(window, "localStorage", {value: localStorageMock});
    window.localStorage.setItem("user", JSON.stringify({type: "Employee", email: "a@a"}));
  });

  test("Si l'API retourne une erreur 404 sur updateBill, alors une erreur est loggée", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock de store avec une erreur 404
    const storeMock = {
      bills: () => ({
        update: jest.fn(() => Promise.reject(new Error("Erreur 404")))
      })
    };

    const onNavigate = jest.fn();
    const newBillInstance = new NewBill({document, onNavigate, store: storeMock, localStorage: window.localStorage});
    newBillInstance.fileUrl = "https://test.com/test.png";
    newBillInstance.fileName = "test.png";

    const form = screen.getByTestId("form-new-bill");
    await fireEvent.submit(form);
    await new Promise((resolve) => setTimeout(resolve, 0)); // attendre que la promesse soit rejetée

    expect(consoleErrorMock).toHaveBeenCalled(); // on vérifie que l’erreur est bien loggée
    consoleErrorMock.mockRestore(); // on restaure le comportement normal de console.error
  });

  test("Si l'API retourne une erreur 500 sur updateBill, alors une erreur est loggée", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    const storeMock = {
      bills: () => ({
        update: jest.fn(() => Promise.reject(new Error("Erreur 500")))
      })
    };

    const onNavigate = jest.fn();
    const newBillInstance = new NewBill({document, onNavigate, store: storeMock, localStorage: window.localStorage});
    newBillInstance.fileUrl = "https://test.com/test.png";
    newBillInstance.fileName = "test.png";

    const form = screen.getByTestId("form-new-bill");
    await fireEvent.submit(form);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleErrorMock).toHaveBeenCalled();
    consoleErrorMock.mockRestore();
  });
});

//
// TESTS UNITAIRES — On vérifie uniquement le comportement local du composant NewBill
//
describe("Tests unitaires pour NewBill", () => {
  let newBillInstance;
  let onNavigate;

  beforeEach(() => {
    document.body.innerHTML = NewBillUI();

    // Simule un utilisateur connecté
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: () => JSON.stringify({email: "test@test.com"})
      },
      writable: true
    });

    // Mock de la navigation
    onNavigate = jest.fn((pathname) => {
      document.body.innerHTML = ROUTES_PATH[pathname] || pathname;
    });

    // Instance de NewBill avec store mocké
    newBillInstance = new NewBill({
      document,
      onNavigate,
      store: {
        bills: () => ({
          create: jest.fn(() => Promise.resolve({fileUrl: "https://test.com/file.jpg", key: "1234"})),
          update: jest.fn(() => Promise.resolve({}))
        })
      },
      localStorage: window.localStorage
    });
  });

  test("L'import d'un fichier valide (.png) devrait fonctionner", async () => {
    const file = new File(["image"], "test.png", {type: "image/png"});
    const fileInput = screen.getByTestId("file");

    fireEvent.change(fileInput, {target: {files: [file]}});

    expect(fileInput.files[0].name).toBe("test.png");
  });

  test("L'import d'un fichier invalide (.pdf) devrait vider le champ", () => {
    const file = new File(["doc"], "test.pdf", {type: "application/pdf"});
    const fileInput = screen.getByTestId("file");

    fireEvent.change(fileInput, {target: {files: [file]}});
    expect(fileInput.value).toBe(""); // Le champ est vidé
  });

  test("Soumettre le formulaire appelle updateBill et redirige vers Bills", async () => {
    // On remplit les champs du formulaire
    fireEvent.change(screen.getByTestId("expense-type"), {target: {value: "Transports"}});
    fireEvent.change(screen.getByTestId("expense-name"), {target: {value: "Taxi"}});
    fireEvent.change(screen.getByTestId("amount"), {target: {value: "42"}});
    fireEvent.change(screen.getByTestId("datepicker"), {target: {value: "2023-05-10"}});
    fireEvent.change(screen.getByTestId("vat"), {target: {value: "20"}});
    fireEvent.change(screen.getByTestId("pct"), {target: {value: "20"}});
    fireEvent.change(screen.getByTestId("commentary"), {target: {value: "course du soir"}});

    // Mock d'image valide
    newBillInstance.fileUrl = "https://test.com/test.png";
    newBillInstance.fileName = "test.png";

    const form = screen.getByTestId("form-new-bill");
    await fireEvent.submit(form);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
  });
});
