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

	// binding the configure method to this method so that we can use 'this' in the configure method
	private submitHandler(event: Event) {
		event.preventDefault();
		console.log(this.titleInputElement.value);
	}

	// keeping a separation of concerns is why we are setting this up as private
	private configure() {
		this.element.addEventListener('submit', this.submitHandler.bind(this)); // bind the 'this' keyword to the class
	}

	private attach() {
		// place to render content and get access to concrete HTML element stored in the 'this' property
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}
// create a new instance of the class to render the form to the DOM when the app loads
const prjInput = new ProjectInput();
