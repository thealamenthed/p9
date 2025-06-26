/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import {bills} from "../fixtures/bills.js";
import {ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

// === TESTS UNITAIRES — Vérifie les éléments à l'écran et le tri des dates ===
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    // === Test 1 — L'icône "bills" est bien surlignée (actif) ===
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {value: localStorageMock});
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee"
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true); // Check if the icon is highlighted
    });

    // === TEST 2:  Les bills sont triés du plus récent au plus ancien ===
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({data: bills});
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});

// === TESTS D'INTÉGRATION — Vérifie le comportement de getBills avec des données API ===
describe("Given I am connected as an employee and Bills are available", () => {
  test("Then getBills should return bills sorted and formatted", async () => {
    const storeMock = {
      bills: () => ({
        list: () =>
          Promise.resolve([
            {id: "1", date: "2022-01-01", status: "pending"},
            {id: "2", date: "2022-03-01", status: "accepted"}
          ])
      })
    };

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: storeMock,
      localStorage: window.localStorage
    });

    const result = await billsInstance.getBills();
    expect(result).toHaveLength(2); // On a bien reçu 2 éléments
    expect(new Date(result[0].date) >= new Date(result[1].date)).toBe(true); // Le premier élément est plus récent ou égal au second
  });

  // === TEST 2: Si la date est mauvaise, elle est affichée brute (non formatée) ===
  test("Then if date formatting fails, getBills returns raw data", async () => {
    const storeMock = {
      bills: () => ({
        list: () => Promise.resolve([{id: "1", date: "bad-date", status: "pending"}])
      })
    };

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: storeMock,
      localStorage: window.localStorage
    });

    const result = await billsInstance.getBills();
    expect(result[0].date).toBe("bad-date"); // date non modifiée
    expect(result[0].status).toBe("En attente"); // status formaté
  });

  // === TEST 3: Si le store n’existe pas, on retourne undefined ===
  test("Then if store is not defined, getBills should return undefined", async () => {
    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: null,
      localStorage: window.localStorage
    });

    const result = await billsInstance.getBills();
    expect(result).toBeUndefined(); // retourne bien undefined si aucun store
  });
});
