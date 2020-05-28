export const environment = {
  production: true,

  apiUrl: 'https://api.synergatika.gr',
  staticUrl: 'https://wp.synergatika.gr/wp-json/wp/v2',
  authTimeOuter: 5000,

  access: [
    true, // community,
    true, // loyalty,
    true, // microcredit,
    false // microfunding
  ],
  subAccess: [
    true, //partner_address,
    true, // partner_contact,
    true, // partner_payments, 
    true, // partner_auto_registration, 
    true  // partner_fixed_campaign
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

