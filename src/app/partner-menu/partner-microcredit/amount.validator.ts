import { AbstractControl } from '@angular/forms';

export class AmountValidator {
    /**
     * Check minAllowed, stepAmount, stepAmount, maxAmount
     * @param control AbstractControl
     */
    static AmountValidator(control: AbstractControl) {
        const quantitative = control.get('quantitative').value;
        const minAllowed = control.get('minAllowed').value;
        const maxAllowed = control.get('maxAllowed').value;
        const stepAmount = control.get('stepAmount').value;
        const maxAmount = control.get('maxAmount').value;

        if ((!quantitative && (minAllowed > maxAmount)) || (quantitative && (minAllowed > maxAllowed)) || (quantitative && (stepAmount > maxAllowed)) || (quantitative && (maxAllowed > maxAmount))) {
            if (!quantitative && (minAllowed > maxAmount)) {
                control.get('maxAmount').setErrors({ MaxAmountGreaterThanMinAllowed: true });
            }
            if (quantitative && (minAllowed > maxAllowed)) {
                control.get('maxAllowed').setErrors({ MinAllowedGreaterThanMaxAllowed: true });
            }
            if (quantitative && (stepAmount > maxAllowed)) {
                control.get('maxAllowed').setErrors({ StepAmountGreaterThanMaxAllowed: true });
            }
            if (quantitative && (maxAllowed > maxAmount)) {
                control.get('maxAmount').setErrors({ MaxAllowedGreaterThanMaxAmount: true });
            }
        } else {
            return null;
        }
    }
}