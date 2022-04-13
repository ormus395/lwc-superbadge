import { createElement } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import BoatSearchResults from "../boatSearchResults";
// import BoatTile from "../boatTile";

const mockGetBoats = require("./data/getBoats.json");

describe("c-boat-search-results", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it("should render list of boat tiles", () => {
    const comp = createElement("c-boat-search-results", {
      is: BoatSearchResults
    });
    document.body.appendChild(comp);

    getBoats.emit(mockGetBoats);

    return Promise.resolve().then(() => {
      const boatTiles = comp.shadowRoot.querySelectorAll("c-boat-tile");

      expect(boatTiles.length).toBe(mockGetBoats.length);
    });
  });
});
