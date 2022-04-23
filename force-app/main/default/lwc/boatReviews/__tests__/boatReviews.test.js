import { createElement } from "lwc";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";
import BoatReviews from "../boatReviews";

jest.mock(
  "@salesforce/apex/BoatDataService.getAllReviews",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

const mockGetAllReviews = require("./data/getAllReviews.json");

describe("c-boat-reviews", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it("gets a list of boatReviews", () => {
    const BOAT_ID = "a028b000027JEkAAAW";
    const element = createElement("c-boat-reviews", { is: BoatReviews });
    element.recordId = BOAT_ID;

    document.body.appendChild(element);
  });
});
