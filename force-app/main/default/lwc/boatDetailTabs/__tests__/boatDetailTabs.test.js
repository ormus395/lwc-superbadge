import { createElement } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { getNavigateCalledWith } from "lightning/navigation";
import { subscribe, MessageContext, publish } from "lightning/messageService";
import BoatDetailTabs from "../boatDetailTabs";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";

const BOAT_TABS = "c-boat-detail-tabs";
const mockGetRecord = require("./data/getRecord.json");

describe("c-boat-detail-tabs", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  async function resolvePromises() {
    return Promise.resolve();
  }

  it("registers LMS subscribe on mount", () => {
    const element = createElement(BOAT_TABS, { is: BoatDetailTabs });
    document.body.appendChild(element);

    expect(subscribe).toHaveBeenCalled();
  });

  it("gets boat record data", async () => {
    const element = createElement(BOAT_TABS, { is: BoatDetailTabs });
    document.body.appendChild(element);

    const messagePayload = { recordId: "AABBCC" };
    publish(MessageContext, BOATMC, messagePayload);

    await resolvePromises();

    const { recordId } = getRecord.getLastConfig();
    expect(recordId).toEqual(messagePayload.recordId);
  });

  it("navigates to a record detail page", async () => {
    const NAV_TYPE = "standard__recordPage";
    const NAV_OBJECT_API_NAME = "Boat__c";
    const NAV_ACTION = "view";

    const element = createElement("c-boat-details-tab", { is: BoatDetailTabs });
    document.body.appendChild(element);

    getRecord.emit(mockGetRecord);

    await resolvePromises();

    const buttonEl = element.shadowRoot.querySelector("lightning-button");
    buttonEl.click();
    const { pageReference } = getNavigateCalledWith();

    expect(pageReference.type).toBe(NAV_TYPE);
    expect(pageReference.attributes.objectApiName).toBe(NAV_OBJECT_API_NAME);
    expect(pageReference.attributes.actionName).toBe(NAV_ACTION);
  });

  it("handles review creation and switches active tab", async () => {
    const element = createElement("c-boat-details-tab", {
      is: BoatDetailTabs
    });
    document.body.appendChild(element);

    getRecord.emit(mockGetRecord);

    await Promise.resolve();

    const addReviewForm = element.shadowRoot.querySelector(
      "c-boat-add-review-form"
    );
    addReviewForm.dispatchEvent(new CustomEvent("createreview"));

    const activeTab = element.shadowRoot.querySelector("lightning-tabset");

    return Promise.resolve().then(() => {
      expect(activeTab.activeTabValue).toBe("reviews");
    });
  });
});
