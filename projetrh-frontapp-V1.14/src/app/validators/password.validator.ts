import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    // At least 8 characters, one uppercase, one lowercase, one digit, and one special character
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // If no value, validation fail.
    if (!value) {
      return { required: true };
    }

    // If password doesn't respect the pattern, validation fail
    if (!passwordPattern.test(value)) {
      return { passwordComplexity: true };
    }

    // Validation succeeds
    return null;
  };
}
