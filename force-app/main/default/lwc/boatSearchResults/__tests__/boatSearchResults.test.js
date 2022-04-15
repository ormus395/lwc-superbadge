import { createElement } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import refreshApex from "@salesforce/apex";
import { ShowToastEventName } from "lightning/platformShowToastEvent";
import BoatSearchResults from "../boatSearchResults";
// import BoatTile from "../boatTile";

const mockGetBoats = require("./data/getBoats.json");
const mockGetBoatsByLocation = require("./data/getBoatsByLocation.json");

jest.mock(
  "@salesforce/apex/BoatDataService.getBoats",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/BoatDataService.getBoatsByLocation",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex/BoatDataService.updateBoatList",
  () => {
    return {
      default: jest.fn(() => Promise.resolve())
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex",
  () => {
    return {
      refreshApex: jest.fn(() => Promise.resolve())
    };
  },
  { virtual: true }
);

async function flushPromises() {
  return Promise.resolve();
}

const DRAFT_VALUES = [
  {
    Name: "Hobartaz",
    Description__c:
      "This boat comes as it is, so you come as you are, not fancy, but very reliable.",
    Length__c: 6,
    Price__c: 787,
    Id: "a028b000027JEl2AAG"
  },
  {
    Name: "Strathgordon",
    Description__c:
      "We went on a trip accross the bay, and we felt safe at all times. Recommended.",
    Length__c: 16,
    Price__c: 156000,
    Id: "a028b000027JEl3AAG"
  },
  {
    Name: "Albert Leichhardt",
    Description__c: "A boat that is so much fun, the world will speak for her.",
    Length__c: 17,
    Price__c: 413000,
    Id: "a028b000027JEl4AAG"
  }
];

const UPDATE_ERROR = {
  body: { message: "An internal server error occured" },
  ok: false,
  status: 400,
  statusText: "Bad Request"
};

describe("c-boat-search-results", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it("should render list of boat tiles", async () => {
    const comp = createElement("c-boat-search-results", {
      is: BoatSearchResults
    });
    document.body.appendChild(comp);

    getBoats.emit(mockGetBoats);

    return Promise.resolve().then(() => {
      return Promise.resolve().then(() => {
        const boatTiles = comp.shadowRoot.querySelectorAll("c-boat-tile");

        expect(boatTiles).toBeDefined();
        expect(boatTiles.length).toBe(mockGetBoats.length);
      });
    });
  });

  it("should have a searchBoats api method", () => {
    const element = createElement("c-boat-search-results", {
      is: BoatSearchResults
    });

    document.body.appendChild(element);

    return Promise.resolve().then(() => {
      expect(element.searchBoats).toBeDefined();
    });
  });

  it("should handle boat tile select", () => {
    const handler = jest.fn();
    const comp = createElement("c-boat-search-results", {
      is: BoatSearchResults
    });
    document.body.appendChild(comp);

    comp.addEventListener("boatselect", handler);

    getBoats.emit(mockGetBoats);

    return Promise.resolve().then(() => {
      const boatTile = comp.shadowRoot.querySelector("c-boat-tile");
      boatTile.dispatchEvent(
        new CustomEvent("boatselect", {
          detail: { boatId: "1" }
        })
      );
      return Promise.resolve().then(() => {
        expect(boatTile.selectedBoatId).toBe("1");
      });
    });
  });

  it("has clickable boat tiles that dispatch a boat select event", () => {
    const comp = createElement("c-boat-search-results", {
      is: BoatSearchResults
    });
    document.body.appendChild(comp);

    getBoats.emit(mockGetBoats);

    return Promise.resolve().then(() => {
      const mockhandler = jest.fn();
      const boatTile = comp.shadowRoot.querySelector("c-boat-tile");
      const clickable = boatTile.shadowRoot.querySelector(".tile-wrapper");
      clickable.addEventListener("click", mockhandler);

      return Promise.resolve().then(() => {
        clickable.dispatchEvent(new CustomEvent("click"));
        expect(mockhandler).toHaveBeenCalled();
      });
    });
  });

  it("updates the records on save", () => {
    const INPUT_PARAMS = [{ data: DRAFT_VALUES }];
    const element = createElement("c-boat-search-results", {
      is: BoatSearchResults
    });
    document.body.appendChild(element);

    getBoats.emit(mockGetBoats);

    return Promise.resolve().then(() => {
      const table = element.shadowRoot.querySelector("lightning-datatable");
      table.dispatchEvent(
        new CustomEvent("save", {
          detail: { draftValues: DRAFT_VALUES }
        })
      );

      return Promise.resolve().then(() => {
        expect(updateBoatList).toHaveBeenCalled();
        expect(updateBoatList.mock.calls[0]).toEqual(INPUT_PARAMS);
      });
    });
  });

  it("displays a success toast after record is updated", async () => {
    const INPUT_PARAMS = [{ data: DRAFT_VALUES }];

    updateBoatList.mockResolvedValue(INPUT_PARAMS);

    const element = createElement("c-boat-search-results", {
      is: BoatSearchResults
    });
    document.body.appendChild(element);

    const toastHandler = jest.fn();

    element.addEventListener(ShowToastEventName, toastHandler);

    await flushPromises();

    getBoats.emit(mockGetBoats);

    await flushPromises();

    const table = element.shadowRoot.querySelector("lightning-datatable");
    table.dispatchEvent(
      new CustomEvent("save", {
        detail: { draftValues: DRAFT_VALUES }
      })
    );

    await flushPromises();

    expect(toastHandler).toHaveBeenCalled();
    expect(refreshApex).toHaveBeenCalled();
  });

  it("displays an error toast on update error", async () => {
    const element = createElement("c-boat-search-results", {
      is: BoatSearchResults
    });
    const handler = jest.fn();
    document.body.appendChild(element);
    element.addEventListener(ShowToastEventName, handler);

    await flushPromises();

    getBoats.emit(mockGetBoats);

    await flushPromises();

    updateBoatList.mockRejectedValue(UPDATE_ERROR);

    const table = element.shadowRoot.querySelector("lightning-datatable");
    table.dispatchEvent(
      new CustomEvent("save", {
        detail: {
          draftValues: []
        }
      })
    );

    await flushPromises();

    expect(handler).toHaveBeenCalled();
  });

  describe("components @api properties and methods", () => {
    afterEach(() => {
      while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      jest.clearAllMocks();
    });

    it("has a public searchBoats method", () => {
      const element = createElement("c-boat-search-results", {
        is: BoatSearchResults
      });

      expect(element.searchBoats).toBeDefined();
      expect(element.refresh).toBeDefined();
    });
  });
});
