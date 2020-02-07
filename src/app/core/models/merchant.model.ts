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

export interface Merchant {
    _id: string;
    email?: string;

    name: string;
    imageURL: string;
    sector: string;

    contact: Contact
    address: Address

    createdAt?: Date;
}