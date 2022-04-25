import { createElement } from "lwc";
import { getNavigateCalledWith } from "lightning/navigation";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";
import BoatReviews from "../boatReviews";

jest.mock(
  "@salesforce/apex/BoatDataService.getAllReviews",
  () => {
    return {
      default: jest.fn()
    };
  },
  { virtual: true }
);

jest.mock(
  "@salesforce/apex",
  () => {
    return {
      refreshApex: jest.fn(() => Promise.resolve())
    };
  },
  { virtual: true }
);
const BOAT_ID = "a028b000027JEkAAAW";
const mockGetAllReviews = [
  {
    Id: "a008b00000snD2PAAU",
    Name: "dewdew",
    Comment__c: "<p>deewdewd</p>",
    Rating__c: 4,
    LastModifiedDate: "2022-04-21T20:15:48.000Z",
    CreatedDate: "2022-04-21T20:15:48.000Z",
    CreatedById: "0058b00000F9jAGAAZ",
    CreatedBy: {
      Name: "Jarec Turner",
      SmallPhotoUrl:
        "https://wise-shark-v2nndj-dev-ed--c.documentforce.com/profilephoto/005/T",
      CompanyName: "None",
      Id: "0058b00000F9jAGAAZ"
    }
  },
  {
    Id: "a008b00000snD2KAAU",
    Name: "ttt",
    Comment__c: "<p>tttt</p>",
    Rating__c: 4,
    LastModifiedDate: "2022-04-21T20:14:41.000Z",
    CreatedDate: "2022-04-21T20:14:41.000Z",
    CreatedById: "0058b00000F9jAGAAZ",
    CreatedBy: {
      Name: "Jarec Turner",
      SmallPhotoUrl:
        "https://wise-shark-v2nndj-dev-ed--c.documentforce.com/profilephoto/005/T",
      CompanyName: "None",
      Id: "0058b00000F9jAGAAZ"
    }
  },
  {
    Id: "a008b00000snD25AAE",
    Name: "test",
    Comment__c: "<p>test</p>",
    Rating__c: 4,
    LastModifiedDate: "2022-04-21T20:10:41.000Z",
    CreatedDate: "2022-04-21T20:10:41.000Z",
    CreatedById: "0058b00000F9jAGAAZ",
    CreatedBy: {
      Name: "Jarec Turner",
      SmallPhotoUrl:
        "https://wise-shark-v2nndj-dev-ed--c.documentforce.com/profilephoto/005/T",
      CompanyName: "None",
      Id: "0058b00000F9jAGAAZ"
    }
  },
  {
    Id: "a008b00000snBpuAAE",
    Name: "Test Review",
    Comment__c: "<p>Test the add review</p>",
    Rating__c: 3,
    LastModifiedDate: "2022-04-21T18:39:42.000Z",
    CreatedDate: "2022-04-21T18:39:42.000Z",
    CreatedById: "0058b00000F9jAGAAZ",
    CreatedBy: {
      Name: "Jarec Turner",
      SmallPhotoUrl:
        "https://wise-shark-v2nndj-dev-ed--c.documentforce.com/profilephoto/005/T",
      CompanyName: "None",
      Id: "0058b00000F9jAGAAZ"
    }
  }
];

describe("c-boat-reviews", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  async function resolvePromise() {
    return Promise.resolve();
  }
  it("gets a list of boatReviews", async () => {
    getAllReviews.mockResolvedValue(mockGetAllReviews);

    await resolvePromise();
    const element = createElement("c-boat-reviews", { is: BoatReviews });
    element.recordId = BOAT_ID;

    document.body.appendChild(element);

    await resolvePromise();

    const reviews = element.shadowRoot.querySelectorAll("li");

    expect(reviews.length).toBe(mockGetAllReviews.length);
  });

  it("refresh its review list with a public refresh method", async () => {
    const newReview = {
      Id: "a008b00000snBpuAAbn",
      Name: "Test Review",
      Comment__c: "<p>Test the add review</p>",
      Rating__c: 3,
      LastModifiedDate: "2022-04-21T18:39:42.000Z",
      CreatedDate: "2022-04-21T18:39:42.000Z",
      CreatedById: "0058b00000F9jAGAAZ",
      CreatedBy: {
        Name: "Jarec Turner",
        SmallPhotoUrl:
          "https://wise-shark-v2nndj-dev-ed--c.documentforce.com/profilephoto/005/T",
        CompanyName: "None",
        Id: "0058b00000F9jdawdwad"
      }
    };
    getAllReviews.mockResolvedValue(mockGetAllReviews);

    const element = createElement("c-boat-reviews", { is: BoatReviews });
    element.recordId = BOAT_ID;

    document.body.appendChild(element);

    await resolvePromise();
    const reviews = element.shadowRoot.querySelectorAll("li");

    const changedReviews = [...mockGetAllReviews, newReview];
    getAllReviews.mockResolvedValue(changedReviews);

    element.refresh();
    await resolvePromise();
    const newReviews = element.shadowRoot.querySelectorAll("li");

    expect(newReviews.length).toBeGreaterThan(reviews.length);
  });

  it("navigates to a user detail page", async () => {
    getAllReviews.mockResolvedValue(mockGetAllReviews);
    const NAV_TYPE = "standard__recordPage";
    const NAV_OBJECT_API_NAME = "User";
    const NAV_ACTION = "view";

    const element = createElement("c-boat-reviews", { is: BoatReviews });
    element.recordId = BOAT_ID;
    document.body.appendChild(element);

    await resolvePromise();

    // need to get the link from the user
    // click  the link and check to see if a navigation would have happend
    const anchor = element.shadowRoot.querySelector("a");
    anchor.click();

    const { pageReference } = getNavigateCalledWith();

    expect(pageReference.type).toBe(NAV_TYPE);
    expect(pageReference.attributes.objectApiName).toBe(NAV_OBJECT_API_NAME);
    expect(pageReference.attributes.actionName).toBe(NAV_ACTION);
  });
});
