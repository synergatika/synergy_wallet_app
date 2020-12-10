export const environment = {
  production: true,

  apiUrl: 'https://api.synergatika.gr',
  openUrl: 'https://open.synergatika.gr',
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
    false // true  // partner_fixed_campaign
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

