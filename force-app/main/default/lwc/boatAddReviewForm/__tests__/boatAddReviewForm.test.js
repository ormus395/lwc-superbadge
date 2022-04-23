import { createElement } from "lwc";
import { createRecord } from "lightning/uiRecordApi";
import { ShowToastEventName } from "lightning/platformShowToastEvent";
import BoatAddReviewForm from "../boatAddReviewForm";
// Tests from this compoennt

const mockCreateRecord = require("./data/createRecord.json");

describe("c-boat-add-review-form", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

  async function resolvePromise() {
    return Promise.resolve();
  }

  it("has a public api recordId", () => {
    const element = createElement("c-boat-add-review-form", {
      is: BoatAddReviewForm
    });
    element.recordId = "AABBCC";
    document.body.appendChild(element);

    return Promise.resolve().then(() => {
      expect(element.recordId).toBe("AABBCC");
    });
  });

  it("renders lightning-record-edit form with given values", () => {
    const RECORD_ID_INPUT = "AAVVCC";
    const OBJECT_API_NAME_INPUT = "BoatReview__c";

    const element = createElement("c-boat-add-review-form", {
      is: BoatAddReviewForm
    });
    element.recordId = RECORD_ID_INPUT;
    document.body.appendChild(element);

    const formEl = element.shadowRoot.querySelector(
      "lightning-record-edit-form"
    );
    expect(formEl.recordId).toBe(RECORD_ID_INPUT);

    const buttonEl = element.shadowRoot.querySelector("lightning-button");
    expect(buttonEl.type).toBe("submit");
  });

  it("fires a success toast on successful form submission", async () => {
    const handler = jest.fn();
    const element = createElement("c-boat-add-review-form", {
      is: BoatAddReviewForm
    });
    element.recordId = "AABBCC";
    document.body.appendChild(element);

    createRecord.mockResolvedValue(mockCreateRecord);

    element.addEventListener(ShowToastEventName, handler);

    await resolvePromise();

    const buttonEl = element.shadowRoot.querySelector("lightning-button");
    buttonEl.click();

    await resolvePromise();

    expect(handler).toHaveBeenCalled();
  });

  it("creates a boat review record", async () => {
    const element = createElement("c-boat-add-review-form", {
      is: BoatAddReviewForm
    });
    element.recordId = "AABBCC";
    document.body.appendChild(element);

    await resolvePromise();

    const form = element.shadowRoot.querySelector("lightning-record-edit-form");
    form.dispatchEvent(new CustomEvent("submit"));
  });
});

/*

Need to test handleSuccess for form submission
it should dispatch a toast event on successful submissiom

*/
