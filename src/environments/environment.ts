// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  // apiUrl: 'http://192.168.1.3:3000',
  //apiUrl: 'https://api.synergatika.gr',
  //apiUrl: 'http://192.168.1.160:3000',  
  //apiUrl: 'http://192.168.1.7:3000',
  //apiUrl: 'http://79.129.47.140:3000',
  authTimeOuter: 5000,
  staticUrl: 'https://wp.synergatika.gr/wp-json/wp/v2',
  access: [true, true, true, false],// community, loyalty, microcredit, microfunding
  subAccess: [true, true, true], //partner_address, partner_contact,  partner_payments

  version: '0.5.0'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
