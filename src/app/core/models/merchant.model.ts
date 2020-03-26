interface Address {
    street: string;
    city: string;
    postCode: string;
    coordinates: string[];
}

interface Contact {
    phone: string;
    websiteURL: string;
}

interface Payments {
    nationalBank: string;
    pireausBank: string;
    eurobank: string;
    alphaBank: string;
    paypal: string;
}

export interface Merchant {
    _id?: string;
    email?: string;

    name: string;
    imageURL: string;
    slug?: string;
    subtitle?: string;
    description?: string;
    timetable?: string;
    sector: string;

    contact: Contact;
    address: Address;
    payments?: Payments;

    createdAt?: Date;
}