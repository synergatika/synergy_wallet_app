export const environment = {
  production: true,

  apiUrl: 'https://api.synergatika.gr',
  staticUrl: 'https://wp.synergatika.gr/wp-json/wp/v2',
  authTimeOuter: 5000,

  access: [true, true, true, false],// community, loyalty, microcredit, microfunding
  subAccess: [true, true, true], //partner_address, partner_contact,  partner_payments

  version: '0.5.0'
};

/**
 * [0, 0, 0] or [1, 1, 1] etc.
 * 0: Community: (Post and Events)
 * 1: Loyalty: (Loyalty and Offers)
 * 2: Microcredit: (Microcredit and Campaigns)
*/