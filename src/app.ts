//! project state management class
class ProjectState {
	private projects: any[] = [];
	private static instance: ProjectState;

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, people: number) {
		const newProject = {
			id: Math.random().toString(),
			title: title,
			description: description,
			people: people,
		};
		this.projects.push(newProject);
	}
}

const projectState = ProjectState.getInstance();

/* notes: 
1. decorators take 3 arguments: target, propertyKey, descriptor
2. target is the class prototype
3. propertyKey is the name of the method
4. descriptor is the property descriptor for the method
*/
// auto bind decorator
function AutoBind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
	// descriptor.value is the original method implementation (the function)
	const originalMethod = descriptor.value;
	// adjustedDescriptor is the new property descriptor for the method
	const adjustedDescriptor: PropertyDescriptor = {
		// configurable is set to true so that the method can be overwritten
		configurable: true,
		// get is a getter function that returns a new function
		get() {
			// we bind the original method to the instance of the class.
			const boundFn = originalMethod.bind(this);
			// we return the bound function
			return boundFn;
		},
	};
	// we return the adjusted descriptor to overwrite the original descriptor
	return adjustedDescriptor;
}

// validator decorator
interface ValidationTemplate {
	value: string | number;
	// '?' means optional
	required?: boolean; // true or false
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: ValidationTemplate) {
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

// ! project list class
class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLElement;

	constructor(private type: 'active' | 'finished') {
		// '!' tells typescript to be non-null
		this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
		// 'as' is type casting to let typescript know this will be of 'element'
		this.hostElement = document.getElementById('app')! as HTMLDivElement;

		// importNode is a document property on the document object 'content' exist on HTML elements
		const importedNode = document.importNode(this.templateElement.content, true); // takes 2 arguments
		// points to the node element of the template element which is a ul element in this case
		this.element = importedNode.firstElementChild as HTMLElement; // keep in mind the first child will be a <ul>
		// dynamically set the id of the ul element'
		this.element.id = `${this.type}-projects`;
		this.attach();
		this.renderContent();
	}

	private renderContent() {
		// set the list id to the type of project
		const listId = `${this.type}-project-list`;
		// get the ul element telling TS it will not be null and set the id to the listId
		this.element.querySelector('ul')!.id = listId;
		// this 'type' is active or finished (heading of section)
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
	}

	private attach() {
		this.hostElement.insertAdjacentElement('beforeend', this.element);
	}
}

//! project input class
class ProjectInput {
	// these are the fields of our class
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		// '!' tells typescript to be non-null
		this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
		// 'as' is type casting to let typescript know this will be of 'element'
		this.hostElement = document.getElementById('app')! as HTMLDivElement;

		// importNode is a document property on the document object 'content' exist on HTML elements
		const importedNode = document.importNode(this.templateElement.content, true); // takes 2 arguments
		// points to the node element of the template element which is a form element in this case
		this.element = importedNode.firstElementChild as HTMLFormElement; // keep in mind this is the form element
		// makes sure the rendered element has the id of 'user-input'
		this.element.id = 'user-input';

		/* we store the input element with the id of 'title' in the 'titleInputElement' property from the form element called this.element  since that is technically the from element */
		this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
		// same as above but this is the input field with the id of 'description'
		this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
		// same as above but this is the input field with the id of 'people'
		this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

		// call the configure method to set up the event listener for the form
		this.configure();
		// call attach method to render the form
		this.attach();
	}

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
			// log the variables
			console.log(title, desc, people);
			// clear the input fields
			this.clearInputs();
		}
	}

	// keeping a separation of concerns is why we are setting this up as private
	private configure() {
		// when the form is submitted, call the submitHandler method
		this.element.addEventListener('submit', this.submitHandler);
	}

	private attach() {
		// place to render content and get access to concrete HTML element stored in the 'this' property
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}
// create a new instance of the class to render the form to the DOM when the app loads
const prjInput = new ProjectInput();

const activeProjectList = new ProjectList('active');

const finishedProjectList = new ProjectList('finished');
