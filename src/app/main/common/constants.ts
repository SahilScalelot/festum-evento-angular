import {environment} from "src/environments/environment";

/* eslint-disable @typescript-eslint/naming-convention */
export const CONSTANTS = {

  message: {
    INITIAL: 'Please enter search criteria and hit search button.',
    INTERNAL_ERROR: 'Oops Something went wrong..!',
    INTERNAL_SERVER_ERROR: 'Oops Internal Server error..!',
    NETWORK_ERROR: 'Oops! Connection/Network error..!'
  },

  errorCodes: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND_HTTP_EXCEPTION: 404,
    PERMISSION_DENIED: 404,
    METHOD_NOT_FOUND: 405,
    ALREADY_EXISTS: 406,
    DATABASE_INITIALIZATION_FAIL: 407,
    ERROR_CODE_VALIDATION_FAILED: 422,
    INVALID_DOMAIN: 433,
    TOKEN_EXPIRED: 466,
    TOKEN_REQUIRED: 477,
    INTERNAL_SERVER_ERROR: 500
  },

  userDefaultImage: './assets/images/avatars/profile.jpg',
  defaultImage: './assets/images/default/default-image.jpeg',
  defaultPdfImage: './assets/images/default/pdf.png',
  profileBgImage: './assets/images/background/profile-bg.jpg',
  logo: './assets/images/logo/logo.png',
  secondLogo: './assets/images/logo/second-logo.png',

  baseImageURL: environment.baseImageURL,
  appUrl: environment.appURL,

  eventType: {
    B2B: 'B2B',
    PUBLIC: 'PP',
  },

  seatingType: {
    TABLE: 1,
    SOFA: 2,
    CHAIR: 3,
    BOOTH: 4,
    STAND: 5
  },

  seatingTypesObj: {
    1: {value: 1, label: 'Table'},
    2: {value: 2, label: 'Sofa'},
    3: {value: 3, label: 'Chair'},
    4: {value: 4, label: 'Booth'},
    5: {value: 5, label: 'Stand'}
  },

  seatingItems: [
    {value: 1, label: 'Table'},
    {value: 2, label: 'Sofa'},
    {value: 3, label: 'Chair'},
    {value: 4, label: 'Booth'},
    {value: 5, label: 'Stand'}
  ],

  unitTypeArr: <any>{
    'B2B': <any>{
      value: <any>'B2B',
      label: <string>'B2B',
      options: <any>[
        "Conference",
        "Seminar",
        "VIP Event",
        "Company Meeting",
        "Bussiness Gathering",
        "Trade Show/Expo",
        "Leadership Event",
        "Networking Event",
        "Ceremonies/Galas",
        "Job Fairs/ Recruting Events",
        "Products Launch",
      ]
    },
    'PP': <any>{
      value: <any>'PP',
      label: <string>'PP',
      options: <any>[
        "Conventions",
        "Carity Event",
        "Opening Ceremonies",
        "Sport Event",
        "Award Ceremony",
        "Fundraising Event",
        "Music Event",
        "Talks & Book Presentation",
        "Local Shoppers Events",
        "Nightlife Event",
        "Food & Cooking Event",
        "Festival Event"
      ]
    },
  },

  locationsObj: {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
  },

  locationsArr: [
    {value: 0, label: 'Top'},
    {value: 1, label: 'Right'},
    {value: 2, label: 'Down'},
    {value: 3, label: 'Left'}
  ],

  maxImageSizeInMB: 5,
  maxVideoSizeInMB: 512,
  maxCompanyVideoSizeInMB: 2,
  defaultMapZoom: 12,
  latitude: 21.1702,
  longitude: 72.8311,
  googleMapApiKey: 'AIzaSyDLgr8YB5IK8dBIEWClexZGzXaB7UlVm7Q'
};


