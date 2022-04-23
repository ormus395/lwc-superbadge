import { LightningElement, wire } from "lwc";
import {
  getRecord,
  getFieldValue,
  getFieldDisplayValue
} from "lightning/uiRecordApi";
import {
  subscribe,
  MessageContext,
  APPLICATION_SCOPE
} from "lightning/messageService";
import { NavigationMixin } from "lightning/navigation";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
// Custom Labels Imports
// import labelDetails for Details
import labelDetails from "@salesforce/label/c.Details";
// import labelReviews for Reviews
import labelReviews from "@salesforce/label/c.Reviews";
// import labelAddReview for Add_Review
import labelAddReview from "@salesforce/label/c.Add_Review";
// import labelFullDetails for Full_Details
import labelFullDetails from "@salesforce/label/c.Full_Details";
// import labelPleaseSelectABoat for Please_select_a_boat
import labelPleaseSelectABoat from "@salesforce/label/c.Please_select_a_boat";
// Boat__c Schema Imports
import BOAT_ID_FIELD from "@salesforce/schema/Boat__c.Id";
import BOAT_NAME_FIELD from "@salesforce/schema/Boat__c.Name";
import BOAT_TYPE_NAME from "@salesforce/schema/Boat__c.BoatType__r.Name";
// import BOAT_ID_FIELD for the Boat Id
// import BOAT_NAME_FIELD for the boat Name
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD, BOAT_TYPE_NAME];
export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  boatId;

  @wire(getRecord, { recordId: "$boatId", fields: BOAT_FIELDS })
  wiredRecord;

  @wire(MessageContext)
  messageContext;

  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat
  };

  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
    return this.wiredRecord.data ? "utility:anchor" : null;
  }

  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() {
    console.log(this.wiredRecord);
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
  }

  get boatTypeName() {
    return getFieldValue(this.wiredRecord.data, BOAT_TYPE_NAME);
  }

  // Private
  subscription = null;

  // Subscribe to the message channel
  subscribeMC() {
    // local boatId must receive the recordId from the message
    if (this.subscription || this.boatId) {
      return;
    }

    this.subscription = subscribe(
      this.messageContext,
      BOATMC,
      (message) => {
        this.boatId = message.recordId;
      },
      { scope: APPLICATION_SCOPE }
    );
  }

  // Calls subscribeMC()
  connectedCallback() {
    this.subscribeMC();
  }

  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.boatId,
        objectApiName: "Boat__c",
        actionName: "view"
      }
    });
  }

  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() {
    console.log("review created");
    this.template.querySelector("lightning-tabset").activeTabValue = "reviews";
  }
}
