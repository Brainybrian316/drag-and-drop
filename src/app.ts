// drag and drop interfaces
interface Draggable {
	// drag event is built into TS
	dragStartHandler(event: DragEvent): void;
	dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
	// signals that the thing is a valid drag target
	dragOverHandler(event: DragEvent): void;
	// react to the actual drop that happens
	dropHandler(event: DragEvent): void;
	// visual feedback for the user if dragged over the box or revert visual update
	dragLeaveHandler(event: DragEvent): void;
}

// ! project type
// enum for project status
enum ProjectStatus {
	Active,
	Finished,
}
class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus,
	) {}
}

// listener for listener type field
type Listener<T> = (items: T[]) => void;

// base state class
class State<T> {
	protected listeners: Listener<T>[] = [];

	addListener(listenerFn: Listener<T>) {
		// the idea is to have an array of function references so that when something changes we can loop through them and call them
		this.listeners.push(listenerFn);
	}
}

//! project state management class
class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, people: number) {
		// create a new project with a unique id
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			people,
			ProjectStatus.Active, // default status using the enum
		);
		this.projects.push(newProject);
		// loop through all the listeners and call them to update the UI
		for (const listenerFn of this.listeners) {
			// use slice so it doesn't mutate the original array
			listenerFn(this.projects.slice());
		}
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

//! component base class (abstract means no one can instantiate this class)
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string,
	) {
		// '!' tells typescript to be non-null
		this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
		// 'as' is type casting to let typescript know this will be of 'element'
		this.hostElement = document.getElementById(hostElementId)! as T;

		// importNode is a document property on the document object 'content' exist on HTML elements
		const importedNode = document.importNode(this.templateElement.content, true); // takes 2 arguments
		// points to the node element of the template element which is a ul element in this case
		this.element = importedNode.firstElementChild as U; // keep in mind the first child will be a <ul>
		// check if newElementId is defined since it is optional
		if (newElementId) {
			// dynamically set the id of the ul element'
			this.element.id = newElementId;
		}

		this.attach(insertAtStart);
	}

	// takes in argument from the constructor
	private attach(insertAtBeginning: boolean) {
		// if insertAtBeginning is true then insert the element at the beginning of the host element else...
		this.hostElement.insertAdjacentElement(
			insertAtBeginning ? 'afterbegin' : 'beforeend',
			this.element,
		);
	}

	abstract configure(): void;

	abstract renderContent(): void;
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

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
	private project: Project;

	get plural() {
		if (this.project.people === 1) {
			return '1 person';
		} else {
			return `${this.project.people} persons`;
		}
	}

	constructor(hostId: string, project: Project) {
		// id of the template element, id of the host element which is the ul element, we insert at the end, id of the li element(project)
		super('single-project', hostId, false, project.id);
		// references the project property of the class
		this.project = project;

		// passed down from the base class
		this.configure();
		this.renderContent();
	}

	@AutoBind
	dragStartHandler(event: DragEvent) {
		console.log(event);
	}

	dragEndHandler(_: DragEvent) {}

	configure() {
		// 'dragstart' is a built in event
		this.element.addEventListener('dragstart', this.dragStartHandler);
		// 'dragend' is a built in event
		this.element.addEventListener('dragend', this.dragEndHandler);
	}
	renderContent() {
		this.element.querySelector('h2')!.textContent = this.project.title;
		this.element.querySelector('h3')!.textContent = this.plural + ' assigned';
		this.element.querySelector('p')!.textContent = this.project.description;
	}
}

// ! project list class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
	// class fields
	assignedProjects: Project[];

	constructor(private type: 'active' | 'finished') {
		super('project-list', 'app', false, `${type}-projects`);
		// reference the field above
		this.assignedProjects = [];

		this.configure();
		this.renderContent();
	}

	@AutoBind
	dragOverHandler(_: DragEvent) {
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.add('droppable');
	}

	dropHandler(_: DragEvent) {}

	@AutoBind
	dragLeaveHandler(_: DragEvent) {
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.remove('droppable');
	}

	// configure method
	configure() {
		// register listeners on the element itself (this.element)
		this.element.addEventListener('dragover', this.dragOverHandler);
		this.element.addEventListener('dragleave', this.dragLeaveHandler);
		this.element.addEventListener('drop', this.dropHandler);
		// reach out to project state class  to register a listener and pass in a function that will be called when the state changes
		projectState.addListener((projects: Project[]) => {
			// filter the project based on if they are active or finished
			const relevantProjects = projects.filter((prj) => {
				if (this.type === 'active') {
					return prj.status === ProjectStatus.Active;
				}
				return prj.status === ProjectStatus.Finished;
			});
			// set assigned projects to the projects that we are getting when a project is added
			this.assignedProjects = relevantProjects;
			// call render projects to render the projects to the DOM via renderProjects method
			this.renderProjects();
		});
	}

	// will only be called when the state changes
	private renderProjects() {
		// rely on the id of the render content method to determine which projects to render
		const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
		// clear the list to avoid duplicates
		listEl.innerHTML = '';
		// loop through and render all the projects we add/have
		for (const projectItem of this.assignedProjects) {
			// create an instance of the project item class and pass in the id of the list element and the project
			new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
		}
	}

	renderContent() {
		// set the list id to the type of project
		const listId = `${this.type}-project-list`;
		// get the ul element telling TS it will not be null and set the id to the listId
		this.element.querySelector('ul')!.id = listId;
		// this 'type' is active or finished (heading of section)
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
	}
}

//! project input class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
// create a new instance of the class to render the form to the DOM when the app loads
const prjInput = new ProjectInput();

const activeProjectList = new ProjectList('active');

const finishedProjectList = new ProjectList('finished');
