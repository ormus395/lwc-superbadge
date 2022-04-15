import { createElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEventName } from "lightning/platformShowToastEvent";
import FiveStarRating from "../fiveStarRating";

async function resolvePromises() {
  return Promise.resolve();
}

describe("c-five-star-rating", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  describe("the components public properties", () => {
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
  });

  describe("dispatch error toast event on failed resource load", () => {
    it("should display an error toast if loadscript or loadstyle fail", async () => {
      const handler = jest.fn();
      const element = createElement("c-five-star-rating", {
        is: FiveStarRating
      });
      document.body.appendChild(element);

      element.addEventListener(ShowToastEventName, handler);
      await resolvePromises();

      expect(handler).toHaveBeenCalled();
    });
  });
});
