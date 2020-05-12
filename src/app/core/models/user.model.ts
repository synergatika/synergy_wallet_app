export interface User {
    _id?: string;
    email?: string;
    card?: string
    createdAt?: Date;

    name: string;
    imageURL: string;
    activated?: boolean;
}