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

  userDefaultImage: './assets/images/profile.jpg',

  baseImageURL: environment.baseImageURL,
  appUrl: environment.appURL,

  eventTypeObj: {
    b2b: 0,
    public_party: 1
  },

  eventTypeArr: [
    {value: 'b2b', label: 'B2B', displayLabel: 'B2B'},
    {value: 'public_party', label: 'Public Party', displayLabel: 'PP'}
  ],

  verticalLocationsObj: {
    TOP: 0,
    CENTER: 1,
    BOTTOM: 2
  },

  verticalLocationsArr: [
    {value: 'TOP', label: 'Top'},
    {value: 'CENTER', label: 'Center'},
    {value: 'BOTTOM', label: 'Bottom'}
  ],

  horizontalLocationsObj: {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
  },

  horizontalLocationsArr: [
    {value: 'NONE', label: 'None'},
    {value: 'LEFT', label: 'Left'},
    {value: 'RIGHT', label: 'Right'},
  ],

  maxImageSizeInMB: 5,
  maxVideoSizeInMB: 512,
  maxCompanyVideoSizeInMB: 2,
  defaultMapZoom: 12,
  latitude: 21.228125,
  longitude: 72.833771,
  googleMapApiKey: 'AIzaSyDLgr8YB5IK8dBIEWClexZGzXaB7UlVm7Q'
};