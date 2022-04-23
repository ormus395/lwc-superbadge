import { LightningElement, api, wire, track } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
// ...
const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship it!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";
export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [
    { label: "Name", fieldName: "Name", editable: true },
    { label: "Length", fieldName: "Length__c", editable: true },
    { label: "Price", fieldName: "Price__c", editable: true },
    { label: "Description", fieldName: "Description__c", editable: true }
  ];
  boatTypeId = "";
  @track boats;
  isLoading = false;

  get renderBoats() {
    return this.boats?.data.length > 0;
  }

  // wired message context
  @wire(MessageContext)
  messageContext;
  // wired getBoats method
  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  wiredBoats(result) {
    if (result.data) {
      this.boats = result;
      this.isLoading = false;
      this.notifyLoading(false);
    }
  }

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    this.boatTypeId = boatTypeId;
    this.isLoading = true;
    this.notifyLoading(true);
  }

  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api async refresh() {
    this.isLoading = true;
    this.notifyLoading(true);
    await refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(false);
  }

  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    // explicitly pass boatId to the parameter recordId
    const payload = { recordId: boatId };
    publish(this.messageContext, BOATMC, payload);
  }

  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then(() => {
        return this.dispatchEvent(
          new ShowToastEvent({
            title: SUCCESS_TITLE,
            variant: SUCCESS_VARIANT,
            message: MESSAGE_SHIP_IT
          })
        );
      })
      .catch((error) => {
        return this.dispatchEvent(
          new ShowToastEvent({
            title: ERROR_TITLE,
            variant: ERROR_VARIANT
          })
        );
      })
      .finally(() => {
        this.refresh();
      });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading) {
      this.dispatchEvent(new CustomEvent("loading"));
    } else {
      this.dispatchEvent(new CustomEvent("doneloading"));
    }
  }
}