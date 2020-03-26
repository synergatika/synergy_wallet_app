interface User {
    _id: string;
    email: string;
    name: string;
    imageURL: string;
    access: 'admin' | 'merchant' | 'customer';
}

interface Token {
    token: string;
    expiresIn: number;
}

export interface AuthUser {
    user?: User;
    token?: Token;
    action?: 'need_password_verification' | 'need_email_verification';
}


