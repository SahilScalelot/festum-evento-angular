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

  seatingItems: [
    {value: 1, label: 'Table'},
    {value: 2, label: 'Sofa'},
    {value: 3, label: 'Chair'},
    {value: 4, label: 'Booth'},
    {value: 5, label: 'Stand'}
  ],

  unitTypeArr:<any> {
    'B2B':<any> {
      value:<any> 'B2B',
      label:<string> 'B2B',
      options:<any> [
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
    'PP':<any> {
      value:<any> 'PP',
      label:<string> 'PP',
      options:<any> [
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
  }
};


