namespace App {
	// validator decorator
	export interface ValidationTemplate {
		value: string | number;
		// '?' means optional
		required?: boolean; // true or false
		minLength?: number;
		maxLength?: number;
		min?: number;
		max?: number;
	}

	export function validate(validatableInput: ValidationTemplate) {
		let isValid = true;
		// value is required and not set to empty
		if (validatableInput.required) {
			// ensures new value of isValid will be false if the thing after && is false (if 1 is false all is false)
			isValid = isValid && validatableInput.value.toString().trim().length !== 0;
		}
		// if minLength is not undefined (empty) and that the value is a string
		if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
			// define the length of the value in the object. if the length is less than the minLength, isValid is false
			isValid = isValid && validatableInput.value.length > validatableInput.minLength;
		}
		if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
			isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
		}
		if (validatableInput.min != null && typeof validatableInput.value === 'number') {
			isValid = isValid && validatableInput.value >= validatableInput.min;
		}
		if (validatableInput.max != null && typeof validatableInput.value === 'number') {
			isValid = isValid && validatableInput.value < validatableInput.max;
		}
		// after all the checks, return the value of isValid
		return isValid;
	}
}
