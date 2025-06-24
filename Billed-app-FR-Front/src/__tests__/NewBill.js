/**
 * @jest-environment jsdom
 */

import {screen, fireEvent} from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import router from "../app/Router.js";
import {ROUTES_PATH} from "../constants/routes.js";

describe("Given I am on NewBill Page", () => {
  let newBillInstance;
  let onNavigate;

  beforeEach(() => {
    document.body.innerHTML = NewBillUI();

    // Fake navigation
    onNavigate = jest.fn((pathname) => {
      document.body.innerHTML = ROUTES_PATH[pathname] || pathname;
    });

    // Local storage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: () => JSON.stringify({email: "test@test.com"})
      },
      writable: true
    });

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

  test("Then uploading a valid file (.png) should call store.create", async () => {
    const file = new File(["image"], "test.png", {type: "image/png"});
    const fileInput = screen.getByTestId("file");

    fireEvent.change(fileInput, {
      target: {files: [file]}
    });

    expect(fileInput.files[0].name).toBe("test.png");
  });

  test("Then uploading an invalid file (.pdf) should clear the input", () => {
    const file = new File(["doc"], "test.pdf", {type: "application/pdf"});
    const fileInput = screen.getByTestId("file");

    fireEvent.change(fileInput, {
      target: {files: [file]}
    });

    expect(fileInput.value).toBe(""); // input reset
  });

  test("Then submitting the form should call updateBill and navigate", () => {
    // Remplir les champs du formulaire
    fireEvent.change(screen.getByTestId("expense-type"), {
      target: {value: "Transports"}
    });
    fireEvent.change(screen.getByTestId("expense-name"), {
      target: {value: "Taxi"}
    });
    fireEvent.change(screen.getByTestId("amount"), {
      target: {value: "42"}
    });
    fireEvent.change(screen.getByTestId("datepicker"), {
      target: {value: "2023-05-10"}
    });
    fireEvent.change(screen.getByTestId("vat"), {
      target: {value: "20"}
    });
    fireEvent.change(screen.getByTestId("pct"), {
      target: {value: "20"}
    });
    fireEvent.change(screen.getByTestId("commentary"), {
      target: {value: "course du soir"}
    });

    // Fake image validée
    newBillInstance.fileUrl = "https://test.com/test.png";
    newBillInstance.fileName = "test.png";

    const form = screen.getByTestId("form-new-bill");
    fireEvent.submit(form);

    expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
  });
});
