export interface RegistrationStatus {
    status: 'email_both' | 'email_none' | 'email_no_card' | 'card_both' | 'card_none' | 'card_no_email';
}