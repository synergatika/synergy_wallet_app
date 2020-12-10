import { Injectable } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
//import Swal from 'sweetalert2';

import { PaymentList, ContactList, GeneralList, LanguageFlag } from 'sng-core';

@Injectable({
    providedIn: 'root'
})
export class StaticDataService {

    imageMaxSize: number = 2097152;
    imagesMaxNumber: number = 3;
    /**
     * Owl Carousel
     */
    customOptionsTwo: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: false,
        pullDrag: false,
        dots: true,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            740: {
                items: 2
            }
        },
        margin: 30,
        nav: true
    };

    customOptionsThree: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: false,
        pullDrag: false,
        dots: true,
        navSpeed: 700,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            940: {
                items: 3
            }
        },
        margin: 30,
        nav: true,
    }

    /**
     * Languages
     */
    languages: LanguageFlag[] = [
        {
            lang: 'en',
            name: 'English',
            flag: './assets/flags/united-kingdom.svg'
        },
        {
            lang: 'el',
            name: 'Ελληνικά',
            flag: './assets/flags/greece.svg'
        },
    ];

    /**
     * Badges Images
     */
    badgesImages = {
        supporter: '../../../assets/media/images/ranking-1.png',
        helper: '../../../assets/media/images/ranking-2.png',
        one_of_us: '../../../assets/media/images/ranking-3.png',
    };

    /**
     * Contacts List
     */
    contactsList: ContactList[] = [
        // {
        //     slug: 'Phone',
        //     title: 'FIELDS.PROFILE.CONTACT_CHOICES.A',
        //     name: 'Phone',
        //     icon: 'phone',
        //     value: '',
        //     description: '',
        // }
        {
            slug: 'WEB',
            prefix: 'https://www.',
            title: 'FIELDS.PROFILE.CONTACT_CHOICES.B',
            name: 'Website',
            icon: 'web',
            value: '',
            description: '',
        },
        {
            slug: 'FB',
            prefix: 'https://www.facebook.com/',
            title: 'FIELDS.PROFILE.CONTACT_CHOICES.C',
            name: 'Facebook',
            icon: 'facebook-box',
            value: '',
            description: '',
        },
        {
            slug: 'TW',
            prefix: 'https://twitter.com/',
            title: 'FIELDS.PROFILE.CONTACT_CHOICES.D',
            name: 'Twitter',
            icon: 'twitter-box',
            value: '',
            description: '',
        },
        {
            slug: 'IG',
            prefix: 'https://www.instagram.com/',
            title: 'FIELDS.PROFILE.CONTACT_CHOICES.E',
            name: 'Instagram',
            icon: 'instagram',
            value: '',
            description: '',
        },
        {
            slug: 'YT',
            prefix: 'https://www.youtube.com/channel/',
            title: 'FIELDS.PROFILE.CONTACT_CHOICES.F',
            name: 'Youtube',
            icon: 'youtube',
            value: '',
            description: '',
        },
    ];

    /**
     * Payments List
     */
    paymentsList: PaymentList[] = [
        {
            bic: 'ETHNGRAA',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.A',
            name: 'NationalBankofGreece',
            icon: '',
            value: '',
            description: '',
        },
        {
            bic: 'PIRBGRAA',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.B',
            name: 'PiraeusBank',
            icon: '',
            value: '',
            description: '',
        },
        {
            bic: 'EFGBGRAA',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.C',
            name: 'EFGEurobankErgasias',
            icon: '',
            value: '',
            description: '',
        },
        {
            bic: 'CRBAGRAA',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.D',
            name: 'AlphaBankAE',
            icon: '',
            value: '',
            description: '',
        },
        // {
        //     bic: 'PAYPAL',
        //     title: 'FIELDS.PROFILE.PAYMENT_CHOICES.E',
        //     name: 'Paypal',
        //     icon: '',
        //     value: '',
        //     description: '',
        // },
        {
            bic: 'PAYPAL.ME',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.F',
            name: 'PayPal.Me',
            icon: '',
            value: '',
            description: '',
        },
    ];

    /**
     * Sectors List
     */
    sectorList: GeneralList[] = [
        {
            title: 'FIELDS.PROFILE.SECTOR_CHOICES._',
            value: 'Other',
        },
        {
            title: 'FIELDS.PROFILE.SECTOR_CHOICES.A',
            value: 'B2B Services & Other Goods and Services',
        },
        {
            title: 'FIELDS.PROFILE.SECTOR_CHOICES.B',
            value: 'Durables',
        },
        {
            title: 'FIELDS.PROFILE.SECTOR_CHOICES.C',
            value: 'Durables (Technology)',
        },
        {
            title: 'FIELDS.PROFILE.SECTOR_CHOICES.D',
            value: 'Education',
        },
        {
            title: 'FIELDS.PROFILE.SECTOR_CHOICES.E',
            value: 'Food',
        },
        {
            title: 'FIELDS.PROFILE.SECTOR_CHOICES.F',
            value: 'Hotels, Cafés and Restaurants',
        },
        {
            title: 'FIELDS.PROFILE.SECTOR_CHOICES.G',
            value: 'Recreation and Culture',
        }
    ];

    /**
     * Access List
     */
    accessList: GeneralList[] = [
        {
            title: 'FIELDS.POST.ACCESS_CHOICES.A',
            value: 'public',
        },
        {
            title: 'FIELDS.POST.ACCESS_CHOICES.B',
            value: 'private',
        },
        {
            title: 'FIELDS.POST.ACCESS_CHOICES.C',
            value: 'partners',
        }
    ];

    /**
     * Map Style & Pin Style
     */

    mapStyle_pinStyle = {
        pin: {
            url: 'assets/media/images/pin.png',
            scaledSize: {
                width: 15,
                height: 15
            }
        },
        mapStyle: [{
            "featureType": "all", "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "administrative", "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "administrative", "elementType": "labels.text.fill",
            "stylers": [{ "color": "#444444" }, { "visibility": "off" }]
        }, {
            "featureType": "administrative.neighborhood", "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "landscape", "elementType": "all",
            "stylers": [{ "visibility": "on" }, { "color": "#e0dfe0" }]
        }, {
            "featureType": "landscape", "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "poi", "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "poi", "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "poi.park", "elementType": "geometry",
            "stylers": [{ "color": "#a8a9a8" }, { "visibility": "on" }]
        }, {
            "featureType": "road", "elementType": "all",
            "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
        }, {
            "featureType": "road", "elementType": "geometry.fill",
            "stylers": [{ "visibility": "on" }, { "color": "#5b5b5a" }]
        }, {
            "featureType": "road", "elementType": "labels",
            "stylers": [{ "visibility": "on" }]
        }, {
            "featureType": "road.highway", "elementType": "all",
            "stylers": [{ "visibility": "simplified" }]
        }, {
            "featureType": "road.highway", "elementType": "labels",
            "stylers": [{ "visibility": "on" }]
        }, {
            "featureType": "road.arterial", "elementType": "labels.icon",
            "stylers": [{ "visibility": "on" }]
        }, {
            "featureType": "transit", "elementType": "all",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "transit", "elementType": "labels",
            "stylers": [{ "visibility": "on" }]
        }, {
            "featureType": "water", "elementType": "all",
            "stylers": [{ "color": "#ffffff" }, { "visibility": "on" }]
        }, {
            "featureType": "water", "elementType": "labels",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "featureType": "all", "elementType": "labels",
            "stylers": [{ "gamma": 0.26 }, { "visibility": "off" }]
        },
        // {
        //     "featureType": "administrative.province", "elementType": "all",
        //     "stylers": [{ "visibility": "on" }, { "lightness": -50 }]
        // },
        // {
        //     "featureType": "administrative.province", "elementType": "labels.text",
        //     "stylers": [{ "lightness": 20 }]
        // },
        // {
        //     "featureType": "administrative.province", "elementType": "labels.text.stroke",
        //     "stylers": [{ "visibility": "off" }]
        // },
        // {
        //     "featureType": "poi", "elementType": "all",
        //     "stylers": [{ "visibility": "off" }]
        // },
        {
            "featureType": "road", "elementType": "all",
            "stylers": [{ "hue": "#ffffff" }]
        },
        // {
        //     "featureType": "road", "elementType": "labels.text.stroke",
        //     "stylers": [{ "visibility": "off" }]
        // },
        {
            "featureType": "road.highway", "elementType": "geometry",
            "stylers": [{ "lightness": 50 }, { "hue": "#ffffff" }]
        },
        {
            "featureType": "road.highway", "elementType": "labels.text",
            "stylers": [{ "visibility": "on" }]
        }, {
            "featureType": "road.arterial", "elementType": "geometry",
            "stylers": [{ "lightness": 20 }]
        },
        {
            "featureType": "road.arterial", "elementType": "labels.text",
            "stylers": [{ "visibility": "on" }]
        },
        {
            "featureType": "road.local", "elementType": "labels.text",
            "stylers": [{ "visibility": "on" }]
        }]
    };

    /**
     * Form Validators
     */
    validators = {
        imageURL: {
            maxSize: this.imageMaxSize,
            maxNumber: this.imagesMaxNumber
        },
        user: {
            email: {
                minLength: 4,
                maxLength: 256
            },
            password: {
                minLength: 4,
                maxLength: 64
            },
            name: {
                minLength: 4,
                maxLength: 256
            },
            subtitle: {
                minLength: 4,
                maxLength: 512
            },
            description: {
                minLength: 16,
                maxLength: 4096
            },
            address: {
                street: {
                    minLength: 0,
                    maxLength: 128
                },
                postCode: {
                    minLength: 0,
                    maxLength: 16
                },
                city: {
                    minLength: 0,
                    maxLength: 128
                },
                coordinates: {
                    minLength: 0,
                    maxLength: 16
                },
                lat: {
                    minValue: -90,
                    maxValue: 90,
                },
                long: {
                    minValue: -180,
                    maxValue: 180,
                },
            },
            phone: {
                minLength: 0,
                maxLength: 16
            },
            // contact: {
            //     phone: {
            //         minLength: 0,
            //         maxLength: 16
            //     },
            // websiteURL: {
            //     minLength: 0,
            //     maxLength: 256
            // }
            // },
            timeTable: {
                minLength: 0,
                maxLength: 1024
            },
            payment: {
                minLength: 0,
                maxLength: 1024
            },
            deactivation_reason: {
                minLength: 0,
                maxLength: 1024
            }
        },
        post: {
            title: {
                minLength: 4,
                maxLength: 256
            },
            subtitle: {
                minLength: 4,
                maxLength: 512
            },
            content: {
                minLength: 8,
                maxLength: 4096
            }
        },
        event: {
            title: {
                minLength: 4,
                maxLength: 256
            },
            subtitle: {
                minLength: 4,
                maxLength: 512
            },
            content: {
                minLength: 16,
                maxLength: 4096
            },
            location: {
                minLength: 4,
                maxLength: 264
            }
        },
        offer: {
            title: {
                minLength: 4,
                maxLength: 256
            },
            subtitle: {
                minLength: 4,
                maxLength: 512
            },
            description: {
                minLength: 16,
                maxLength: 4096
            },
            cost: {
                minValue: 0,
                maxValue: 100000
            }
        },
        microcredit: {
            title: {
                minLength: 4,
                maxLength: 256
            },
            subtitle: {
                minLength: 4,
                maxLength: 512
            },
            description: {
                minLength: 16,
                maxLength: 4096
            },
            terms: {
                minLength: 16,
                maxLength: 4096
            },
            category: {
                minLength: 2,
                maxLength: 128
            },
            minAllowed: {

            },
            maxAllowed: {
                minValue: 0,
                maxValue: 100000
            },
            stepAmount: {
                minValue: 0,
                maxValue: 100000
            },
            maxAmount: {
                minValue: 0,
                maxValue: 100000
            }
        }
    }

    public get getOwlOptionsTwo(): OwlOptions {
        return this.customOptionsTwo;
    };

    public get getOwlOptionsThree(): OwlOptions {
        return this.customOptionsThree;
    };

    public get getLanguages(): LanguageFlag[] {
        return this.languages;
    };

    public get getBadgesImages() {
        return this.badgesImages;
    };

    public get getPaymentsList(): PaymentList[] {
        return this.paymentsList;
    };

    public get getContactsList(): ContactList[] {
        return this.contactsList;
    };

    public get getSectorList(): GeneralList[] {
        return this.sectorList;
    }

    public get getAccessList(): GeneralList[] {
        return this.accessList;
    }

    public get getValidators() {
        return this.validators;
    }

    public get getMapPinStyle() {
        return this.mapStyle_pinStyle;
    }
}
