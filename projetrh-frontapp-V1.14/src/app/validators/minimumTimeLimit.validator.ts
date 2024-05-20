import {AbstractControl, ValidatorFn} from "@angular/forms";


/**
 * Custom validation function to control that a question has a minimum timeLimit respected.
 * @param minimumSeconds
 */
export function minimumTimeLimitValidator(minimumSeconds: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    const timeLimit = control.value;

    // If empty, don't return any error (at least for now xd)
    if (!timeLimit) {
      return null;
    }

    // Convert format 'mm:ss' to seconds
    const [minutes, seconds] = timeLimit.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;

    // Check if minimum timeLimit is respected (depends on @minimumSeconds)
    if (totalSeconds < minimumSeconds) {
      return { 'timeLimitInvalid': { value: control.value } };
    }

    // Control passed
    return null;
  };
}
