/// <reference path="base-component.ts" />
/// <reference path="../utils/validation.ts" />
/// <reference path="../decorator/autobind.ts" />

namespace App {
	//! project input class
	export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
		// these are the fields of our class
		titleInputElement: HTMLInputElement;
		descriptionInputElement: HTMLInputElement;
		peopleInputElement: HTMLInputElement;

		constructor() {
			super('project-input', 'app', true, 'user-input');

			/* we store the input element with the id of 'title' in the 'titleInputElement' property from the form element called this.element  since that is technically the from element */
			this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
			// same as above but this is the input field with the id of 'description'
			this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
			// same as above but this is the input field with the id of 'people'
			this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

			// call the configure method to set up the event listener for the form
			this.configure();
		}
		// keeping a separation of concerns is why we are setting this up as private
		configure() {
			// when the form is submitted, call the submitHandler method
			this.element.addEventListener('submit', this.submitHandler);
		}

		renderContent() {}

		// tuple type and the void type tells TS there is a chance that this method will return nothing
		private gatherUserInput(): [string, string, number] | void {
			// set the values of the input fields to the variables
			const enteredTitle = this.titleInputElement.value;
			const enteredDescription = this.descriptionInputElement.value;
			const enteredPeople = this.peopleInputElement.value;

			// create and object with the validatable properties
			const titleValidatable: ValidationTemplate = {
				// fields of the interface
				value: enteredTitle, // value of the input field for title
				required: true, // tells the validator that the value is required
			};
			const descriptionValidatable: ValidationTemplate = {
				value: enteredDescription, // value of the input field for description
				required: true,
				minLength: 5, // tells the validator that the value must be at least 5 characters long
			};
			const peopleValidatable: ValidationTemplate = {
				// + converts the string to a number
				value: +enteredPeople, // value of the input field for people
				required: true,
				min: 1, // tells the validator that the value must be at least 1
				max: 5, // tells the validator that the value must be less than 5
			};

			// approach 1
			// if (
			//   enteredTitle.trim().length === 0 ||
			//   enteredDescription.trim().length === 0 ||
			//   enteredPeople.trim().length === 0
			// ) {
			//   alert('Invalid input, please try again!');
			//   return;
			// } else {
			//   return [enteredTitle, enteredDescription, +enteredPeople];
			// }

			// cleaner approach
			if (
				// checks if any of the values are false and if so returns false aka the alert
				!validate(titleValidatable) ||
				!validate(descriptionValidatable) ||
				!validate(peopleValidatable)
			) {
				alert('Invalid input, please try again!');
				return;
			} else {
				return [enteredTitle, enteredDescription, +enteredPeople];
			}
		}

		private clearInputs() {
			// set the value of the input fields to an empty string
			this.titleInputElement.value = '';
			this.descriptionInputElement.value = '';
			this.peopleInputElement.value = '';
		}

		@AutoBind
		// binding the configure method to this method so that we can use 'this' in the configure method
		private submitHandler(event: Event) {
			event.preventDefault();
			const userInput = this.gatherUserInput();
			// Array is built into JS and is a global object... isArray is a static method on the Array object
			if (Array.isArray(userInput)) {
				// destructure the array into 3 variables
				const [title, desc, people] = userInput;
				// store the values in a new project and pass it to the state class to add it to the projects array
				projectState.addProject(title, desc, people);
				// clear the input fields
				this.clearInputs();
			}
		}
	}
}
