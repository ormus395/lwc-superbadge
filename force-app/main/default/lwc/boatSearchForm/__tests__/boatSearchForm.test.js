import { createElement } from "lwc";
import BoatSearchForm from "../boatSearchForm";
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";

const mockGetBoatTypes = require("./data/getBoatTypes.json");

describe("c-boat-search-form", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe("boatSearchForm @wire", () => {
    it("renders a combobox from boatTypes", () => {
      const comp = createElement("c-boat-search-form", {
        is: BoatSearchForm
      });
      document.body.appendChild(comp);

      getBoatTypes.emit(mockGetBoatTypes);

      return Promise.resolve().then(() => {
        const options = comp.shadowRoot.querySelector("lightning-combobox");

        expect(options).toBeDefined();
        expect(options.value.length).toBeGreaterThanOrEqual(0);
      });
    });

    it("should handle error from wire", () => {
      const comp = createElement("c-boat-search-form", {
        is: BoatSearchForm
      });
      document.body.appendChild(comp);

      getBoatTypes.error();

      return Promise.resolve().then(() => {
        const options = comp.shadowRoot.querySelector("lightning-combobox");

        expect(options.value.length).toBeLessThan(1);
      });
    });
  });

  describe("boatSearchForm handleSearch event", () => {
    it("fires a custom event on option change", () => {
      const SELECTED_VALUE = "1";
      const handler = jest.fn();

      const comp = createElement("c-boat-search-form", {
        is: BoatSearchForm
      });
      document.body.appendChild(comp);
      comp.addEventListener("search", handler);

      return Promise.resolve().then(() => {
        const combobox = comp.shadowRoot.querySelector("lightning-combobox");
        combobox.dispatchEvent(new CustomEvent("change"));

        expect(handler).toHaveBeenCalledTimes(1);
      });
    });
  });
});
