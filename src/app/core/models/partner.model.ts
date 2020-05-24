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

interface Bank {
    bic: string;
    name: string;
    value: string;
}

export interface Partner {
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
    payments?: [Bank];

    createdAt?: Date;
}