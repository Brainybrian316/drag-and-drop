class ProjectInput {
	// these are the fields of our class
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;

	constructor() {
		// '!' tells typescript to be non-null
		this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
		// 'as' is type casting to let typescript know this will be of 'element'
		this.hostElement = document.getElementById('app')! as HTMLDivElement;

		// importNode is a document property on the document object 'content' exist on HTML elements
		const importedNode = document.importNode(this.templateElement.content, true); // takes 2 arguments
		// points to the node element of the template element which is a form element in this case
		this.element = importedNode.firstElementChild as HTMLFormElement;
		// call attach method to render the form
		this.attach();
	}
	private attach() {
		// place to render content and get access to concrete HTML element stored in the 'this' property
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}

const prjInput = new ProjectInput();
