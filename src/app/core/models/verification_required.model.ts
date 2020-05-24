export interface VerificationRequired {
    action: 'need_password_verification' | 'need_email_verification' | 'need_account_activation';
}