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

    element.shadowRoot
      .querySelector("lightning-record-edit-form")
      .dispatchEvent(new CustomEvent("success"));

    await resolvePromise();

    expect(handler).toHaveBeenCalled();
  });

  it("handles record submit", async () => {
    const fields = {
      Name: "AA",
      Comment__c: "A TESTED COMMENT"
    };
    const handler = jest.fn();
    const element = createElement("c-boat-add-review-form", {
      is: BoatAddReviewForm
    });
    element.recordId = "AABBCC";
    document.body.appendChild(element);

    await resolvePromise();

    const form = element.shadowRoot.querySelector("lightning-record-edit-form");
    form.submit = handler;

    await resolvePromise();
    form.dispatchEvent(
      new CustomEvent("submit", { detail: { fields: fields } })
    );
    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(fields);
  });
});

/*

Need to test handleSuccess for form submission
it should dispatch a toast event on successful submissiom

*/
