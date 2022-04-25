import { createElement } from "lwc";
import { getNavigateCalledWith } from "lightning/navigation";
import getSimilarBoats from "@salesforce/apex/BoatDataService.getSimilarBoats";
import SimilarBoats from "c/similarBoats";
jest.mock(
  "@salesforce/apex/BoatDataService.getSimilarBoats",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return { default: createApexTestWireAdapter(jest.fn()) };
  },
  { virtual: true }
);

const MOCK_SIMILAR_BOATS = require("./data/getSimilarBoats.json");

describe("c-similar-boats", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  // test public properties and methods
  it("has public propert recordId, and similarBy", () => {
    const RECORD_ID = "AAVVCC";
    const SIMILAR_BY = "Type";
    const element = createElement("c-similar-boats", {
      is: SimilarBoats
    });
    element.recordId = RECORD_ID;
    element.similarBy = SIMILAR_BY;

    document.body.appendChild(element);

    return Promise.resolve().then(() => {
      expect(element.recordId).toBe(RECORD_ID);
      expect(element.similarBy).toBe(SIMILAR_BY);
    });
  });

  it("retreives and renders a list of similar boats by specified filter", async () => {
    // getSimilarBoats.mockReturnedValue(MOCK_SIMILAR_BOATS);
    const element = createElement("c-similar-boats", { is: SimilarBoats });
    element.RECORD_ID = "AAVVCC";
    element.similarBy = "Price";

    document.body.appendChild(element);

    getSimilarBoats.emit(MOCK_SIMILAR_BOATS);

    await Promise.resolve();

    const similarBoats = element.shadowRoot.querySelectorAll("c-boat-tile");

    expect(similarBoats.length).toBe(MOCK_SIMILAR_BOATS.length);
  });

  it("navigates to a similar boat record page", async () => {
    const NAV_TYPE = "standard__recordPage";
    const NAV_OBJECT_API_NAME = "Boat__c";
    const NAV_ACTION = "view";

    const element = createElement("c-similar-boats", {
      is: SimilarBoats
    });
    element.recordId = "AABBCC";
    element.similarBy = "Type";
    document.body.appendChild(element);

    getSimilarBoats.emit(MOCK_SIMILAR_BOATS);

    await Promise.resolve();

    const boatTile = element.shadowRoot.querySelector("c-boat-tile");
    boatTile.dispatchEvent(
      new CustomEvent("boatselect", {
        detail: { boatId: "a028b000027JEk9AAG" }
      })
    );

    const { pageReference } = getNavigateCalledWith();

    expect(pageReference.type).toBe(NAV_TYPE);
    expect(pageReference.attributes.objectApiName).toBe(NAV_OBJECT_API_NAME);
    expect(pageReference.attributes.actionName).toBe(NAV_ACTION);
  });
});
