import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
	/**
	 * Check matching password with confirm password
	 * @param control AbstractControl
	 */
    static MatchPassword(control: AbstractControl) {
        const password = control.get('newPassword').value;

        const confirmPassword = control.get('confirmPassword').value;

        if (password !== confirmPassword) {
            console.log("error error 4");
            control.get('confirmPassword').setErrors({ ConfirmPassword: true });
        } else {
            return null;
        }
    }
}
