import { createElement } from "lwc";
import BoatAddReviewForm from "../boatAddReviewForm";
// Tests from this compoennt

describe("c-boat-add-review-form", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    jest.clearAllMocks();
  });

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

  it("fires a success toast on successful form submission", () => {
      
  });
});

/*

Need to test handleSuccess for form submission
it should dispatch a toast event on successful submissiom

*/
