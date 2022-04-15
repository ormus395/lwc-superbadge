import { LightningElement, wire, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// imports
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
const LABEL_YOU_ARE_HERE = "You are here!";
const ICON_STANDARD_USER = "standard:user";
const ERROR_TITLE = "Error loading Boats Near Me";
const ERROR_VARIANT = "error";
export default class BoatsNearMe extends LightningElement {
  @api boatTypeId = "";
  mapMarkers = [];
  isLoading = true;
  isRendered = false;
  latitude;
  longitude;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, {
    latitude: "$latitude",
    longitude: "$longitude",
    boatTypeId: "$boatTypeId"
  })
  wiredBoatsJSON({ error, data }) {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (data) {
      this.createMapMarkers(data);
    } else if (error) {
      this.isLoading = false;
      const event = new ShowToastEvent({
        title: ERROR_TITLE,
        variant: ERROR_VARIANT
      });

      this.dispatchEvent(event);
    } else {
      this.createMapMarkers([]);
    }
  }

  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    if (!this.isRendered) {
      this.getLocationFromBrowser();
    }

    this.isRendered = true;
  }

  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        () => {
          this.isLoading = false;
          const event = new ShowToastEvent({
            title: ERROR_TITLE,
            variant: ERROR_VARIANT
          });
          this.dispatchEvent(event);
        }
      );
    } else {
      this.isLoading = false;
      const event = new ShowToastEvent({
        title: ERROR_TITLE,
        variant: ERROR_VARIANT
      });
      this.dispatchEvent(event);
    }
  }

  // Creates the map markers
  createMapMarkers(boatData) {
    // const newMarkers = boatData.map(boat => {...});
    // newMarkers.unshift({...});
    if (boatData) {
      const newMarkers = boatData.map((boat) => {
        return {
          title: boat.Name,
          location: {
            Latitude: boat.Geolocation__Latitude__s,
            Longitude: boat.Geolocation__Longitude__s
          }
        };
      });
      newMarkers.unshift({
        title: LABEL_YOU_ARE_HERE,
        icon: ICON_STANDARD_USER,
        location: {
          Latitude: this.latitude,
          Longitude: this.longitude
        }
      });

      this.mapMarkers = newMarkers;
      this.isLoading = false;
    }
  }
}
