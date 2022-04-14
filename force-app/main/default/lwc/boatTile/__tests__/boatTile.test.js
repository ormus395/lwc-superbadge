import { createElement } from "lwc";
import BoatTile from "../boatTile";

describe("c-boat-tile", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should render a boat tile", () => {
    const boat = {
      Id: "AAA3434343",
      Name: "SS Exists",
      Contact__r: { Name: "The Owner" },
      Price__c: 200000,
      Length__c: 15,
      BoatType__r: { Name: "Yacht" }
    };

    const comp = createElement("c-boat-tile", { is: BoatTile });
    comp.boat = boat;
    document.body.appendChild(comp);
    return Promise.resolve().then(() => {
      const root = comp.shadowRoot;
      const name = root.querySelector("h1").textContent;
      const cName = root.querySelector("h2").textContent;

      expect(name).toBe(boat.Name);
      expect(cName).toBe(boat.Contact__r.Name);
    });
  });

  it("Should change class if selected", () => {
    const boat = {
      Id: "AAA3434343",
      Name: "SS Exists",
      Contact__r: { Name: "The Owner" },
      Price__c: 200000,
      Length__c: 15,
      BoatType__r: { Name: "Yacht" }
    };

    const comp = createElement("c-boat-tile", { is: BoatTile });
    comp.boat = boat;
    comp.selectedBoatId = boat.Id;
    document.body.appendChild(comp);

    return Promise.resolve().then(() => {
      expect(comp.selectedBoatId).toBe(boat.Id);
      expect(comp.shadowRoot.querySelector(`.selected`)).not.toBeNull();
    });
  });

  it("fires custom event on user select", () => {
    const handler = jest.fn();
    const boat = {
      Id: "AAA3434343",
      Name: "SS Exists",
      Contact__r: { Name: "The Owner" },
      Price__c: 200000,
      Length__c: 15,
      BoatType__r: { Name: "Yacht" }
    };

    const comp = createElement("c-boat-tile", { is: BoatTile });
    comp.boat = boat;
    comp.addEventListener("click", handler);
    document.body.appendChild(comp);

    return Promise.resolve().then(() => {
      comp.click();
      expect(handler).toHaveBeenCalled();
    });
  });
});
