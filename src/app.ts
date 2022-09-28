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
	}

	private clearInputs() {
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
		this.element.addEventListener('submit', this.submitHandler);
	}

	private attach() {
		// place to render content and get access to concrete HTML element stored in the 'this' property
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}
// create a new instance of the class to render the form to the DOM when the app loads
const prjInput = new ProjectInput();
