import { createElement } from "lwc";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import BoatsNearMe from "../boatsNearMe";

const mockGetBoatsByLocation = require("./data/getBoatsByLocation.json");
const mockGeolocationSuccess = {
  getCurrentPosition: jest.fn().mockImplementation((success) =>
    Promise.resolve(
      success({
        coords: {
          latitude: 11,
          longsitude: -111
        }
      })
    )
  )
};

const mockGeolocationError = {
  getCurrentPosition: jest
    .fn()
    .mockImplementation((success, error) =>
      Promise.resolve(error({ code: 1, message: "Error" }))
    )
};

function flushPromises() {
  return Promise.resolve();
}
describe("c-boats-near-me", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  describe("components @wire", () => {
    it("should get a list of boats near user", () => {
      const comp = createElement("c-boats-near-me", {
        is: BoatsNearMe
      });
      document.body.appendChild(comp);
      comp.boatTypeId = "";

      getBoatsByLocation.emit(mockGetBoatsByLocation);

      return Promise.resolve().then(() => {
        const mapWithMarkers = comp.shadowRoot.querySelector("lightning-map");
        const markers = mapWithMarkers.mapMarkers;
        expect(markers.length).toBeGreaterThan(0);
      });
    });

    it("should toast a message on wire error", () => {
      const handler = jest.fn();
      const comp = createElement("c-boats-near-me", {
        is: BoatsNearMe
      });

      document.body.appendChild(comp);
      comp.addEventListener("lightning__showtoast", handler);

      getBoatsByLocation.error();

      return Promise.resolve().then(() => {
        expect(handler).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("get location behavior", () => {
    it("should get location from the user", () => {
      navigator.geolocation = mockGeolocationSuccess;

      const element = createElement("c-boats-near-me", {
        is: BoatsNearMe
      });
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        expect(mockGeolocationSuccess.getCurrentPosition).toHaveBeenCalled();
      });
    });

    it("should handle on geolocation error", async () => {
      navigator.geolocation = mockGeolocationError;
      const toastHandler = jest.fn();

      const element = createElement("c-boats-near-me", {
        is: BoatsNearMe
      });
      document.body.appendChild(element);
      element.addEventListener("lightning__showtoast", toastHandler);

      await flushPromises();
      expect(mockGeolocationError.getCurrentPosition).toHaveBeenCalled();
    });
  });
});
