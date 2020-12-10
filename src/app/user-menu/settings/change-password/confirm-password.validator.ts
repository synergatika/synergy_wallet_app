import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
    /**
     * Check matching password with confirm password
     * @param control AbstractControl
     */
    static MatchPassword(control: AbstractControl) {
        const password: string = control.get('password').value;
        const confirmPassword: string = control.get('confirmPassword').value;

        if (password !== confirmPassword) {
            control.get('confirmPassword').setErrors({ ConfirmPassword: true });
        } else {
            control.get('confirmPassword').setErrors(null)
            return null;
        }
    }
}
