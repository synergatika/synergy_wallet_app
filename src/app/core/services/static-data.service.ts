import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


interface Menu {
    title: string,
    link: string,
    icon: string,
    enable?: boolean
}

@Injectable({
    providedIn: 'root'
})
export class StaticDataService {

    memberMenu: Menu[] = [
        {
            title: 'MENU.WALLET',
            link: 'dashboard',
            icon: 'wallet-outline',
            enable: true
        },
        {
            title: 'MENU.DISCOVER',
            link: 'explore',
            icon: 'compass-outline',
            enable: true
        },
        {
            title: 'MENU.SUPPORT',
            link: 'support',
            icon: 'handshake',
            enable: environment.access[2]
        },
    ];

    public get getMemberMenu() {

        return this.memberMenu.filter((el) => {
            return el.enable === true
        });
    };

    adminMenu: Menu[] = [
        {
            title: 'MENU.PARTNERS',
            link: 'a-partners',
            icon: 'handshake',
            enable: true
        },
        {
            title: 'MENU.MEMBERS',
            link: 'a-members',
            icon: 'handshake',
            enable: true
        },
        {
            title: 'MENU.CONTENT',
            link: 'a-content',
            icon: 'content-paste',
            enable: true
        }
    ];

    public get getAdminMenu() {
        return this.adminMenu.filter((el) => {
            return el.enable === true
        });
    };

    partnerMenu: Menu[] = [
        {
            title: 'MENU.HOME',
            link: 'scanner',
            icon: 'home-roof',
            enable: true
        },
        {
            title: 'MENU.OFFERS',
            link: 'm-offers',
            icon: 'muffin',
            enable: environment.access[1]
        },
        {
            title: 'MENU.CAMPAIGNS',
            link: 'm-campaigns',
            icon: 'set-none',
            enable: environment.access[2]
        },
        {
            title: 'MENU.POSTS',
            link: 'm-posts',
            icon: 'file-document',
            enable: environment.access[0]
        },
        {
            title: 'MENU.EVENTS',
            link: 'm-events',
            icon: 'calendar',
            enable: environment.access[0]
        }
    ];

    public get getPartnerMenu() {
        return this.partnerMenu.filter((el) => {
            return el.enable === true
        });
    };

    subMenuSettings = [
        {
            title: 'SETTINGS.SUBMENU.PERSONAL_INFORMATION',
            link: 'personal-information',
            icon: '',
            enable: true
        },
        {
            title: 'SETTINGS.SUBMENU.CHANGE_PASSWORD',
            link: 'change-password',
            icon: '',
            enable: true
        },
        {
            title: 'SETTINGS.SUBMENU.ACCOUNT_SETTINGS',
            link: 'account-settings',
            icon: '',
            enable: true
        }
    ];

    public get getSettingsSubMenu() {
        return this.subMenuSettings.filter((el) => {
            return el.enable === true
        });
    };

    subMenuHistory = [
        {
            title: 'HISTORY.SUBMENU.LOYALTY',
            link: 'loyalty',
            icon: '',
            enable: environment.access[1]
        },
        {
            title: 'HISTORY.SUBMENU.MICROCREDIT',
            link: 'microcredit',
            icon: '',
            enable: environment.access[2]
        }
    ];

    public get getHistorySubMenu() {
        return this.subMenuHistory.filter((el) => {
            return el.enable === true
        });
    };

    subUserHistory = [
        {
            title: 'MENU.SETTINGS',
            link: 'settings',
            icon: '',
            enable: true
        },
        {
            title: 'MENU.HISTORY',
            link: 'history',
            icon: '',
            enable: (environment.access[1] || environment.access[2])
        }
    ];

    public get getUserSubMenu() {
        return this.subUserHistory.filter((el) => {
            return el.enable === true
        });
    };

    paymentsList = [
        {
            bic: 'ETHNGRAA',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.A',
            name: 'NationalBankofGreece',
            value: '',
            description: '',
        },
        {
            bic: 'PIRBGRAA',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.B',
            name: 'PiraeusBank',
            value: '',
            description: '',
        },
        {
            bic: 'EFGBGRAA',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.C',
            name: 'EFGEurobankErgasias',
            value: '',
            description: '',
        },
        {
            bic: 'CRBAGRAA',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.D',
            name: 'AlphaBankAE',
            value: '',
            description: '',
        },
        {
            bic: 'PAYPAL',
            title: 'FIELDS.PROFILE.PAYMENT_CHOICES.E',
            name: 'Paypal',
            value: '',
            description: '',
        }
    ];

    public get getPaymentsList() {
        return this.paymentsList;
    };

    sectorList = [
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

    accessList = [
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

    userValidator = {
        email: {
            minLength: 3,
            maxLength: 254
        },
        password: {
            minLength: 5,
            maxLength: 32
        },
        name: {
            minLength: 3,
            maxLenth: 254
        }
    };

    offerValidator = {
        title: {
            minLength: 3,
            maxLenth: 128
        },
        subtitle: {
            minLength: 3,
            maxLenth: 128
        },
        description: {
            minLength: 8,
            maxLenth: 1024
        },
        cost: {
            minValue: 0,
            maxValue: 100000
        },
        expiresAt: {

        }
    };

    postValidator = {
        title: {
            minLength: 3,
            maxLenth: 128
        },
        subtitle: {
            minLength: 3,
            maxLenth: 128
        },
        content: {
            minLength: 8,
            maxLenth: 1024
        }
    };

    eventValidator = {
        title: {
            minLength: 3,
            maxLenth: 128
        },
        subtitle: {
            minLength: 3,
            maxLenth: 128
        },
        description: {
            minLength: 8,
            maxLenth: 1024
        },
        location: {
            minLength: 3,
            maxLenth: 264
        }
    };

    microcreditValidator = {
        title: {
            minLength: 3,
            maxLenth: 128
        },
        subtitle: {
            minLength: 3,
            maxLenth: 128
        },
        description: {
            minLength: 8,
            maxLenth: 1024
        },
        terms: {
            minLength: 8,
            maxLenth: 1024
        },
        category: {
            minLength: 3,
            maxLenth: 128
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
    };

    public get getSectorList() {
        return this.sectorList;
    }

    public get getAccessList() {
        return this.accessList;
    }

    public get getUserValidator() {
        return this.userValidator;
    }

    public get getOfferValidator() {
        return this.offerValidator;
    }

    public get getPostValidator() {
        return this.postValidator;
    }

    public get getEventValidator() {
        return this.eventValidator;
    }

    public get getMicrocreditValidator() {
        return this.microcreditValidator;
    }
}