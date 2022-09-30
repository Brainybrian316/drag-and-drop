/// <reference path="base-component.ts" />

namespace App {
	// ! project list class
	export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
		dragOverHandler(event: DragEvent) {
			// we check if the event is a valid drop event we check type of event
			if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
				// tells the browser for this element we want to allow the drop
				event.preventDefault();
				// get the ul element and set the background color
				const listEl = this.element.querySelector('ul')!;
				listEl.classList.add('droppable');
			}
		}

		@AutoBind
		dropHandler(event: DragEvent) {
			const projectId = event.dataTransfer!.getData('text/plain');
			// we use the static method from the project state class
			projectState.moveProject(
				projectId,
				this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished,
			);
		}

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
}
