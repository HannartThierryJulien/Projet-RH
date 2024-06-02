import { Directive } from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

/**
 * Directive use to ensure password complexity is high enough.
 * For the moment (01/06/2024), only used when user signup.
 */
@Directive({
  selector: '[passwordValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true
    }
  ]
})
export class PasswordValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const isValid = passwordPattern.test(value);
    return isValid ? null : { passwordComplexity: true };
  }
}
