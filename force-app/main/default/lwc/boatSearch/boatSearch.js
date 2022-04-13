import { LightningElement } from "lwc";

// imports
export default class BoatSearch extends LightningElement {
  isLoading = false;
  // Handles loading event
  handleLoading() {
    console.log("handling loading");
    this.isLoading = true;
  }

  // Handles done loading event
  handleDoneLoading() {
    console.log("Done loading");
    this.isLoading = false;
  }

  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    const searchResultsC = this.template.querySelector("c-boat-search-results");
    searchResultsC.searchBoats(event.detail.boatTypeId);
    // if (searchResultsC) {
    //   searchResultsC.searchBoats(event.detail.boatTypeId);
    // }
  }

  createNewBoat() {
    console.log(this.boats);
  }
}
