import {AbstractControl, FormArray, ValidationErrors} from "@angular/forms";

/**
 * Custom validation function to control if at least one "right" box is checked among the answers.
 * @param control
 */
export const atLeastOneRightAnswerValidator = (control: AbstractControl): ValidationErrors | null => {

  const answers = control.get('answers') as FormArray;

  const hasAtLeastOneRightSelected = answers.controls.some((answer: AbstractControl) => answer.get('right')?.value === true);

  return hasAtLeastOneRightSelected ? null : { 'atLeastOneRightSelected': true };
};
