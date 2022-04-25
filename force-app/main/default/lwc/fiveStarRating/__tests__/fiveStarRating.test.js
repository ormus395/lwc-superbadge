import { createElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { ShowToastEventName } from "lightning/platformShowToastEvent";
import FiveStarRating from "../fiveStarRating";

const ERROR_TITLE = "Error loading five-star";

describe("c-five-star-rating", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  async function resolvePromises() {
    return Promise.resolve();
  }

  it("should have two public properties: readOnly and value", () => {
    const element = createElement("c-five-star-rating", {
      is: FiveStarRating
    });
    element.readOnly = true;
    element.value = 5;
    document.body.appendChild(element);

    return Promise.resolve().then(() => {
      expect(element.readOnly).toBeDefined();
      expect(element.value).toBeDefined();
      expect(element.readOnly).toBe(true);
      expect(element.value).toBe(5);
    });
  });

  it("loads the fivestar js and css static resources", () => {
    const handler = jest.fn();
    const element = createElement("c-five-star-rating", {
      is: FiveStarRating
    });
    document.body.appendChild(element);

    element.addEventListener("ratingchange", handler);

    expect(loadScript.mock.calls.length).toBe(1);
    expect(loadStyle.mock.calls.length).toBe(1);
  });

  it("fires a toast event if the static resource fails to load", async () => {
    loadScript.mockRejectedValue(ERROR_TITLE);

    const element = createElement("c-five-star-rating", {
      is: FiveStarRating
    });
    document.body.appendChild(element);

    await resolvePromises();

    const handler = jest.fn();

    document.body.addEventListener(ShowToastEventName, handler);

    await resolvePromises();

    expect(handler).toHaveBeenCalled();
  });

  it("should render a ul with a readOnly class", async () => {
    const element = createElement("c-five-star-rating", {
      is: FiveStarRating
    });
    element.readOnly = true;
    document.body.appendChild(element);

    await resolvePromises();

    const ul = element.shadowRoot.querySelector(".readonly");

    expect(ul).not.toBeNull();
  });

  it("should render an editable ul", async () => {
    const element = createElement("c-five-star-rating", {
      is: FiveStarRating
    });
    element.readOnly = false;
    document.body.appendChild(element);

    await resolvePromises();

    const ul = element.shadowRoot.querySelector(".c-rating");

    expect(ul).not.toBeNull();
  });
});
