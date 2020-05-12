export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000',
  //apiUrl: 'http://192.168.1.3:3000',
  //apiUrl: 'https://api.synergatika.gr',
  //apiUrl: 'http://192.168.1.160:3000',  
  //apiUrl: 'http://192.168.1.7:3000',
  //apiUrl: 'http://79.129.47.140:3000',
  authTimeOuter: 5000,
  staticUrl: 'https://wp.synergatika.gr/wp-json/wp/v2'
};

/**
 * [0, 0, 0] or [1, 1, 1] etc.
 * 0: Community: (Post and Events)
 * 1: Loyalty: (Loyalty and Offers)
 * 2: Microcredit: (Microcredit and Campaigns)
*/