// import { createElement } from "lwc";
// import BoatSearch from "../boatSearch";

// describe("c-boat-search", () => {
//   afterEach(() => {
//     while (document.body.firstChild) {
//       document.body.removeChild(document.body.firstChild);
//     }
//   });

//   it("handles loading and done loading events", () => {
//     const handler = jest.fn();

//     const comp = createElement("c-boat-search", {
//       is: BoatSearch
//     });
//     document.body.appendChild(comp);
//     comp.addEventListener("loading", handler);
//     comp.addEventListener("doneloading", handler);

//     return Promise.resolve().then(() => {
//       comp.dispatchEvent(new CustomEvent("loading"));
//       comp.dispatchEvent(new CustomEvent("doneloading"));

//       expect(handler).toBeCalledTimes(2);
//     });
//   });
// });
