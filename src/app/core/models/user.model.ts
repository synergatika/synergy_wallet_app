export class User {
    _id: string;
    email: string;
    name: string;
    imageURL: string;
    access: string;
    verified: boolean;
}

export class Token {
    token: string;
    expiresIn: number;
}

export class AuthUser {
    user: User;
    token: Token;
}
