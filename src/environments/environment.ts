// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  apiUrl: 'http://localhost:3000',
  //apiUrl: 'https://api.synergatika.gr',
  openUrl: 'https://open.synergatika.gr',
  //apiUrl: 'http://192.168.1.160:3000',
  //apiUrl: 'http://192.168.1.7:3000',
  //apiUrl: 'http://79.129.47.140:3000',
  staticUrl: 'https://wp.synergatika.gr/wp-json/wp/v2',
  authTimeOuter: 5000,

  mapApiKey: 'AIzaSyC8tI34nghyWlMaQhGluC9f6jG7E8swyVQ',
  mapOptions: { "latitude": 37.9709831, "longitude": 23.7224135, "zoom": 12 },

  access: [
    true, // community,
    true, // loyalty,
    true, // microcredit,
    false // microfunding
  ],
  subAccess: [
    true, //partner_address,
    true, // partner_contacts,
    true, // partner_payments,
    true, // partner_auto_registration,
    false // partner_fixed_campaign
  ],

  version: '0.5.0',

  fixedMicrocreditCampaign: {
    'title': 'One Click Microcredit Campaign',
    'subtitle': 'Support',
    'terms': 'Support Us',
    'description': 'Description',
    'category': 'Random',
    'access': 'public',
    'quantitative': 'true',
    'minAllowed': '1',
    'maxAllowed': '15',
    'stepAmount': '1',
    'maxAmount': '5000',
    'whenSupportStarts': 0, //days
    'whenSupportEnds': 360, //days
    'whenRedeemStarts': 361, //days
    'whenRedeemEnds': 720, //days
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
