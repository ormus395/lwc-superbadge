import { createElement } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import BoatMap from "../boatMap";
import { subscribe, MessageContext, publish } from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";

const mockGetRecord = require("./data/getRecord.json");

describe("c-boat-map", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("shouldn't display a map if there is no selected boat", () => {
    const boatMap = createElement("c-boat-map", {
      is: BoatMap
    });

    document.body.appendChild(boatMap);

    const content = boatMap.shadowRoot.querySelector("span");
    expect(content.textContent).toBe(
      "Please select a boat to see its location!"
    );
  });

  it("registers LMS subscriber on mount", () => {
    const boatMap = createElement("c-boat-map", { is: BoatMap });

    document.body.appendChild(boatMap);
    expect(subscribe).toHaveBeenCalled();
    expect(subscribe.mock.calls[0][1]).toBe(BOATMC);
  });

  it("invokes getRecord with the published message payload value", () => {
    const boatMap = createElement("c-boat-map", {
      is: BoatMap
    });
    document.body.appendChild(boatMap);

    return Promise.resolve().then(() => {
      const messagePayload = { recordId: "a028b000027JEk8AAG" };
      publish(MessageContext, BOATMC, messagePayload);

      const { recordId } = boatMap;
      expect(recordId).toEqual(messagePayload.recordId);
    });
  });

  describe("getRecord @wire data", () => {
    it("renders a map once a boat is selected", () => {
      const boatMap = createElement("c-boat-map", {
        is: BoatMap
      });
      document.body.appendChild(boatMap);
      getRecord.emit(mockGetRecord);

      return Promise.resolve().then(() => {
        const messagePayload = { recordId: "a028b000027JEk8AAG" };
        publish(MessageContext, BOATMC, messagePayload);

        const map = boatMap.shadowRoot.querySelector("lightning-map");
        expect(map).not.toBeNull();
      });
    });

    it("handles an error from getRecord", () => {
      const boatMap = createElement("c-boat-map", { is: BoatMap });
      document.body.appendChild(boatMap);

      getRecord.error();

      return Promise.resolve().then(() => {
        const span = boatMap.shadowRoot.querySelector("span");
        expect(span.textContent.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
