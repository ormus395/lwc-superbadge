import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";

export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  boatId;
  error;
  boatReviews;
  isLoading = false;

  // Getter and Setter to allow for logic to run on recordId change
  @api get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.boatId = value;
    this.getReviews();
  }

  // Getter to determine if there are reviews to display
  get reviewsToShow() {
    return this.boatReviews?.length > 0;
  }

  // Public method to force a refresh of the reviews invoking getReviews
  @api refresh() {
    this.getReviews();
  }

  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    if (!this.boatId) {
      return;
    }

    this.isLoading = true;
    getAllReviews({ boatId: this.boatId })
      .then((reviews) => {
        if (reviews) {
          this.boatReviews = reviews;
          this.isLoading = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {
    event.preventDefault();
    event.stopPropagation();

    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: event.target.getAttribute("data-record-id"),
        objectApiName: "User",
        actionName: "view"
      }
    });
  }
}
