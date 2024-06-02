import {AbstractControl, FormArray, ValidationErrors} from "@angular/forms";

/**
 * Custom validation function to control if at least one "right" box is checked among the answers.
 * @param control
 */
export const atLeastOneRightAnswerValidator = (control: AbstractControl): ValidationErrors | null => {
  // Retrieve the answers Form Array
  const answers = control.get('answers') as FormArray;
  // Check if there is at least one answer with the attribute "right" set to true
  const hasAtLeastOneRightSelected = answers.controls.some((answer: AbstractControl) => answer.get('right')?.value === true);
  // Return null if at least one "right" checkbox is checked, otherwise return a validation error
  return hasAtLeastOneRightSelected ? null : { 'atLeastOneRightSelected': true };
};
