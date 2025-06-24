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

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
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
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({data: bills});
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});

// === TEST 1: getBills should fetch and return sorted, formatted bills ===
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
    expect(result).toHaveLength(2);
    expect(new Date(result[0].date) >= new Date(result[1].date)).toBe(true);
  });

  // === TEST 2: getBills with formatting error should still return unformatted date ===
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
    expect(result[0].date).toBe("bad-date");
    expect(result[0].status).toBe("En attente"); // formatStatus still applied
  });

  // === TEST 3: getBills with no store should return undefined ===
  test("Then if store is not defined, getBills should return undefined", async () => {
    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: null,
      localStorage: window.localStorage
    });

    const result = await billsInstance.getBills();
    expect(result).toBeUndefined();
  });
});
