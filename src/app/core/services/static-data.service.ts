import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StaticDataService {

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
        },
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
        },
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