import { createElement } from "lwc";
import { getNavigateCalledWith } from "lightning/navigation";
import BoatSearch from "../boatSearch";

describe("c-boat-search", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("handles loading events", () => {
    const handler = jest.fn();

    const comp = createElement("c-boat-search", {
      is: BoatSearch
    });
    document.body.appendChild(comp);

    return Promise.resolve().then(() => {
      let loadedComps = comp.shadowRoot.querySelector("c-boat-search-results");
      loadedComps.addEventListener("loading", handler);
      loadedComps.dispatchEvent(new CustomEvent("loading"));

      expect(handler).toBeCalledTimes(1);
    });
  });

  it("handles doneloading events", () => {
    const handler = jest.fn();

    const comp = createElement("c-boat-search", {
      is: BoatSearch
    });
    document.body.appendChild(comp);

    return Promise.resolve().then(() => {
      let loadedComps = comp.shadowRoot.querySelector("c-boat-search-results");
      loadedComps.addEventListener("doneloading", handler);
      loadedComps.dispatchEvent(new CustomEvent("doneloading"));

      expect(handler).toBeCalledTimes(1);
    });
  });

  it("fires a method when listening to search from child", async () => {
    const handler = jest.fn((x) => console.log(x.detail.boatTypeId));
    const element = createElement("c-boat-search", { is: BoatSearch });
    document.body.appendChild(element);

    element.addEventListener("search", handler);

    await Promise.resolve();

    return Promise.resolve().then(() => {
      const firesSearch =
        element.shadowRoot.querySelector("c-boat-search-form");
      firesSearch.dispatchEvent(
        new CustomEvent("search", {
          detail: { boatTypeId: "A" },
          composed: true,
          bubbles: true
        })
      );

      expect(handler).toHaveBeenCalled();
    });
  });

  it("navigates to new boat record", () => {
    const NAV_TYPE = "standard__objectPage";
    const NAV_OBJECT_API_NAME = "Boat__c";
    const NAV_ACTION_NAME = "new";

    const element = createElement("c-boat-search", { is: BoatSearch });
    document.body.appendChild(element);

    return Promise.resolve().then(() => {
      const buttonEl = element.shadowRoot.querySelector("lightning-button");
      buttonEl.click();

      const { pageReference } = getNavigateCalledWith();

      expect(pageReference.type).toBe(NAV_TYPE);
      expect(pageReference.attributes.objectApiName).toBe(NAV_OBJECT_API_NAME);
      expect(pageReference.attributes.actionName).toBe(NAV_ACTION_NAME);
    });
  });
});
