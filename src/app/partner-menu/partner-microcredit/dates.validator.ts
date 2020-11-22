import { AbstractControl } from '@angular/forms';

export class DatesValidator {
	/**
	 * Check startSupportData, endSupportDate, startRedeemDate, endRedeemDate
	 * @param control AbstractControl
	 */
    static DatesValidator(control: AbstractControl) {
        const supportStarts = Date.parse(control.get('supportStarts').value);
        const supportEnds = Date.parse(control.get('supportEnds').value);
        const redeemStarts = Date.parse(control.get('redeemStarts').value);
        const redeemEnds = Date.parse(control.get('redeemEnds').value);

        if ((supportStarts > supportEnds) || (supportStarts > redeemStarts) || (redeemStarts > redeemEnds) || (supportEnds > redeemEnds)) {
            if (supportStarts > supportEnds) {
                console.log("SupportStartsGreaterThanSupportEnds")
                control.get('supportStarts').setErrors({ SupportStartsGreaterThanSupportEnds: true });
                control.get('supportEnds').setErrors({ SupportStartsGreaterThanSupportEnds: true });
            }

            if (supportStarts > redeemStarts) {
                console.log("SupportStartsGreaterThanRedeemStarts")
                control.get('supportStarts').setErrors({ SupportStartsGreaterThanRedeemStarts: true });
                control.get('redeemStarts').setErrors({ SupportStartsGreaterThanRedeemStarts: true });
            }

            if (redeemStarts > redeemEnds) {
                console.log("RedeemStartsGreaterThanRedeemEnds")
                control.get('redeemStarts').setErrors({ RedeemStartsGreaterThanRedeemEnds: true });
                control.get('redeemEnds').setErrors({ RedeemStartsGreaterThanRedeemEnds: true });
            }

            if (supportEnds > redeemEnds) {
                console.log("SupportEndsGreaterThanRedeemEnds")
                control.get('supportEnds').setErrors({ SupportEndsGreaterThanRedeemEnds: true });
                control.get('redeemEnds').setErrors({ SupportEndsGreaterThanRedeemEnds: true });
            }
        } else {
            return null;
        }
    }
}